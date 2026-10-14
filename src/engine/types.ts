/**
 * Core domain types for the mymusicdaw Intelligent Drummer (v1).
 *
 * The engine is pure TypeScript: no DOM, no audio, no I/O. Everything it
 * outputs is data (DrumHit[] / MidiNote[]) so it can be unit-tested in Node
 * and later ported 1:1 to C++ for the JUCE app.
 *
 * PRD §5 references:
 *  - "Macro Parameters" table            -> MacroState
 *  - "Determinism & Variation"           -> region.seed + pure functions of (seed, macros)
 *  - "Section-Awareness"                 -> DrummerRegion (independent macro state, fill dial, mutes)
 *  - "Routing Architecture"              -> ArticulationId + profiles.ts
 *  - "Convert to Editable MIDI Region"   -> EditableRegion
 */

export type PersonaId = "tightDriver" | "beatmaker" | "pocketPlayer" | "groovebox";

export type SectionKind =
  | "Intro"
  | "Verse"
  | "Pre-Chorus"
  | "Chorus"
  | "Bridge"
  | "Outro";

/**
 * Fill Frequency — 5 discrete states (PRD §5 "Fill Frequency").
 *  - off:          no fills (manual override can still force one)
 *  - rare:         every 16 bars
 *  - standard:     every 8 bars
 *  - frequent:     every 4 bars
 *  - turnarounds:  region ends only
 */
export type FillFrequency = "off" | "rare" | "standard" | "frequent" | "turnarounds";

/**
 * Manual override of the fill engine, set from the region's right-click menu
 * (PRD §5 "Fill Heuristics": "Force Fill at Bar End" / "Mute Fill at Bar End").
 */
export type FillOverride = "auto" | "force" | "mute";

export interface MacroState {
  /** 0-100. 0-50: additive unmasking from the Base Layer; 50-100: cross-fade to the Substitution Layer. */
  complexity: number;
  /** 0-100. Velocity curve + accent shaping only; decoupled from note density. */
  intensity: number;
  /** 0-100 (%). Standard triplet-swing ratio. */
  swing: number;
  /** 0-100 (tightness; 100 = tight, no humanization). Gaussian microtiming + correlated groove drift. */
  tightness: number;
  fillFrequency: FillFrequency;
  fillOverride: FillOverride;
}

export type SourceTrackId = "demoBass" | "demoGuitar";

export interface InstrumentMutes {
  kick: boolean;
  snare: boolean;
  hats: boolean;
  toms: boolean;
  cymbals: boolean;
}

export interface MidiNote {
  pitch: number;
  velocity: number;
  /** Ticks from the start of the owning region (PPQ 480). */
  startTicks: number;
  durTicks: number;
}

/**
 * Day-1 requirement (PRD §5): once a producer likes a take they bounce it to
 * standard MIDI notes on the timeline for manual piano-roll editing. The
 * snapshot records what it was converted from so it can be reverted.
 */
export interface EditableRegion {
  notes: MidiNote[];
  convertedFrom: {
    archetypeId: string;
    macros: MacroState;
    seed: number;
  };
}

export interface DrummerRegion {
  id: string;
  name: string;
  section: SectionKind;
  /** Number of 4/4 bars in this region. */
  bars: number;
  persona: PersonaId;
  /** null = pick deterministically from the region seed. */
  archetypeId: string | null;
  /** Consistent pseudorandom seed for this region (PRD §5 "Determinism"). */
  seed: number;
  macros: MacroState;
  /** Follow Mechanism (v1: MIDI-to-MIDI). null = disabled. */
  followSource: SourceTrackId | null;
  mutes: InstrumentMutes;
  /** Non-null once "Convert to Editable MIDI Region" has been applied. */
  editable: EditableRegion | null;
}

export const EMPTY_MUTES: InstrumentMutes = {
  kick: false,
  snare: false,
  hats: false,
  toms: false,
  cymbals: false,
};

export function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}
