/**
 * Bundled lightweight fallback player (PRD §5 "Fallback sound"):
 * a procedural Web Audio drum synth so the prototype is audible without any
 * third-party rompler. In the real DAW this slot is filled by the embedded
 * sfizz/FluidSynth core running the CC0/MIT multisampled kit.
 */

import type { ArticulationId } from "../../engine/articulations";

export class DrumSynth {
  private ctx: AudioContext;
  private master: GainNode;
  private noiseBuf: AudioBuffer;

  constructor() {
    const AC: typeof AudioContext =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.9;
    const comp = this.ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.knee.value = 12;
    comp.ratio.value = 4;
    comp.attack.value = 0.002;
    comp.release.value = 0.12;
    this.master.connect(comp);
    comp.connect(this.ctx.destination);

    const len = Math.floor(this.ctx.sampleRate * 1.2);
    this.noiseBuf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = this.noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  }

  get context() {
    return this.ctx;
  }

  resume() {
    if (this.ctx.state === "suspended") void this.ctx.resume();
  }

  private env(when: number, peak: number, decay: number): GainNode {
    const g = this.ctx.createGain();
    const p = Math.max(0.0002, peak);
    g.gain.setValueAtTime(0.0001, when);
    g.gain.linearRampToValueAtTime(p, when + 0.0025);
    g.gain.exponentialRampToValueAtTime(0.0001, when + decay);
    g.connect(this.master);
    return g;
  }

  private noise(when: number, vel: number, type: BiquadFilterType, freq: number, q: number, decay: number, peakMul = 1) {
    if (vel <= 0) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuf;
    src.playbackRate.value = 0.85 + Math.random() * 0.3;
    const f = this.ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    const g = this.env(when, (vel / 127) * peakMul, decay);
    src.connect(f);
    f.connect(g);
    src.start(when, Math.random() * 0.5, decay + 0.15);
  }

  private tone(when: number, vel: number, type: OscillatorType, f0: number, f1: number, slide: number, decay: number, peakMul = 1) {
    if (vel <= 0) return;
    const o = this.ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(Math.max(20, f0), when);
    o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), when + slide);
    const g = this.env(when, (vel / 127) * peakMul, decay);
    o.connect(g);
    o.start(when);
    o.stop(when + decay + 0.15);
  }

  /** Play one semantic articulation. */
  play(art: ArticulationId, when: number, vel: number) {
    switch (art) {
      case "kick_normal":
        this.tone(when, vel, "sine", 130, 42, 0.07, 0.28, 0.95);
        this.noise(when, vel, "highpass", 4200, 0.7, 0.008, 0.25);
        break;
      case "kick_hard":
        this.tone(when, vel, "sine", 152, 40, 0.08, 0.32, 1.05);
        this.noise(when, vel, "highpass", 4200, 0.7, 0.01, 0.3);
        break;
      case "snare":
        this.tone(when, vel, "triangle", 200, 158, 0.03, 0.05, 0.5);
        this.noise(when, vel, "bandpass", 1700, 0.9, 0.13, 0.75);
        break;
      case "snare_hard":
        this.tone(when, vel, "triangle", 206, 148, 0.04, 0.07, 0.6);
        this.noise(when, vel, "bandpass", 1550, 0.9, 0.16, 0.9);
        break;
      case "snare_ghost":
        this.noise(when, vel * 0.5, "bandpass", 1900, 1, 0.06, 0.55);
        break;
      case "snare_rimshot":
        this.noise(when, vel, "highpass", 3200, 1.2, 0.03, 0.6);
        this.tone(when, vel, "sine", 860, 700, 0.012, 0.02, 0.2);
        break;
      case "snare_side":
        this.noise(when, vel, "bandpass", 2400, 1.6, 0.05, 0.5);
        break;
      case "clap":
        this.noise(when, vel, "bandpass", 1100, 1, 0.18, 0.6);
        this.noise(when + 0.011, vel, "bandpass", 1100, 1, 0.12, 0.5);
        this.noise(when + 0.023, vel, "bandpass", 1200, 1, 0.1, 0.45);
        break;
      case "hat_closed":
        this.noise(when, vel, "highpass", 8200, 1, 0.045, 0.5);
        break;
      case "hat_open":
        this.noise(when, vel, "highpass", 6800, 1, 0.35, 0.45);
        break;
      case "hat_edge":
        this.noise(when, vel, "bandpass", 9500, 2, 0.12, 0.42);
        this.noise(when, vel, "highpass", 7000, 1, 0.05, 0.25);
        break;
      case "tom_low":
        this.tone(when, vel, "sine", 95, 55, 0.12, 0.25, 0.85);
        break;
      case "tom_mid":
        this.tone(when, vel, "sine", 135, 80, 0.1, 0.2, 0.85);
        break;
      case "tom_high":
        this.tone(when, vel, "sine", 180, 105, 0.09, 0.16, 0.78);
        break;
      case "cymbal_crash":
        this.noise(when, vel, "highpass", 4800, 0.8, 0.9, 0.5);
        this.noise(when, vel, "bandpass", 8000, 1.5, 0.5, 0.3);
        break;
      case "cymbal_ride":
        this.noise(when, vel, "bandpass", 8200, 3, 0.25, 0.35);
        this.tone(when, vel, "sine", 5600, 5400, 0.02, 0.08, 0.12);
        break;
    }
  }

  /** Play a baked MIDI pitch (editable regions) via the GM kit table. */
  playPitch(pitch: number, when: number, vel: number) {
    switch (pitch) {
      case 36:
      case 37:
        this.play("kick_normal", when, vel);
        break;
      case 38:
        this.play("snare", when, vel);
        break;
      case 39:
        this.play("clap", when, vel);
        break;
      case 41:
      case 45:
        this.play("tom_low", when, vel);
        break;
      case 42:
      case 44:
        this.play("hat_closed", when, vel);
        break;
      case 46:
        this.play("hat_open", when, vel);
        break;
      case 47:
        this.play("tom_mid", when, vel);
        break;
      case 48:
      case 50:
        this.play("tom_high", when, vel);
        break;
      case 49:
        this.play("cymbal_crash", when, vel);
        break;
      case 51:
        this.play("cymbal_ride", when, vel);
        break;
      default:
        this.play("tom_mid", when, vel);
    }
  }
}
