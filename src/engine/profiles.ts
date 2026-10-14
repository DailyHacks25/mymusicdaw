/**
 * Output mapping profiles (PRD §5 "Routing Architecture: Semantic Model + BYO-VST").
 *
 * v1 bundled profiles:
 *  - Standard General MIDI (default / fallback)
 *  - Toontrack (EZdrummer / Superior Drummer 3)
 *  - XLN Audio (Addictive Drums 2)
 *  - Steven Slate Drums (SSD5)
 *
 * NOTE (matches PRD §6 open decision "acquire copies for mapping verification"):
 * the Toontrack / XLN / SSD tables below are documented best-effort
 * approximations of the well-known default maps. Verifying note-map accuracy
 * against each target plugin requires actual licensed copies — a
 * procurement line item — and these tables must be confirmed before shipping.
 *
 * A visual mapping editor (web UI) can remap any articulation to a custom
 * MIDI note and save it as a user profile.
 */

import { ARTICULATIONS } from "./articulations";
import type { ArticulationId } from "./articulations";

export interface ArticulationMap {
  /** MIDI note number (0-127). */
  pitch: number;
  /** Velocity offset applied on top of the generated velocity. */
  velOffset: number;
}

export interface MappingProfile {
  id: string;
  name: string;
  builtin?: boolean;
  maps: Record<ArticulationId, ArticulationMap>;
}

const M = (pitch: number, velOffset = 0): ArticulationMap => ({ pitch, velOffset });

export const GENERAL_MIDI: MappingProfile = {
  id: "gm",
  name: "General MIDI (fallback)",
  builtin: true,
  maps: {
    kick_normal: M(36),
    kick_hard: M(36, 8),
    snare: M(38),
    snare_hard: M(38, 8),
    snare_ghost: M(38, -28),
    snare_rimshot: M(39, -10),
    snare_side: M(39, -20),
    clap: M(39),
    hat_closed: M(42),
    hat_open: M(46),
    hat_edge: M(44),
    tom_low: M(45),
    tom_mid: M(47),
    tom_high: M(50),
    cymbal_crash: M(49),
    cymbal_ride: M(51),
  },
};

export const TOONTRACK: MappingProfile = {
  id: "toontrack",
  name: "Toontrack (EZdrummer / SD3)",
  builtin: true,
  maps: {
    kick_normal: M(38),
    kick_hard: M(38, 8),
    snare: M(40),
    snare_hard: M(40, 8),
    snare_ghost: M(40, -30),
    snare_rimshot: M(41, -5),
    snare_side: M(41, -18),
    clap: M(41, 6),
    hat_closed: M(44),
    hat_open: M(46),
    hat_edge: M(45, -4),
    tom_low: M(37),
    tom_mid: M(43),
    tom_high: M(47),
    cymbal_crash: M(49),
    cymbal_ride: M(51),
  },
};

export const XLN_AD2: MappingProfile = {
  id: "xln-ad2",
  name: "XLN Audio (Addictive Drums 2)",
  builtin: true,
  maps: {
    kick_normal: M(38),
    kick_hard: M(38, 8),
    snare: M(40),
    snare_hard: M(40, 8),
    snare_ghost: M(40, -30),
    snare_rimshot: M(42, -6),
    snare_side: M(42, -18),
    clap: M(42, 6),
    hat_closed: M(44),
    hat_open: M(46),
    hat_edge: M(45, -4),
    tom_low: M(37),
    tom_mid: M(43),
    tom_high: M(47),
    cymbal_crash: M(49),
    cymbal_ride: M(51),
  },
};

export const SSD5: MappingProfile = {
  id: "ssd5",
  name: "Steven Slate Drums (SSD5)",
  builtin: true,
  maps: {
    kick_normal: M(38),
    kick_hard: M(38, 8),
    snare: M(40),
    snare_hard: M(40, 8),
    snare_ghost: M(40, -32),
    snare_rimshot: M(41, -6),
    snare_side: M(41, -20),
    clap: M(41, 8),
    hat_closed: M(44),
    hat_open: M(46),
    hat_edge: M(45, -4),
    tom_low: M(37),
    tom_mid: M(43),
    tom_high: M(47),
    cymbal_crash: M(49),
    cymbal_ride: M(51),
  },
};

export const BUILTIN_PROFILES: MappingProfile[] = [GENERAL_MIDI, TOONTRACK, XLN_AD2, SSD5];

/** Every articulation must be mapped in every profile (also asserted in tests). */
export function validateProfile(p: MappingProfile): string[] {
  const errors: string[] = [];
  for (const a of ARTICULATIONS) {
    const m = p.maps[a];
    if (!m) {
      errors.push(`${p.name}: missing mapping for ${a}`);
      continue;
    }
    if (!(m.pitch >= 0 && m.pitch <= 127)) errors.push(`${p.name}: ${a} pitch ${m.pitch} out of range`);
    if (m.velOffset < -60 || m.velOffset > 60) errors.push(`${p.name}: ${a} velOffset out of range`);
  }
  return errors;
}

export function cloneProfile(p: MappingProfile, id: string, name: string): MappingProfile {
  const maps = {} as Record<ArticulationId, ArticulationMap>;
  for (const a of ARTICULATIONS) maps[a] = { ...p.maps[a] };
  return { id, name, maps };
}
