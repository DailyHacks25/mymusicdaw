/**
 * Follow Mechanism (PRD §5, v1 scope: MIDI-to-MIDI only).
 *
 * The user selects a source MIDI track (e.g. bass or rhythm guitar). The
 * Drummer engine reads that track's Note-On positions and velocities and
 * biases its kick-drum placement to coincide with them. No audio transient
 * detection, no chord-track dependency — keeps the feature deterministic.
 *
 * For the web prototype the source tracks are two lean authored 4-bar MIDI
 * phrases that stand in for the producer's own tracks.
 */

import type { SourceTrackId } from "./types";

export interface SourceNote {
  /** 16th-note index across a 4-bar phrase (0..63). */
  step: number;
  /** 1..127. */
  velocity: number;
}

export interface SourceTrack {
  id: SourceTrackId;
  name: string;
  /** 4-bar phrase, repeated across the region. */
  notes: SourceNote[];
}

export const SOURCE_TRACKS: Record<SourceTrackId, SourceTrack> = {
  demoBass: {
    id: "demoBass",
    name: "Demo bassline (syncopated 8ths)",
    notes: [
      { step: 0, velocity: 110 },
      { step: 7, velocity: 92 },
      { step: 12, velocity: 100 },
      { step: 16, velocity: 110 },
      { step: 23, velocity: 92 },
      { step: 30, velocity: 100 },
      { step: 32, velocity: 108 },
      { step: 39, velocity: 95 },
      { step: 44, velocity: 100 },
      { step: 48, velocity: 112 },
      { step: 55, velocity: 90 },
      { step: 60, velocity: 104 },
    ],
  },
  demoGuitar: {
    id: "demoGuitar",
    name: "Demo rhythm guitar (chopped 8ths)",
    notes: [
      { step: 0, velocity: 100 },
      { step: 4, velocity: 78 },
      { step: 8, velocity: 96 },
      { step: 12, velocity: 88 },
      { step: 16, velocity: 100 },
      { step: 20, velocity: 76 },
      { step: 24, velocity: 98 },
      { step: 28, velocity: 90 },
      { step: 32, velocity: 100 },
      { step: 36, velocity: 74 },
      { step: 40, velocity: 96 },
      { step: 44, velocity: 88 },
      { step: 48, velocity: 102 },
      { step: 52, velocity: 78 },
      { step: 56, velocity: 98 },
      { step: 60, velocity: 90 },
    ],
  },
};
