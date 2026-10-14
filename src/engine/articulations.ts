/**
 * The semantic articulation model (PRD §5 "Routing Architecture").
 *
 * The engine never emits hardcoded MIDI note numbers. It emits these
 * semantic articulations; a translation layer (profiles.ts) maps them to
 * whichever rompler profile is selected, or to the bundled fallback player.
 */

export const ARTICULATIONS = [
  "kick_normal",
  "kick_hard",
  "snare",
  "snare_hard",
  "snare_ghost",
  "snare_rimshot",
  "snare_side",
  "clap",
  "hat_closed",
  "hat_open",
  "hat_edge",
  "tom_low",
  "tom_mid",
  "tom_high",
  "cymbal_crash",
  "cymbal_ride",
] as const;

export type ArticulationId = (typeof ARTICULATIONS)[number];

export type DrumFamily = "kick" | "snare" | "hat" | "tom" | "cymbal";

export interface ArticulationMeta {
  /** One-character code used in the seed-pattern authoring format. */
  letter: string;
  family: DrumFamily;
  /** Base velocity before the Intensity curve (PRD: decoupled from density). */
  baseVelocity: number;
  /** Accent notes get extra velocity shaping at high Intensity. */
  accent: boolean;
  /** Default note length in ticks (PPQ 480) when converting to MIDI. */
  noteLenTicks: number;
  label: string;
}

export const ARTICULATION_META: Record<ArticulationId, ArticulationMeta> = {
  kick_normal: { letter: "K", family: "kick", baseVelocity: 100, accent: false, noteLenTicks: 48, label: "Kick" },
  kick_hard: { letter: "k", family: "kick", baseVelocity: 112, accent: true, noteLenTicks: 48, label: "Kick (hard)" },
  snare: { letter: "S", family: "snare", baseVelocity: 100, accent: false, noteLenTicks: 40, label: "Snare" },
  snare_hard: { letter: "s", family: "snare", baseVelocity: 110, accent: true, noteLenTicks: 40, label: "Snare (hard)" },
  snare_ghost: { letter: "G", family: "snare", baseVelocity: 42, accent: false, noteLenTicks: 20, label: "Snare ghost" },
  snare_rimshot: { letter: "R", family: "snare", baseVelocity: 58, accent: false, noteLenTicks: 16, label: "Snare rimshot" },
  snare_side: { letter: "W", family: "snare", baseVelocity: 62, accent: false, noteLenTicks: 24, label: "Side stick" },
  clap: { letter: "P", family: "snare", baseVelocity: 105, accent: true, noteLenTicks: 32, label: "Clap" },
  hat_closed: { letter: "H", family: "hat", baseVelocity: 82, accent: false, noteLenTicks: 24, label: "Hi-hat closed" },
  hat_open: { letter: "O", family: "hat", baseVelocity: 88, accent: false, noteLenTicks: 96, label: "Hi-hat open" },
  hat_edge: { letter: "E", family: "hat", baseVelocity: 72, accent: false, noteLenTicks: 40, label: "Hi-hat edge (half-open)" },
  tom_low: { letter: "B", family: "tom", baseVelocity: 95, accent: false, noteLenTicks: 40, label: "Tom low" },
  tom_mid: { letter: "M", family: "tom", baseVelocity: 95, accent: false, noteLenTicks: 40, label: "Tom mid" },
  tom_high: { letter: "T", family: "tom", baseVelocity: 92, accent: false, noteLenTicks: 32, label: "Tom high" },
  cymbal_crash: { letter: "C", family: "cymbal", baseVelocity: 100, accent: false, noteLenTicks: 280, label: "Crash" },
  cymbal_ride: { letter: "D", family: "cymbal", baseVelocity: 78, accent: false, noteLenTicks: 80, label: "Ride" },
};

const LETTER_TO_ART: Record<string, ArticulationId> = {};
for (const a of ARTICULATIONS) LETTER_TO_ART[ARTICULATION_META[a].letter] = a;

export function letterToArticulation(ch: string): ArticulationId | undefined {
  return LETTER_TO_ART[ch];
}

export function familyOf(art: ArticulationId): DrumFamily {
  return ARTICULATION_META[art].family;
}
