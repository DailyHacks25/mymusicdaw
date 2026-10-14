/**
 * Lookahead audio scheduler. Pre-computes the whole project as a sorted
 * tick list, then schedules Web Audio events 180 ms ahead at 25 ms cadence
 * and loops the project. Events can be hot-swapped mid-play (state edits
 * pick up on the next interval).
 */

import type { ArticulationId } from "../../engine/articulations";
import { generateRegion, TICKS_PER_STEP } from "../../engine/engine";
import type { DrummerRegion } from "../../engine/types";
import type { MappingProfile } from "../../engine/profiles";
import { PPQ } from "../../engine/midi";
import { DrumSynth } from "./synth";

export interface SeqEvent {
  tick: number;
  vel: number;
  art: ArticulationId | null; // generated content
  pitch: number | null; // baked/editable content
}

export function buildProjectEvents(regions: DrummerRegion[], profile: MappingProfile): { events: SeqEvent[]; totalTicks: number } {
  const events: SeqEvent[] = [];
  let tick = 0;
  for (const r of regions) {
    if (r.editable) {
      for (const n of r.editable.notes) {
        if (n.startTicks < 0) continue;
        events.push({ tick: tick + n.startTicks, vel: n.velocity, art: null, pitch: n.pitch });
      }
    } else {
      const hits = generateRegion(r);
      for (const h of hits) {
        const m = profile.maps[h.articulation];
        events.push({
          tick: tick + h.step * TICKS_PER_STEP + h.offsetTicks,
          vel: Math.max(1, Math.min(127, h.velocity + m.velOffset)),
          art: h.articulation,
          pitch: null,
        });
      }
    }
    tick += r.bars * PPQ * 4;
  }
  events.sort((a, b) => a.tick - b.tick);
  return { events, totalTicks: tick };
}

class Player {
  private synth: DrumSynth | null = null;
  private timer: number | null = null;
  private events: SeqEvent[] = [];
  private totalTicks = 0;
  private bpm = 120;
  private nextIdx = 0;
  private anchorTime = 0; // AudioContext time at which tick 0 plays
  private playing = false;

  private get s() {
    if (!this.synth) this.synth = new DrumSynth();
    return this.synth;
  }

  private secPerTick(bpm: number) {
    return 60 / bpm / PPQ;
  }

  isPlaying() {
    return this.playing;
  }

  getCurrentTicks(): number {
    if (!this.playing || !this.synth) return 0;
    const t = (this.synth.context.currentTime - this.anchorTime) / this.secPerTick(this.bpm);
    if (t < 0) return 0;
    return this.totalTicks > 0 ? t % this.totalTicks : 0;
  }

  start(events: SeqEvent[], totalTicks: number, bpm: number) {
    this.refresh(events, totalTicks, bpm);
    if (this.playing) return;
    const s = this.s;
    s.resume();
    this.playing = true;
    this.anchorTime = s.context.currentTime + 0.06;
    this.nextIdx = 0;
    this.timer = window.setInterval(() => this.schedule(), 25);
  }

  stop() {
    if (this.timer !== null) window.clearInterval(this.timer);
    this.timer = null;
    this.playing = false;
  }

  /** Hot-swap the sequence without stopping (state edits during playback). */
  refresh(events: SeqEvent[], totalTicks: number, bpm: number) {
    if (this.playing && this.synth) {
      const cur = this.getCurrentTicks();
      const spt = this.secPerTick(bpm);
      this.anchorTime = this.synth.context.currentTime - cur * spt;
      this.nextIdx = this.findIndex(events, cur);
    }
    this.events = events;
    this.totalTicks = totalTicks;
    this.bpm = bpm;
    if (!this.playing) {
      this.anchorTime = 0;
      this.nextIdx = 0;
    }
  }

  private findIndex(events: SeqEvent[], tick: number): number {
    let lo = 0;
    let hi = events.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (events[mid].tick < tick) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }

  private schedule() {
    if (!this.synth || !this.playing) return;
    const ctx = this.synth.context;
    const spt = this.secPerTick(this.bpm);
    const ahead = ctx.currentTime + 0.18;
    while (this.nextIdx < this.events.length) {
      const e = this.events[this.nextIdx];
      const t = this.anchorTime + e.tick * spt;
      if (t >= ahead) break;
      if (e.art !== null) this.synth.play(e.art, Math.max(t, ctx.currentTime), e.vel);
      else this.synth.playPitch(e.pitch ?? 38, Math.max(t, ctx.currentTime), e.vel);
      this.nextIdx++;
    }
    // loop wrap (also advances the clock when the region is fully muted)
    const loopDur = this.totalTicks * spt;
    if (loopDur > 0 && ctx.currentTime >= this.anchorTime + loopDur) {
      const loops = Math.max(1, Math.ceil((ctx.currentTime - this.anchorTime) / loopDur));
      this.anchorTime += loops * loopDur;
      this.nextIdx = 0;
    }
  }
}

export const player = new Player();
