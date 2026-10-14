/**
 * Seed-pattern authoring format (PRD §5 "authored MIDI seed-pattern library").
 *
 * An ArchetypeDef is a 4-bar phrase made of up to 4 unique bars (A-D).
 * Each bar carries up to 5 families (kick / snare / hat / tom / cym), and
 * each family can hold one or more rows. A row is a string of articulation
 * letters (see articulations.ts) or '.' for empty.
 *
 * Row resolution is inferred from length:
 *   12 chars = eighth-note triplets (3 cells per beat)
 *   16 chars = sixteenth notes     (4 cells per beat)
 *   24 chars = sixteenth triplets  (6 cells per beat)
 *   32 chars = thirty-second notes (8 cells per beat)
 *
 * The internal engine grid is 24 steps per beat (96 per bar), so every row
 * resolution lands on exact integer steps — triplets and 32nd-note trap
 * rolls are exact, never approximated.
 *
 * Layers (the "hybrid seed grid + procedural variation" model):
 *   base — the archetype's core groove (always on)
 *   add  — unmasked additively as Complexity rises 0→50 (ghost notes, 16ths)
 *   sub  — cross-faded in as Complexity rises 50→100 (syncopation,
 *          alternate hat articulations); a sub note on the hat family at a
 *          step that already carries a base/add hat note replaces it
 */

export type BarName = "A" | "B" | "C" | "D";

export const BAR_NAMES: BarName[] = ["A", "B", "C", "D"];

/** Map of bar name -> rows. */
export type RowSpec = Partial<Record<BarName, string[]>>;

export interface LayerDef {
  kick?: RowSpec;
  snare?: RowSpec;
  hat?: RowSpec;
  tom?: RowSpec;
  cym?: RowSpec;
}

export const LAYER_FAMILIES = ["kick", "snare", "hat", "tom", "cym"] as const;
export type LayerFamily = (typeof LAYER_FAMILIES)[number];

export interface ArchetypeDef {
  id: string;
  name: string;
  /** Which bars make up the 4-bar phrase. */
  sequence: [BarName, BarName, BarName, BarName];
  base: LayerDef;
  add: LayerDef;
  sub: LayerDef;
}

/**
 * Compact helper: each argument is one bar (A, then B, C, D...).
 * A string is a single row; a string[] is multiple rows on that bar
 * (e.g. snare + clap layered on the same bar).
 */
export function bars(...args: (string | string[])[]): RowSpec {
  const out: RowSpec = {};
  args.forEach((v, i) => {
    if (v === "") return;
    out[BAR_NAMES[i]] = Array.isArray(v) ? v : [v];
  });
  return out;
}

export type LayerArg = {
  kick?: (string | string[])[];
  snare?: (string | string[])[];
  hat?: (string | string[])[];
  tom?: (string | string[])[];
  cym?: (string | string[])[];
};

function toLayer(a: LayerArg): LayerDef {
  const out: LayerDef = {};
  if (a.kick) out.kick = bars(...a.kick);
  if (a.snare) out.snare = bars(...a.snare);
  if (a.hat) out.hat = bars(...a.hat);
  if (a.tom) out.tom = bars(...a.tom);
  if (a.cym) out.cym = bars(...a.cym);
  return out;
}

/** Archetype constructor. seq is a 4-char string like "AABA". */
export function archetype(
  id: string,
  name: string,
  seq: string,
  base: LayerArg,
  add: LayerArg,
  sub: LayerArg
): ArchetypeDef {
  if (seq.length !== 4) throw new Error(`${id}: sequence must be 4 bars, got "${seq}"`);
  const sequence = seq.split("") as ArchetypeDef["sequence"];
  for (const c of sequence) if (!BAR_NAMES.includes(c as BarName)) throw new Error(`${id}: bad bar "${c}"`);
  return { id, name, sequence, base: toLayer(base), add: toLayer(add), sub: toLayer(sub) };
}
