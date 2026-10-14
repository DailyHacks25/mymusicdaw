import { describe, expect, it } from "vitest";
import { SEED_LIBRARY, PERSONA_IDS, totalArchetypeCount } from "../seedLibrary";
import { FILLS, allowedFillBeats } from "../fills";
import { letterToArticulation, familyOf } from "../articulations";
import { BAR_NAMES } from "../patterns";
import type { LayerDef } from "../patterns";
import type { DrummerRegion } from "../types";
import { EMPTY_MUTES } from "../types";

const VALID_ROW_LENGTHS = new Set([12, 16, 24, 32]);

const FAMILY_LETTERS: Record<string, Set<string>> = {
  kick: new Set(["K", "k"]),
  snare: new Set(["S", "s", "G", "R", "W", "P"]),
  hat: new Set(["H", "O", "E"]),
  tom: new Set(["B", "M", "T"]),
  cym: new Set(["C", "D"]),
};

function checkRow(archId: string, layer: "base" | "add" | "sub", fam: string, row: string, errors: string[]): void {
  if (!VALID_ROW_LENGTHS.has(row.length)) {
    errors.push(`${archId} ${layer}/${fam} L${row.length}: "${row}"`);
    return;
  }
  const allowed = FAMILY_LETTERS[fam];
  for (const ch of row) {
    if (ch === ".") continue;
    const art = letterToArticulation(ch);
    if (!art) {
      errors.push(`${archId} ${layer}/${fam} bad-letter: "${row}"`);
    } else if (!allowed.has(ch)) {
      errors.push(`${archId} ${layer}/${fam} wrong-family "${ch}" (${familyOf(art)}): "${row}"`);
    }
  }
}

describe("seed library (PRD §5: 4 personas, ~140 authored patterns)", () => {
  it("ships exactly 35 archetypes per persona, 140 total", () => {
    for (const p of PERSONA_IDS) {
      expect(SEED_LIBRARY[p].length, `persona ${p}`).toBe(35);
    }
    expect(totalArchetypeCount()).toBe(140);
  });

  it("has unique archetype ids", () => {
    const ids = new Set<string>();
    for (const p of PERSONA_IDS) {
      for (const a of SEED_LIBRARY[p]) {
        expect(ids.has(a.id), `duplicate id ${a.id}`).toBe(false);
        ids.add(a.id);
      }
    }
  });

  it("every row is a valid, family-correct grid", () => {
    const allErrors: string[] = [];
    for (const p of PERSONA_IDS) {
      for (const a of SEED_LIBRARY[p]) {
        for (const layerName of ["base", "add", "sub"] as const) {
          const layer: LayerDef = a[layerName];
          for (const fam of ["kick", "snare", "hat", "tom", "cym"] as const) {
            const spec = layer[fam];
            if (!spec) continue;
            for (const [bar, rows] of Object.entries(spec)) {
              if (!BAR_NAMES.includes(bar as never)) {
                allErrors.push(`${a.id} ${layerName}/${fam} bad bar ${bar}`);
                continue;
              }
              for (const row of rows!) checkRow(a.id, layerName, fam, row, allErrors);
            }
          }
        }
      }
    }
    expect(allErrors).toEqual([]);
  });

  it("every archetype has a 4-bar sequence over defined bars and non-empty base + add + sub layers", () => {
    for (const p of PERSONA_IDS) {
      for (const a of SEED_LIBRARY[p]) {
        expect(a.sequence.length).toBe(4);
        for (const c of a.sequence) expect(BAR_NAMES).toContain(c);
        const nonEmpty = (l: LayerDef) =>
          (["kick", "snare", "hat", "tom", "cym"] as const).some((f) => l[f] && Object.keys(l[f]!).length > 0);
        expect(nonEmpty(a.base), `${a.id} has empty base`).toBe(true);
        expect(nonEmpty(a.add), `${a.id} has empty add layer`).toBe(true);
        expect(nonEmpty(a.sub), `${a.id} has empty sub layer`).toBe(true);
      }
    }
  });

  it("fill templates are well-formed (12 per persona, lengths = beats*4)", () => {
    for (const p of PERSONA_IDS) {
      const fills = FILLS[p];
      expect(fills.length, `persona ${p}`).toBe(12);
      for (const f of fills) {
        expect(f.snare.length, `${f.id} snare`).toBe(f.beats * 4);
        expect(f.tom.length, `${f.id} tom`).toBe(f.beats * 4);
        // empty hat row = no hats during the fill
        expect([0, f.beats * 4]).toContain(f.hat.length);
        for (const row of [f.snare, f.tom, f.hat]) {
          for (const ch of row) {
            expect([".", ...Object.values(FAMILY_LETTERS).flatMap((s) => [...s])]).toContain(ch);
          }
        }
      }
      // all four lengths represented
      const lengths = new Set(fills.map((f) => f.beats));
      expect(lengths).toEqual(new Set([1, 2, 3, 4]));
    }
    // fill length scales with complexity (PRD §5)
    expect(allowedFillBeats(0)).toEqual([1]);
    expect(allowedFillBeats(100)).toEqual([4]);
  });
});

/** Shared fixture: a deterministic test region. */
export function makeRegion(overrides: Partial<DrummerRegion> = {}): DrummerRegion {
  return {
    id: "test-region",
    name: "Test",
    section: "Verse",
    bars: 8,
    persona: "tightDriver",
    archetypeId: "td-01",
    seed: 424242,
    macros: { complexity: 50, intensity: 50, swing: 0, tightness: 100, fillFrequency: "off", fillOverride: "auto" },
    followSource: null,
    mutes: { ...EMPTY_MUTES },
    editable: null,
    ...overrides,
  };
}
