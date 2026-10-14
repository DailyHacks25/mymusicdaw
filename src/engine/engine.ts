/**
 * The Intelligent Drummer engine (PRD §5 — full spec implementation).
 *
 * Architecture:
 *   authored seed grid (base / add / sub layers)
 *     + procedural variation layer (per-note thresholds, fills, follow)
 *       -> semantic articulation stream (DrumHit[])
 *         -> mapping profile (profiles.ts) -> MIDI
 *
 * Determinism & variation (PRD §5):
 *   - Every region owns a consistent pseudorandom seed.
 *   - Per-note activation thresholds are drawn ONCE per (seed, archetype),
 *     in a fixed iteration order. Moving a macro never reshuffles the RNG —
 *     e.g. Complexity 40→50 activates more `add` notes in place; the groove
 *     the producer already likes stays intact.
 *
 * Complexity model (PRD §5):
 *   - 0-50:  additive unmasking of ghost notes / 16ths from the Base Layer
 *   - 50-100: cross-fade to the Substitution Layer (syncopation, alternate
 *             hat articulations) instead of adding more notes
 *
 * Grid: 24 steps per beat (96 per bar) so 16ths, 32nds, 8th-triplets and
 * 16th-triplets are all exact. PPQ 480 → 20 ticks per step.
 */

import type { ArticulationId } from "./articulations";
import { ARTICULATION_META, letterToArticulation, familyOf } from "./articulations";
import { getArchetype, SEED_LIBRARY } from "./seedLibrary";
import { gaussian, hashSeed, mulberry32 } from "./rng";
import { allowedFillBeats, FILLS } from "./fills";
import type { FillTemplate } from "./fills";
import { SOURCE_TRACKS } from "./sources";
import { TICKS_PER_BAR, PPQ } from "./midi";
import type { MappingProfile } from "./profiles";
import type { DrumHit } from "./hit";
import type { DrummerRegion, MacroState, MidiNote } from "./types";
import { clamp } from "./types";

export const STEPS_PER_BEAT = 24;
export const STEPS_PER_BAR = 96;
export const TICKS_PER_STEP = PPQ / 24; // 20
export const TICKS_PER_16TH = 120;

export function resolveArchetype(region: DrummerRegion): string {
  if (region.archetypeId && getArchetype(region.persona, region.archetypeId)) {
    return region.archetypeId;
  }
  const lib = SEED_LIBRARY[region.persona];
  const rng = mulberry32(hashSeed(region.seed, `archetype:${region.persona}`));
  return lib[Math.floor(rng() * lib.length)].id;
}

/**
 * Fill bar selection (PRD §5 "Fill Heuristics"):
 *  - grid aligned so fills bias toward region boundaries regardless of setting
 *  - off: none; rare: every 16 bars; standard: every 8; frequent: every 4;
 *    turnarounds: region ends only
 *  - manual override: force → last bar; mute → none
 * Bar indices are 0-based; a fill on bar b occupies the tail of that bar.
 */
export function computeFillBars(macros: MacroState, bars: number): number[] {
  if (bars < 1) return [];
  if (macros.fillOverride === "mute") return [];
  if (macros.fillOverride === "force") return [bars - 1];
  if (macros.fillFrequency === "off") return [];
  if (macros.fillFrequency === "turnarounds") return bars >= 2 ? [bars - 1] : [];
  if (bars < 4) return [];
  const every = macros.fillFrequency === "rare" ? 16 : macros.fillFrequency === "standard" ? 8 : 4;
  const out: number[] = [];
  for (let b = bars - 1; b >= 1; b -= every) out.push(b);
  return out.reverse();
}

interface PlacedNote {
  step: number;
  articulation: ArticulationId;
  origin: "base" | "add" | "sub" | "fill" | "follow";
  threshold: number; // 0 for base
}

function collectSeedNotes(region: DrummerRegion, archetypeId: string): PlacedNote[] {
  const arch = getArchetype(region.persona, archetypeId)!;
  const rng = mulberry32(hashSeed(region.seed, `notes:${archetypeId}`));
  const notes: PlacedNote[] = [];
  const families = ["kick", "snare", "hat", "tom", "cym"] as const;

  for (const layerName of ["base", "add", "sub"] as const) {
    const layer = arch[layerName];
    for (let bar = 0; bar < region.bars; bar++) {
      const barName = arch.sequence[bar % 4];
      for (const fam of families) {
        const rows = layer[fam]?.[barName];
        if (!rows) continue;
        for (const row of rows) {
          const stepsPerCell = STEPS_PER_BAR / row.length; // 6 / 3 / 8 / 4
          for (let i = 0; i < row.length; i++) {
            const ch = row[i];
            if (ch === ".") continue;
            const art = letterToArticulation(ch);
            if (!art) continue;
            const threshold = layerName === "base" ? 0 : rng();
            notes.push({
              step: bar * STEPS_PER_BAR + Math.round(i * stepsPerCell),
              articulation: art,
              origin: layerName,
              threshold,
            });
          }
        }
      }
    }
  }
  return notes;
}

/**
 * Activate layers by Complexity.
 * Returns the deduped (step, articulation) note set.
 */
function activateByComplexity(notes: PlacedNote[], complexity: number): Map<string, PlacedNote> {
  const fracAdd = clamp(complexity, 0, 100) / 50; // 0..1, frozen at 1
  const fracSub = complexity <= 50 ? 0 : (complexity - 50) / 50;
  const out = new Map<string, PlacedNote>();
  for (const n of notes) {
    let active: boolean;
    if (n.origin === "base") active = true;
    else if (n.origin === "add") active = fracAdd > n.threshold;
    else active = fracSub > n.threshold;
    if (!active) continue;
    const key = `${n.step}:${n.articulation}`;
    const prev = out.get(key);
    if (!prev) out.set(key, n);
    // duplicates from overlapping rows: keep whichever layer is "higher"
    // (sub > add > base) so substitutions win their cross-fade slot
    else if (n.origin !== "base" && prev.origin === "base") out.set(key, n);
  }
  // Substitution cross-fade: an active sub hat note at a step carrying a
  // base/add hat note replaces it (PRD: "alternate hat articulations").
  const hats = [...out.values()].filter((n) => familyOf(n.articulation) === "hat");
  const subHats = hats.filter((n) => n.origin === "sub");
  for (const sh of subHats) {
    for (const other of hats) {
      if (other !== sh && other.step === sh.step && other.origin !== "sub") {
        out.delete(`${other.step}:${other.articulation}`);
      }
    }
  }
  return out;
}

function expandFill(template: FillTemplate, startStep: number): PlacedNote[] {
  const out: PlacedNote[] = [];
  const push = (row: string, start: number, origin: "fill") => {
    for (let i = 0; i < row.length; i++) {
      const ch = row[i];
      if (ch === ".") continue;
      const art = letterToArticulation(ch);
      if (!art) continue;
      out.push({ step: start + i * (STEPS_PER_BEAT / 4), articulation: art, origin, threshold: 0 });
    }
  };
  push(template.tom, startStep, "fill");
  push(template.snare, startStep, "fill");
  push(template.hat, startStep, "fill");
  return out;
}

function placeFills(region: DrummerRegion, active: Map<string, PlacedNote>): void {
  const fillBars = computeFillBars(region.macros, region.bars);
  if (fillBars.length === 0) return;
  const allowed = allowedFillBeats(region.macros.complexity);
  const rng = mulberry32(hashSeed(region.seed, "fills"));
  const history: string[] = [];
  const all = FILLS[region.persona];

  for (const bar of fillBars) {
    let pool = all.filter((t) => allowed.includes(t.beats) && !history.includes(t.id));
    if (pool.length === 0) pool = all.filter((t) => allowed.includes(t.beats));
    if (pool.length === 0) pool = all;
    const pick = pool[Math.floor(rng() * pool.length)];
    history.push(pick.id);
    if (history.length > 2) history.shift(); // N=2 history buffer

    const endStep = (bar + 1) * STEPS_PER_BAR;
    const startStep = endStep - pick.beats * STEPS_PER_BEAT;
    // Suppress groove notes the fill replaces (keep the kick anchor).
    for (const [key, n] of active) {
      const fam = familyOf(n.articulation);
      if (n.origin !== "fill" && (fam === "snare" || fam === "hat" || fam === "tom")) {
        if (n.step >= startStep && n.step < endStep) active.delete(key);
      }
    }
    for (const n of expandFill(pick, startStep)) {
      active.set(`${n.step}:${n.articulation}`, n);
    }
  }
  if (!region.mutes.cymbals && region.bars >= 1) {
    const crash: PlacedNote = { step: 0, articulation: "cymbal_crash", origin: "fill", threshold: 0 };
    active.set("0:cymbal_crash", crash);
  }
}

function applyFollow(region: DrummerRegion, active: Map<string, PlacedNote>): void {
  if (!region.followSource) return;
  const src = SOURCE_TRACKS[region.followSource];
  const rng = mulberry32(hashSeed(region.seed, "follow"));
  const kickAt = new Set<number>();
  for (const [key, n] of active) {
    if (familyOf(n.articulation) === "kick") kickAt.add(n.step);
  }
  for (const sn of src.notes) {
    const phraseBar = Math.floor(sn.step / 16);
    const inBar16 = sn.step % 16;
    const step = inBar16 * (STEPS_PER_BEAT / 4);
    for (let bar = phraseBar; bar < region.bars; bar += 4) {
      const s = bar * STEPS_PER_BAR + step;
      if (kickAt.has(s)) continue;
      const p = 0.5 + 0.5 * (sn.velocity / 127);
      if (rng() < p) {
        active.set(`${s}:kick_normal`, { step: s, articulation: "kick_normal", origin: "follow", threshold: 0 });
        kickAt.add(s);
      }
    }
  }
}

function velocityFor(art: ArticulationId, intensity: number, followScale = 1): number {
  const meta = ARTICULATION_META[art];
  const scale = 0.75 + 0.35 * (intensity / 100);
  const accent = meta.accent ? 12 * (intensity / 100) : 0;
  return Math.round(clamp(meta.baseVelocity * scale + accent, 8, 127) * followScale);
}

/**
 * Generate the semantic articulation stream for one region.
 * Pure function of (region) — identical output for identical input.
 */
export function generateRegion(region: DrummerRegion): DrumHit[] {
  const archetypeId = resolveArchetype(region);
  const m = region.macros;
  const active = activateByComplexity(collectSeedNotes(region, archetypeId), m.complexity);
  placeFills(region, active);
  applyFollow(region, active);

  // Mutes (PRD §5 "Section-Awareness": per-region instrument mutes)
  const muted: Record<string, boolean> = {
    kick: region.mutes.kick,
    snare: region.mutes.snare,
    hat: region.mutes.hats,
    tom: region.mutes.toms,
    cymbal: region.mutes.cymbals,
  };

  const k = 1 - clamp(m.tightness, 0, 100) / 100;
  const sigmaGroove = 22 * k;
  const sigmaInd = 13 * k;
  const rngT = mulberry32(hashSeed(region.seed, "timing"));
  const driftByBar = new Map<number, number>();
  const out: DrumHit[] = [];

  const notes = [...active.values()].sort(
    (a, b) => a.step - b.step || a.articulation.localeCompare(b.articulation)
  );

  for (const n of notes) {
    const fam = familyOf(n.articulation);
    if (muted[fam]) continue;
    const bar = Math.floor(n.step / STEPS_PER_BAR);
    const inBeat = n.step % STEPS_PER_BEAT;

    // Swing: standard triplet ratio on 8th-note off-beats (Logic/Ableton/FL).
    let swingTicks = 0;
    if (inBeat === STEPS_PER_BEAT / 2) swingTicks = (m.swing / 100) * 80;

    // Microtiming: correlated groove drift on kick+snare downbeats, smaller
    // independent offsets on hats/ghost notes (PRD §5 "Microtiming
    // Humanization").
    let drift = 0;
    let ind = 0;
    if (fam === "kick" || fam === "snare") {
      if (inBeat === 0) {
        let d = driftByBar.get(bar);
        if (d === undefined) {
          d = gaussian(rngT) * sigmaGroove - sigmaGroove * 0.25; // slight behind-the-beat bias
          driftByBar.set(bar, d);
        }
        drift = d;
        ind = gaussian(rngT) * sigmaInd * 0.5;
      } else {
        ind = gaussian(rngT) * sigmaInd;
      }
    } else if (fam === "hat" || n.articulation === "snare_ghost") {
      ind = gaussian(rngT) * sigmaInd * 0.55;
    } else if (fam === "cymbal") {
      ind = 0;
    } else {
      ind = gaussian(rngT) * sigmaInd * 0.75;
    }

    const total = clamp(swingTicks + drift + ind, -40, 116);
    out.push({
      step: n.step,
      offsetTicks: Math.round(total),
      articulation: n.articulation,
      velocity: velocityFor(n.articulation, m.intensity, n.origin === "follow" ? 0.85 : 1),
      origin: n.origin,
      debug: {
        swingTicks: Math.round(swingTicks),
        grooveDriftTicks: Math.round(drift),
        humanTicks: Math.round(ind),
      },
    });
  }

  out.sort((a, b) => a.step - b.step || a.offsetTicks - b.offsetTicks || a.articulation.localeCompare(b.articulation));
  return out;
}

/** Convert a generated articulation stream to MIDI via a mapping profile. */
export function hitsToMidi(hits: DrumHit[], profile: MappingProfile): MidiNote[] {
  return hits.map((h) => {
    const map = profile.maps[h.articulation];
    return {
      pitch: map.pitch,
      velocity: Math.round(clamp(h.velocity + map.velOffset, 1, 127)),
      startTicks: Math.max(0, h.step * TICKS_PER_STEP + h.offsetTicks),
      durTicks: ARTICULATION_META[h.articulation].noteLenTicks,
    };
  });
}

/** Region as exportable MIDI: editable regions pass through, others regenerate. */
export function regionToMidi(region: DrummerRegion, profile: MappingProfile): MidiNote[] {
  if (region.editable) return region.editable.notes;
  return hitsToMidi(generateRegion(region), profile);
}

export function regionBarCount(regions: DrummerRegion[]): number {
  return regions.reduce((n, r) => n + r.bars, 0);
}

/** Absolute (project-timeline) notes for every region, in order. */
export function projectNotes(regions: DrummerRegion[], profile: MappingProfile): { regionId: string; notes: MidiNote[]; startTicks: number }[] {
  let tick = 0;
  return regions.map((r) => {
    const start = tick;
    const notes = regionToMidi(r, profile).map((n) => ({ ...n, startTicks: n.startTicks + start }));
    tick += r.bars * TICKS_PER_BAR;
    return { regionId: r.id, notes, startTicks: start };
  });
}
