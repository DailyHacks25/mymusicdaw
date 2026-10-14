/**
 * Seed-pattern library registry (PRD §3/§5: "Lean MIDI seed library",
 * "4 genre personas, ~140 authored seed patterns total").
 */

import type { MacroState, PersonaId } from "./types";
import type { ArchetypeDef } from "./patterns";
import { TIGHT_DRIVER } from "./patterns/tightDriver";
import { BEATMAKER } from "./patterns/beatmaker";
import { POCKET_PLAYER } from "./patterns/pocketPlayer";
import { GROOVEBOX } from "./patterns/groovebox";

export interface PersonaMeta {
  id: PersonaId;
  name: string;
  genre: string;
  style: string;
  targetVst: string;
  /** Recommended macro defaults (the UI "load persona defaults" action). */
  defaults: MacroState;
}

export const PERSONAS: Record<PersonaId, PersonaMeta> = {
  tightDriver: {
    id: "tightDriver",
    name: "The Tight Driver",
    genre: "Rock / Modern Pop",
    style: "Locked-to-grid acoustic feel, solid backbeat, energetic tom/snare turnarounds",
    targetVst: "Superior Drummer 3 / EZdrummer",
    defaults: { complexity: 55, intensity: 62, swing: 0, tightness: 72, fillFrequency: "standard", fillOverride: "auto" },
  },
  beatmaker: {
    id: "beatmaker",
    name: "The Beatmaker",
    genre: "Hip-Hop / Boom-Bap / Trap",
    style: "Heavy kick displacement, triplets, trap hat rolls at high complexity, loose boom-bap swing",
    targetVst: "Battery / Kontakt kits / internal SoundFont",
    defaults: { complexity: 48, intensity: 64, swing: 42, tightness: 55, fillFrequency: "rare", fillOverride: "auto" },
  },
  pocketPlayer: {
    id: "pocketPlayer",
    name: "The Pocket Player",
    genre: "Acoustic / Singer-Songwriter / Indie",
    style: "High dynamic range, extensive ghost notes, side-stick accents, laidback behind-the-beat drift",
    targetVst: "Addictive Drums 2",
    defaults: { complexity: 50, intensity: 48, swing: 12, tightness: 32, fillFrequency: "standard", fillOverride: "auto" },
  },
  groovebox: {
    id: "groovebox",
    name: "The Groovebox",
    genre: "Electronic / House / Four-on-the-Floor",
    style: "Relentless kick anchors, off-beat open hats, syncopated substitutions, tight humanization baseline",
    targetVst: "SSD5 / stock synth drums",
    defaults: { complexity: 62, intensity: 72, swing: 0, tightness: 88, fillFrequency: "rare", fillOverride: "auto" },
  },
};

export const PERSONA_IDS: PersonaId[] = ["tightDriver", "beatmaker", "pocketPlayer", "groovebox"];

export const SEED_LIBRARY: Record<PersonaId, ArchetypeDef[]> = {
  tightDriver: TIGHT_DRIVER,
  beatmaker: BEATMAKER,
  pocketPlayer: POCKET_PLAYER,
  groovebox: GROOVEBOX,
};

export function getArchetype(persona: PersonaId, id: string): ArchetypeDef | undefined {
  return SEED_LIBRARY[persona].find((a) => a.id === id);
}

export function totalArchetypeCount(): number {
  return PERSONA_IDS.reduce((n, p) => n + SEED_LIBRARY[p].length, 0);
}
