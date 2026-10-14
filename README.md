# mymusicdaw — Windows DAW (v1)

**The Intelligent Drummer** from the v1 Product Requirements Document, built as a
portable TypeScript engine plus a live web prototype.

- **Engine** (`src/engine/`) — pure, dependency-free TypeScript implementing the full
  PRD §5 "Intelligent Drummer Engine" spec: 4 genre personas, ~140 authored seed
  patterns, procedural macro-driven variation, deterministic seeding, semantic
  articulations, fill engine, MIDI-to-MIDI follow, and Standard MIDI File (SMF)
  export. No DOM, no Web Audio — portable to C++/JUCE later.
- **Web prototype** (`src/web/`) — Vite + React app: play the generated groove with a
  bundled procedural Web Audio kit (the "fallback player"), drive every macro live,
  switch personas/archetypes, see the piano roll, **convert a region to an editable
  MIDI region**, remap articulations to pitches (rompler profile editor), and export
  `.mid` files.

> Status: prototype. The DAW host itself (PRD §4) is intentionally out of scope for
> this pass — see [Out of scope](#out-of-scope).

---

## Quickstart

```bash
npm install
npm run dev        # web prototype → http://localhost:5173
npm test           # 44 unit tests (engine + library + MIDI round-trip)
npm run typecheck  # strict tsc
npm run build      # tsc --noEmit && vite build
```

### Using the prototype

1. **Play** — hit Play in the transport. The bundled Web Audio synth plays the
   generated groove (this is the PRD's "bundled lightweight fallback player").
2. **Personas** — pick one of the 4 persona cards (The Tight Driver, The Beatmaker,
   The Pocket Player, The Groovebox). Pick an archetype, or leave it on
   **Auto (seeded)** and re-roll the seed. "Load persona defaults" applies the
   recommended macro set.
3. **Macros** — Complexity, Intensity, Swing/Groove, Microtiming tightness, plus the
   5-state Fill Frequency dial and per-bar fill override (auto / force / mute). All
   live: move Complexity 40→50 and notes *interpolate into the existing groove*
   (deterministic per-region seeding — the groove never "re-rolls").
4. **Follow** — pick the demo bass or rhythm-guitar phrase; the engine biases kick
   placement toward those onsets (MIDI-to-MIDI follow, PRD §5).
5. **Piano roll** — every region shows its generated MIDI. Click
   **Convert to Editable MIDI** (a Day-1 PRD requirement) to bounce the groove into
   an editable region: click to add notes, drag to move, right-click to delete, and
   adjust velocity. **Revert** regenerates from the engine.
6. **Profiles & export** — switch between General MIDI (default/fallback), Toontrack,
   XLN AD2, and SSD5 profiles; duplicate any profile and remap articulations to
   pitches + velocity offsets (the rompler mapping editor). Export writes all regions
   to a single format-1 `.mid` file at the correct project offsets.

---

## Architecture

```
src/engine/            PURE engine — no DOM, no audio, no React
  types.ts             PersonaId, MacroState, DrummerRegion, EditableRegion, MidiNote
  rng.ts               xmur3 + mulberry32 PRNG, seeded Gaussian (Box–Muller)
  articulations.ts     16 semantic articulations + letter codes (the authoring alphabet)
  patterns.ts          seed-pattern format: bars A–D, rows, base/add/sub layers
  patterns/*.ts        the ~140 authored seed patterns (35 per persona)
  seedLibrary.ts       persona registry: genres, target VSTs, recommended defaults
  fills.ts             48 authored fill templates + complexity→fill-length rules
  sources.ts           follow source phrases (demo bass / rhythm guitar, 4-bar)
  engine.ts            the variation pipeline (see below)
  profiles.ts          GM / Toontrack / XLN / SSD5 articulation→pitch tables
  midi.ts              SMF writer (format-1) + minimal parser (round-trip tested)
  hit.ts               DrumHit + debug info (swing/groove/micro timing offsets)

src/web/               React prototype
  state/store.ts       hand-rolled external store + all UI actions (incl. MIDI export)
  audio/synth.ts       procedural Web Audio drum kit (fallback player)
  audio/player.ts      lookahead scheduler, live region refresh mid-playback
  components/          transport, persona, macros, follow, region timeline,
                       canvas piano roll, profile mapping editor
```

### Engine pipeline (per region)

```
seed + macros + persona/archetype
  → resolve archetype            (explicit id, or deterministic pick from seed)
  → base notes from seed grid    (4-bar phrase tiled across the region)
  → complexity unmask/cross-fade (add 0→50, sub 50→100, deterministic gates)
  → fill engine                  (boundary-biased bars, N=2 history, length ∝ complexity)
  → follow                       (MIDI-to-MIDI kick biasing from a source track)
  → intensity curve              (velocity shaping only — density is untouched)
  → swing                        (triplet swing on off-beats)
  → microtiming humanization     (per-bar groove drift + per-note offsets)
  → hits → profile → MIDI
```

### Key invariants (all covered by tests)

- **Determinism** — identical region + macros ⇒ identical MIDI, every time.
  Different seed ⇒ different groove.
- **Complexity is interpolative** — 40→50 only *adds* notes; 50→100 cross-fades
  (substitution) and never deletes base notes.
- **Intensity is decoupled** — note set is bit-identical at Intensity 0/50/100;
  only velocities change (accent articulations lift more at high Intensity).
- **Swing is exact** — 100% swing moves the off-beat 8th by exactly 1/6 beat
  (80 ticks @ PPQ 480); on-beats stay put.
- **Humanization structure** — tightness 100 ⇒ zero offsets (quantized).
  Kick+snare downbeats share one correlated per-bar groove drift (slightly
  behind-the-beat biased); hats/ghosts get smaller independent offsets.
- **Fill heuristics** — fills bias to region boundaries regardless of frequency
  (every 16/8/4 bars, or region end for "turnarounds only"); length scales with
  Complexity (1 beat → full bar); a 2-deep history buffer bans consecutive repeat
  fills; force/mute override works per bar end; fills suppress snare/hat/tom groove
  notes while the kick anchor holds.
- **Follow** — source onsets quantize to the 16th grid; kicks are only *added*
  where no kick already exists; fully deterministic per seed.
- **Mutes** — per-family mutes (kick/snare/hat/tom/cymbals) respected everywhere,
  including fills.
- **MIDI** — SMF round-trips exactly (writer + parser); export lays regions out at
  cumulative bar offsets in a format-1 file.

---

## The authoring format (seed patterns & fills)

An archetype is a 4-bar phrase of up to 4 unique bars (`A`–`D`) with a sequence
like `"AABA"`. Each bar carries up to 5 family rows — `kick`, `snare`, `hat`, `tom`,
`cym` — and a family can hold multiple rows (e.g. snare + clap layered on one bar).
A row is a string of articulation letters (or `.` for empty).

**Row resolution is inferred from length** (engine grid = 24 steps/beat, 96/bar,
PPQ 480 ⇒ every resolution lands on exact integer steps — triplets and 32nd-note
trap rolls are never approximated):

| Length | Resolution        | Cells/beat |
|-------:|-------------------|-----------:|
| 12     | eighth-note triplets  | 3 |
| 16     | sixteenth notes       | 4 |
| 24     | sixteenth-note triplets | 6 |
| 32     | thirty-second notes   | 8 |

**Alphabet** (one letter per semantic articulation):

| Letter | Articulation        | Letter | Articulation        |
|:------:|---------------------|:------:|---------------------|
| `K`    | kick_normal         | `B`    | tom_low             |
| `k`    | kick_hard (accent)  | `M`    | tom_mid             |
| `S`    | snare               | `T`    | tom_high            |
| `s`    | snare_hard (accent) | `C`    | cymbal_crash        |
| `G`    | snare_ghost         | `D`    | cymbal_ride         |
| `R`    | snare_rimshot       |        |                     |
| `W`    | snare_side          |        |                     |
| `P`    | clap (accent)       |        |                     |
| `H`    | hat_closed          |        |                     |
| `O`    | hat_open            |        |                     |
| `E`    | hat_edge            |        |                     |

Each archetype defines three layers:

- **base** — the core groove (always on).
- **add** — unmasked additively as Complexity rises 0→50 (ghost notes, 16ths,
  fills' neighbors). Thresholds are drawn once per note from the region seed, so
  unmasking is stable and interpolative.
- **sub** — cross-faded in as Complexity rises 50→100 (syncopation, alternate hat
  articulations). A sub hat note *replaces* a base/add hat note at the same step.

Example (tightDriver, `td-01`):

```ts
archetype("td-01", "Standard Backbeat", "AABA",
  { // base
    kick:  bars("K................", "K................", "K................", "K........K......."),
    snare: bars("....S........S...", "....S........S...", "....S........S...", "....S........S..."),
    hat:   bars("H.H.H.H.H.H.H.H.", "H.H.H.H.H.H.H.H.", "H.H.H.H.H.H.H.H.", "H.H.H.H.H.H.H.H."),
  },
  { // add (unmasked at Complexity 0→50)
    snare: bars("...............", "....S.G....S.....", "...............", "....S.G....S....."),
  },
  { // sub (cross-faded at Complexity 50→100)
    hat:   bars("H.H.H.H.H.H.H.H.H.H.H.H.H.H.H.", ...), // 16th-note hats
  },
);
```

**Fills** (`fills.ts`) are authored the same way — 48 templates (12 per persona:
3 per fill length of 1/2/3/4 beats). The fill engine picks a bar (boundary-biased),
a length (Complexity-scaled), and a template (N=2 history bans repeats), drops a
crash at the region/segment start, and suppresss the groove families under the fill
while the kick anchor holds.

The library tests validate every row of all 140 archetypes + fills (length,
alphabet, family) in one aggregated report — keep that green when authoring.

---

## Personas & recommended macro defaults

| Persona | Genre | Target VST | Complexity | Intensity | Swing | Tightness | Fills |
|---|---|---|---:|---:|---:|---:|---|
| The Tight Driver | Rock / Modern Pop | SD3 / EZdrummer | 55 | 62 | 0 | 72 | Standard |
| The Beatmaker | Hip-Hop / Boom-Bap / Trap | Battery / Kontakt | 48 | 64 | 42 | 55 | Rare |
| The Pocket Player | Acoustic / Indie | Addictive Drums 2 | 50 | 48 | 12 | 32 | Standard |
| The Groovebox | Electronic / House | SSD5 / stock | 62 | 72 | 0 | 88 | Rare |

Tightness = microtiming tightness (100 = quantized, 0 = very loose).

### Routing profiles & disclaimer

The engine emits only semantic articulations. Bundled profiles map them to
pitches/velocities: **General MIDI** (default & fallback — also used by the bundled
Web Audio fallback player), **Toontrack (EZdrummer/SD3)**, **XLN Addictive Drums 2**,
**Steven Slate Drums 5**.

> Per PRD §6: the Toontrack/XLN/SSD note maps are documented **best-effort
> approximations**. Verification requires licensed copies of those plugins — that
> verification is an open line item, and the mapping editor exists precisely so
> users can correct entries in a duplicated user profile until then.

---

## What's tested (44 tests)

- `library.test.ts` — 140 archetypes, unique ids, all rows/fills well-formed.
- `engine.test.ts` — every invariant in the "Key invariants" section above.
- `midi.test.ts` — all 4 profiles in-range for all 16 articulations; SMF
  write→parse round-trip exactness (incl. a Toontrack profile + follow + editable
  region at a non-round BPM).

## Out of scope

- **DAW host core (PRD §4)** — tracks, audio engine, UI shell for a Windows app;
  the engine is deliberately shaped to drop into C++/JUCE unchanged.
- Audio transient detection / chord-track follow (PRD explicitly defers these).
- Mastering, mixing bus, VST host integration (profile maps are data, not live VST
  control).
- The seed-pattern *authoring pipeline* (human musicians / data capture) — the 140
  patterns here are hand-authored placeholders for that pipeline.
- PRD §7 NFR numbers (latency budget, crash tolerance) — no numbers specified yet.
- Kit licensing for the bundled fallback (the current fallback is procedural
  synthesis, so no kit asset ships yet).
