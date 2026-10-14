import type { ArticulationId } from "./articulations";

export type HitOrigin = "base" | "add" | "sub" | "fill" | "follow";

/**
 * One semantic articulation event (the engine's output unit — NOT a MIDI
 * note; pitch comes from the selected mapping profile at conversion time).
 */
export interface DrumHit {
  /** 1/24-beat step index from the region start (16th = 6 steps). */
  step: number;
  /** Timing offset from the grid in ticks (swing + humanization + groove drift). */
  offsetTicks: number;
  articulation: ArticulationId;
  /** Final velocity 1..127 after the Intensity curve. */
  velocity: number;
  origin: HitOrigin;
  /** Timing decomposition, exposed for tests and debugging. */
  debug: {
    swingTicks: number;
    grooveDriftTicks: number;
    humanTicks: number;
  };
}
