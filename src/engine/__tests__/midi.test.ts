import { describe, expect, it } from "vitest";
import { parseStandardMidiFile, writeStandardMidiFile, PPQ } from "../midi";
import { BUILTIN_PROFILES, validateProfile } from "../profiles";
import { ARTICULATIONS } from "../articulations";
import { generateRegion, hitsToMidi, regionToMidi } from "../engine";
import { makeRegion } from "./library.test";

describe("mapping profiles (PRD §5 routing)", () => {
  it("all 4 bundled profiles map all 16 articulations in-range", () => {
    expect(BUILTIN_PROFILES.map((p) => p.name)).toEqual([
      "General MIDI (fallback)",
      "Toontrack (EZdrummer / SD3)",
      "XLN Audio (Addictive Drums 2)",
      "Steven Slate Drums (SSD5)",
    ]);
    for (const p of BUILTIN_PROFILES) {
      expect(validateProfile(p), p.name).toEqual([]);
      for (const a of ARTICULATIONS) expect(p.maps[a]).toBeDefined();
    }
  });
});

describe("SMF writer/round-trip", () => {
  it("writes a format-1 file that parses back identically", () => {
    const region = makeRegion({ bars: 4, persona: "beatmaker", archetypeId: "bm-05", followSource: "demoBass" });
    const notes = hitsToMidi(generateRegion(region), BUILTIN_PROFILES[1]); // Toontrack
    const bytes = writeStandardMidiFile(92.5, notes);

    expect(String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3])).toBe("MThd");
    const parsed = parseStandardMidiFile(bytes);
    expect(parsed.ppq).toBe(PPQ);
    expect(parsed.bpm).toBeCloseTo(92.5, 1);
    expect(parsed.programChange).toBe(0);
    expect(parsed.notes.length).toBe(notes.length);
    const a = [...notes].sort((x, y) => x.startTicks - y.startTicks || x.pitch - y.pitch);
    const b = parsed.notes;
    for (let i = 0; i < a.length; i++) {
      expect(b[i].pitch).toBe(a[i].pitch);
      expect(b[i].velocity).toBe(a[i].velocity);
      expect(b[i].startTicks).toBe(a[i].startTicks);
      expect(b[i].durTicks).toBe(a[i].durTicks);
    }
  });

  it("handles empty note lists", () => {
    const parsed = parseStandardMidiFile(writeStandardMidiFile(120, []));
    expect(parsed.notes).toEqual([]);
    expect(parsed.bpm).toBeCloseTo(120, 1);
  });
});

describe("editable region pass-through (baked MIDI survives profile changes)", () => {
  it("an editable region ignores the current profile and other regions' state", () => {
    const region = makeRegion({ archetypeId: "td-01" });
    const original = hitsToMidi(generateRegion(region), BUILTIN_PROFILES[0]);
    region.editable = {
      notes: original.map((n) => ({ ...n })),
      convertedFrom: { archetypeId: "td-01", macros: { ...region.macros }, seed: region.seed },
    };
    const out = regionToMidi(region, BUILTIN_PROFILES[3]); // different profile: must not re-map
    expect(out).toEqual(original);
  });
});
