import { describe, expect, it } from "vitest";
import {
  computeFillBars,
  generateRegion,
  hitsToMidi,
  projectNotes,
  resolveArchetype,
  STEPS_PER_BAR,
  STEPS_PER_BEAT,
} from "../engine";
import { familyOf } from "../articulations";
import { GENERAL_MIDI, cloneProfile } from "../profiles";
import { makeRegion } from "./library.test";
import type { DrumHit } from "../hit";
import type { DrummerRegion, FillFrequency, MacroState } from "../types";

const sig = (hits: DrumHit[], withOffsets = false) =>
  hits.map((h) => `${h.step}:${h.articulation}${withOffsets ? `+${h.offsetTicks}` : ""}`).sort().join(",");

const withMacros = (macros: Partial<MacroState>) =>
  makeRegion({ macros: { complexity: 50, intensity: 50, swing: 0, tightness: 100, fillFrequency: "off" as FillFrequency, fillOverride: "auto", ...macros } });

describe("Determinism & Variation (PRD §5)", () => {
  it("same region (same seed + macros) always produces the identical stream", () => {
    const r = makeRegion({});
    const a = JSON.stringify(generateRegion(r));
    const b = JSON.stringify(generateRegion({ ...r }));
    expect(a).toBe(b);
  });

  it("different seeds produce different streams (archetype pick + timing)", () => {
    // auto archetypes: the seed picks the pattern
    const auto = (seed: number) => sig(generateRegion(makeRegion({ seed, archetypeId: null })), true);
    expect(auto(1234)).not.toBe(auto(9999));
    // same archetype: the seed still drives the microtiming offsets
    const sameArch = (seed: number) =>
      sig(
        generateRegion(makeRegion({ seed, macros: { complexity: 50, intensity: 50, swing: 0, tightness: 20, fillFrequency: "off", fillOverride: "auto" } })),
        true
      );
    expect(sameArch(1234)).not.toBe(sameArch(9999));
  });

  it("auto archetype resolution is a pure function of (seed, persona)", () => {
    const a = resolveArchetype(makeRegion({ archetypeId: null, seed: 777 }));
    const b = resolveArchetype(makeRegion({ archetypeId: null, seed: 777 }));
    expect(a).toBe(b);
  });

  it("moving Complexity 40→50 interpolates new notes into the existing groove (no re-roll)", () => {
    const lo = sig(generateRegion(withMacros({ complexity: 40 })));
    const hi = sig(generateRegion(withMacros({ complexity: 50 })));
    const loSet = new Set(lo.split(","));
    const hiSet = hi.split(",");
    // every note present at 40 is still present at 50, same position + articulation
    for (const n of loSet) expect(hiSet).toContain(n);
    // and 50 strictly adds material (library has non-empty add layers)
    expect(hiSet.length).toBeGreaterThan(loSet.size);
  });

  it("Complexity is monotonic across 0→50 (additive unmasking)", () => {
    const sets = [0, 10, 25, 40, 50].map((c) => new Set(sig(generateRegion(withMacros({ complexity: c }))).split(",")));
    for (let i = 1; i < sets.length; i++) {
      for (const n of sets[i - 1]) expect(sets[i], `note ${n} dropped between complexities`).toContain(n);
      expect(sets[i].size).toBeGreaterThanOrEqual(sets[i - 1].size);
    }
  });

  it("Complexity 50→100 cross-fades in the substitution layer without deleting base notes (no-replace archetype)", () => {
    // groovebox gb-01's sub layer adds kicks/toms only (no hat replacement)
    const r50 = makeRegion({ persona: "groovebox", archetypeId: "gb-01" });
    const r100 = makeRegion({ persona: "groovebox", archetypeId: "gb-01", macros: { complexity: 100, intensity: 50, swing: 0, tightness: 100, fillFrequency: "off", fillOverride: "auto" } });
    const base50 = generateRegion(r50).filter((h) => h.origin === "base");
    const all100 = generateRegion(r100);
    const set100 = new Set(all100.map((h) => `${h.step}:${h.articulation}`));
    for (const h of base50) {
      expect(set100, `base note ${h.articulation}@${h.step} removed by sub cross-fade`).toContain(`${h.step}:${h.articulation}`);
    }
    // sub notes appear only above 50
    const subs50 = generateRegion(r50).filter((h) => h.origin === "sub");
    expect(subs50.length).toBeLessThan(all100.filter((h) => h.origin === "sub").length);
  });

  it("sub layer cross-fade replaces base hat notes with alternate articulations", () => {
    // td-01: sub hat = edge (E) on bar B 8th positions; base hat = closed (H)
    const r50 = makeRegion({ archetypeId: "td-01", bars: 4, macros: { complexity: 50, intensity: 50, swing: 0, tightness: 100, fillFrequency: "off", fillOverride: "auto" } });
    const r100 = makeRegion({ archetypeId: "td-01", bars: 4, macros: { complexity: 100, intensity: 50, swing: 0, tightness: 100, fillFrequency: "off", fillOverride: "auto" } });
    const h50 = generateRegion(r50).filter((h) => familyOf(h.articulation) === "hat");
    const h100 = generateRegion(r100).filter((h) => familyOf(h.articulation) === "hat");
    const closed50 = h50.filter((h) => h.articulation === "hat_closed").length;
    const edge100 = h100.filter((h) => h.articulation === "hat_edge").length;
    expect(edge100).toBeGreaterThan(0);
    expect(closed50).toBeGreaterThan(0);
  });
});

describe("Intensity (velocity curve only, decoupled from density)", () => {
  it("note density is identical across Intensity values", () => {
    const sigs = [0, 50, 100].map((i) => sig(generateRegion(withMacros({ intensity: i }))));
    expect(sigs[0]).toBe(sigs[1]);
    expect(sigs[1]).toBe(sigs[2]);
  });

  it("velocities rise with Intensity and accent notes get extra shaping", () => {
    const v0 = generateRegion(withMacros({ intensity: 0 }));
    const v100 = generateRegion(withMacros({ intensity: 100 }));
    const mean = (hs: DrumHit[]) => hs.reduce((n, h) => n + h.velocity, 0) / hs.length;
    expect(mean(v100)).toBeGreaterThan(mean(v0));
    // accent (hard) notes: relative gap widens at high intensity
    const byKey = new Map(v0.map((h) => [`${h.step}:${h.articulation}`, h]));
    let accentLift = 0, plainLift = 0, nAcc = 0, nPlain = 0;
    for (const h of v100) {
      const prev = byKey.get(`${h.step}:${h.articulation}`)!;
      const meta = h.articulation.endsWith("_hard") || h.articulation === "clap";
      if (meta) { accentLift += h.velocity - prev.velocity; nAcc++; }
      else if (!h.articulation.endsWith("_ghost")) { plainLift += h.velocity - prev.velocity; nPlain++; }
    }
    expect(nAcc).toBeGreaterThan(0);
    expect(accentLift / nAcc).toBeGreaterThan(plainLift / nPlain);
  });
});

describe("Swing (standard triplet ratio)", () => {
  it("at 100% swing + 100% tightness, 8th off-beats land exactly +80 ticks (1/6 beat at PPQ480)", () => {
    const hits = generateRegion(withMacros({ swing: 100, tightness: 100 }));
    for (const h of hits) {
      const inBeat = h.step % STEPS_PER_BEAT;
      if (inBeat === STEPS_PER_BEAT / 2) {
        expect(h.debug.swingTicks).toBe(80);
        expect(h.offsetTicks).toBe(80);
      } else {
        expect(h.debug.swingTicks).toBe(0);
        expect(h.offsetTicks).toBe(0);
      }
    }
  });

  it("swing scales linearly and never touches on-beats", () => {
    const hits = generateRegion(withMacros({ swing: 50, tightness: 100 }));
    const off = hits.filter((h) => h.step % STEPS_PER_BEAT === STEPS_PER_BEAT / 2);
    expect(off.length).toBeGreaterThan(0);
    for (const h of off) expect(h.offsetTicks).toBe(40);
    const on = hits.filter((h) => h.step % STEPS_PER_BEAT === 0);
    for (const h of on) expect(h.offsetTicks).toBe(0);
  });
});

describe("Microtiming Humanization (tightness; correlated groove drift)", () => {
  it("tightness=100 → strictly on-grid (zero offsets)", () => {
    const hits = generateRegion(makeRegion({})); // default tightness 100, swing 0
    for (const h of hits) expect(h.offsetTicks).toBe(0);
  });

  it("tightness=0 → bounded offsets, kick+snare downbeats share a per-bar groove drift, hats/ghosts carry none", () => {
    const hits = generateRegion(withMacros({ tightness: 0, swing: 0 }));
    for (const h of hits) {
      expect(Math.abs(h.offsetTicks)).toBeLessThanOrEqual(116);
      const fam = familyOf(h.articulation);
      if (fam === "hat" || h.articulation === "snare_ghost") {
        expect(h.debug.grooveDriftTicks).toBe(0);
      }
    }
    // correlated drift: same-bar kick & snare downbeats share the exact drift value
    const byBar = new Map<number, { kick?: DrumHit; snare?: DrumHit }>();
    for (const h of hits) {
      if (h.step % STEPS_PER_BEAT !== 0) continue;
      const fam = familyOf(h.articulation);
      if (fam !== "kick" && fam !== "snare") continue;
      const bar = Math.floor(h.step / STEPS_PER_BAR);
      const slot = byBar.get(bar) ?? {};
      if (fam === "kick" && !slot.kick) slot.kick = h;
      if (fam === "snare" && !slot.snare) slot.snare = h;
      byBar.set(bar, slot);
    }
    let pairs = 0;
    for (const { kick, snare } of byBar.values()) {
      if (kick && snare) {
        expect(kick.debug.grooveDriftTicks).toBe(snare.debug.grooveDriftTicks);
        pairs++;
      }
    }
    expect(pairs).toBeGreaterThan(0);
    // some non-zero drift actually exists
    const drifts = [...byBar.values()].flatMap((s) => [s.kick?.debug.grooveDriftTicks, s.snare?.debug.grooveDriftTicks]).filter((v): v is number => v !== undefined);
    expect(drifts.some((d) => d !== 0)).toBe(true);
  });
});

describe("Fill engine (PRD §5 Fill Heuristics)", () => {
  const fillFreq = (f: FillFrequency) => withMacros({ fillFrequency: f });

  it("computeFillBars: grid is biased toward region boundaries for every frequency", () => {
    expect(computeFillBars({ ...fillFreq("rare").macros }, 24)).toEqual([7, 23]);
    expect(computeFillBars({ ...fillFreq("standard").macros }, 24)).toEqual([7, 15, 23]);
    expect(computeFillBars({ ...fillFreq("frequent").macros }, 8)).toEqual([3, 7]);
    expect(computeFillBars({ ...fillFreq("turnarounds").macros }, 8)).toEqual([7]);
    expect(computeFillBars({ ...fillFreq("off").macros }, 16)).toEqual([]);
    // boundary bias: an 8-bar region still gets its turnaround fill on "rare"
    expect(computeFillBars({ ...fillFreq("rare").macros }, 8)).toEqual([7]);
  });

  it("off → no fill content; manual overrides force/mute", () => {
    const off = generateRegion(fillFreq("off"));
    expect(off.filter((h) => h.origin === "fill" && familyOf(h.articulation) !== "cymbal").length).toBe(0);
    const forced = generateRegion(withMacros({ fillFrequency: "off", fillOverride: "force" }));
    expect(forced.filter((h) => h.origin === "fill" && familyOf(h.articulation) !== "cymbal").length).toBeGreaterThan(0);
    const muted = generateRegion(withMacros({ fillFrequency: "frequent", fillOverride: "mute" }));
    expect(muted.filter((h) => h.origin === "fill" && familyOf(h.articulation) !== "cymbal").length).toBe(0);
  });

  it("fills land on the expected bars (fill content inside the bar's tail)", () => {
    const bars = 24;
    const freqs: FillFrequency[] = ["rare", "standard", "frequent", "turnarounds"];
    for (const f of freqs) {
      const expected = computeFillBars({ complexity: 50, intensity: 50, swing: 0, tightness: 100, fillFrequency: f, fillOverride: "auto" }, bars);
      const hits = generateRegion(makeRegion({ bars, macros: { complexity: 50, intensity: 50, swing: 0, tightness: 100, fillFrequency: f, fillOverride: "auto" } }));
      const fills = hits.filter((h) => h.origin === "fill" && familyOf(h.articulation) !== "cymbal");
      const fillBars = new Set(fills.map((h) => Math.floor(h.step / STEPS_PER_BAR)));
      for (const b of expected) expect(fillBars, `expected fill at bar ${b} (${f})`).toContain(b);
      // nothing outside expected bars
      for (const b of fillBars) expect(expected).toContain(b);
    }
  });

  it("N=2 history buffer bans consecutive repeat fills", () => {
    const bars = 40;
    const hits = generateRegion(makeRegion({ bars, macros: { complexity: 50, intensity: 50, swing: 0, tightness: 100, fillFrequency: "frequent", fillOverride: "auto" } }));
    const byBar = new Map<number, string[]>();
    for (const h of hits) {
      if (h.origin !== "fill" || familyOf(h.articulation) === "cymbal") continue;
      const bar = Math.floor(h.step / STEPS_PER_BAR);
      const list = byBar.get(bar) ?? [];
      list.push(`${h.step % STEPS_PER_BAR}:${h.articulation}`);
      byBar.set(bar, list);
    }
    const seq = [...byBar.entries()].sort((a, b) => a[0] - b[0]).map(([, v]) => v.sort().join("|"));
    expect(seq.length).toBeGreaterThan(2);
    for (let i = 1; i < seq.length; i++) expect(seq[i]).not.toBe(seq[i - 1]);
  });

  it("fill length scales with Complexity: 1 beat at low, full bar at high", () => {
    const at = (c: number) =>
      generateRegion(makeRegion({ macros: { complexity: c, intensity: 50, swing: 0, tightness: 100, fillFrequency: "turnarounds", fillOverride: "auto" } }));
    const low = at(10).filter((h) => h.origin === "fill" && familyOf(h.articulation) !== "cymbal");
    const high = at(100).filter((h) => h.origin === "fill" && familyOf(h.articulation) !== "cymbal");
    const regionEnd = 8 * STEPS_PER_BAR;
    const lowStart = Math.min(...low.map((h) => h.step));
    const highStart = Math.min(...high.map((h) => h.step));
    expect(regionEnd - lowStart).toBeLessThanOrEqual(STEPS_PER_BEAT); // 1-beat fill
    expect(highStart).toBe(regionEnd - 4 * STEPS_PER_BEAT); // full-bar fill
  });

  it("groove notes (snare/hat/tom) are suppressed inside the fill span but the kick anchor survives", () => {
    const hits = generateRegion(makeRegion({ bars: 8, macros: { complexity: 100, intensity: 50, swing: 0, tightness: 100, fillFrequency: "turnarounds", fillOverride: "auto" } }));
    const fills = hits.filter((h) => h.origin === "fill" && familyOf(h.articulation) !== "cymbal");
    const start = Math.min(...fills.map((h) => h.step));
    const end = 8 * STEPS_PER_BAR;
    const grooveInSpan = hits.filter((h) => h.origin !== "fill" && h.step >= start && h.step < end);
    for (const h of grooveInSpan) expect(familyOf(h.articulation)).toBe("kick");
  });
});

describe("Follow Mechanism (MIDI-to-MIDI, kick bias to source onsets)", () => {
  it("adds follow kicks aligned to source 16th positions", () => {
    const plain = generateRegion(makeRegion({}));
    const followed = generateRegion(makeRegion({ followSource: "demoBass" }));
    const followHits = followed.filter((h) => h.origin === "follow");
    expect(followHits.length).toBeGreaterThan(0);
    expect(followHits.length).toBeLessThan(followed.length);
    for (const h of followHits) {
      expect(h.articulation).toBe("kick_normal");
      expect(h.step % 6).toBe(0); // quantized to the 16th grid (16th = 6 steps on the 24-step beat)
    }
    expect(followHits.length).toBeLessThanOrEqual(24);
    // deterministic
    expect(JSON.stringify(generateRegion(makeRegion({ followSource: "demoBass" })))).toBe(JSON.stringify(followed));
  });
});

describe("Section-Awareness (per-region state)", () => {
  it("instrument mutes remove only their family", () => {
    for (const mutes of [
      { kick: true, snare: false, hats: false, toms: false, cymbals: false },
      { kick: false, snare: true, hats: false, toms: false, cymbals: false },
      { kick: false, snare: false, hats: true, toms: false, cymbals: false },
      { kick: false, snare: false, hats: false, toms: true, cymbals: false },
      { kick: false, snare: false, hats: false, toms: false, cymbals: true },
    ]) {
      const hits = generateRegion(makeRegion({ mutes }));
      const famOfMute: Record<string, string> = { kick: "kick", snare: "snare", hats: "hat", toms: "tom", cymbals: "cymbal" };
      const muted = Object.entries(mutes).find(([, v]) => v)!;
      for (const h of hits) {
        expect(familyOf(h.articulation)).not.toBe(famOfMute[muted[0]]);
      }
    }
  });

  it("regions keep independent macro state (two regions, same seed, different macros → different streams)", () => {
    const a: DrummerRegion = makeRegion({ id: "a" });
    const b: DrummerRegion = { ...a, id: "b", macros: { ...a.macros, complexity: 90 } };
    expect(JSON.stringify(generateRegion(a))).not.toBe(JSON.stringify(generateRegion(b)));
  });
});

describe("Convert to Editable MIDI (Day-1 requirement)", () => {
  it("hits convert to valid GM drum pitches via the profile", () => {
    const notes = hitsToMidi(generateRegion(makeRegion({})), GENERAL_MIDI);
    expect(notes.length).toBeGreaterThan(0);
    for (const n of notes) {
      expect(n.pitch).toBeGreaterThanOrEqual(36);
      expect(n.pitch).toBeLessThanOrEqual(51);
      expect(n.velocity).toBeGreaterThanOrEqual(1);
      expect(n.velocity).toBeLessThanOrEqual(127);
      expect(n.startTicks).toBeGreaterThanOrEqual(0);
      expect(n.durTicks).toBeGreaterThan(0);
    }
  });

  it("user profile remaps are honored at conversion", () => {
    const p = cloneProfile(GENERAL_MIDI, "user", "My remap");
    p.maps.hat_closed.pitch = 55;
    const notes = hitsToMidi(generateRegion(makeRegion({})), p);
    const hats = notes.filter((n) => n.pitch === 55);
    expect(hats.length).toBeGreaterThan(0);
  });

  it("project timeline offsets accumulate across regions", () => {
    const a = makeRegion({ id: "a", bars: 8 });
    const b = makeRegion({ id: "b", bars: 4 });
    const parts = projectNotes([a, b], GENERAL_MIDI);
    expect(parts[0].startTicks).toBe(0);
    expect(parts[1].startTicks).toBe(8 * 1920);
    expect(Math.max(...parts[1].notes.map((n) => n.startTicks)) < 12 * 1920).toBe(true);
  });
});
