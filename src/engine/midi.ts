/**
 * Standard MIDI File (SMF) writer + minimal parser.
 *
 * Writer: format-1 file, PPQ 480, one tempo/time-signature meta track plus a
 * drum track (channel 9, GM program 0 = Acoustic Kit). Used for "Convert to
 * Editable MIDI Region" export and the project-wide mixdown of drum MIDI.
 *
 * Parser: just complete enough to round-trip our own files in unit tests
 * (tempo, time signature, program change, note on/off).
 */

export const PPQ = 480;
export const TICKS_PER_BAR = PPQ * 4; // 1920

export interface MidiNote {
  pitch: number;
  velocity: number;
  /** Absolute ticks in the exported file. */
  startTicks: number;
  durTicks: number;
}

export function encodeVarLen(n: number): number[] {
  if (n < 0) throw new Error("negative varlen");
  let value = n;
  const out: number[] = [];
  out.push(value & 0x7f);
  value >>= 7;
  while (value > 0) {
    out.push(0x80 | (value & 0x7f));
    value >>= 7;
  }
  return out.reverse();
}

export function decodeVarLen(bytes: number[], pos: number): { value: number; next: number } {
  let value = 0;
  let p = pos;
  for (;;) {
    const b = bytes[p++];
    value = (value << 7) | (b & 0x7f);
    if ((b & 0x80) === 0) break;
  }
  return { value, next: p };
}

function u32(v: number): number[] {
  return [(v >>> 24) & 0xff, (v >>> 16) & 0xff, (v >>> 8) & 0xff, v & 0xff];
}
function u16(v: number): number[] {
  return [(v >>> 8) & 0xff, v & 0xff];
}

interface TrkEvent {
  tick: number;
  data: number[];
}

export function writeStandardMidiFile(bpm: number, notes: MidiNote[]): Uint8Array {
  const tempo = Math.max(1, Math.round(60_000_000 / bpm));

  const meta: TrkEvent[] = [
    { tick: 0, data: [0xff, 0x51, 0x03, (tempo >> 16) & 0xff, (tempo >> 8) & 0xff, tempo & 0xff] },
    { tick: 0, data: [0xff, 0x58, 0x04, 0x04, 0x02, 0x18, 0x08] },
    { tick: 0, data: [0xc9, 0x00] }, // program change 0 (acoustic kit) on ch 10
    { tick: 0, data: [0xff, 0x2f, 0x00] }, // end of track
  ];

  const ev: TrkEvent[] = [];
  for (const n of notes) {
    const s = Math.max(0, Math.round(n.startTicks));
    const d = Math.max(1, Math.round(n.durTicks));
    ev.push({ tick: s, data: [0x99, n.pitch, Math.max(1, Math.min(127, n.velocity))] });
    ev.push({ tick: s + d, data: [0x89, n.pitch, 0x00] });
  }
  ev.push({ tick: ev.reduce((m, e) => Math.max(m, e.tick), 0), data: [0xff, 0x2f, 0x00] });
  ev.sort((a, b) => a.tick - b.tick || ((a.data[0] === 0x89 ? -1 : 1) - (b.data[0] === 0x89 ? -1 : 1))); // offs before ons at same tick

  const buildTrk = (events: TrkEvent[]): number[] => {
    const out: number[] = [];
    let last = 0;
    for (const e of events) {
      out.push(...encodeVarLen(e.tick - last), ...e.data);
      last = e.tick;
    }
    return ["MTrk".charCodeAt(0), "MTrk".charCodeAt(1), "MTrk".charCodeAt(2), "MTrk".charCodeAt(3), ...u32(out.length), ...out];
  };

  const body = [...buildTrk(meta), ...buildTrk(ev)];
  const M = (c: string) => c.charCodeAt(0);
  const head = [M("M"), M("T"), M("h"), M("d"), ...u32(6), ...u16(1), ...u16(2), ...u16(PPQ)];
  return new Uint8Array([...head, ...body]);
}

export interface ParsedMidi {
  bpm: number;
  ppq: number;
  programChange: number | null;
  notes: MidiNote[];
}

export function parseStandardMidiFile(data: Uint8Array): ParsedMidi {
  const str = (o: number) => String.fromCharCode(data[o], data[o + 1], data[o + 2], data[o + 3]);
  if (str(0) !== "MThd") throw new Error("not an MThd");
  const ppq = data[12] << 8 | data[13];
  let p = 14;
  let tempo = 500_000;
  let programChange: number | null = null;
  const open = new Map<number, number>(); // pitch -> start tick
  const notes: MidiNote[] = [];
  let lastTick = 0;

  while (p < data.length) {
    if (str(p) !== "MTrk") throw new Error(`expected MTrk at ${p}`);
    const len = data[p + 4] << 24 | (data[p + 5] << 16) | (data[p + 6] << 8) | data[p + 7];
    p += 8;
    const end = p + len;
    lastTick = 0;
    let status: number | null = null;
    while (p < end) {
      let d = decodeVarLen(data, p);
      lastTick += d.value;
      p = d.next;
      if (p >= end) break;
      let b = data[p++];
      if (b & 0x80) status = b;
      if (status === null) continue;
      if (status === 0xff) {
        const type = data[p++];
        const mlen = decodeVarLen(data, p);
        p = mlen.next;
        const payload = data.slice(p, p + mlen.value);
        p += mlen.value;
        if (type === 0x51) tempo = (payload[0] << 16) | (payload[1] << 8) | payload[2];
        status = 0xff;
        continue;
      }
      const cmd = status & 0xf0;
      if (cmd === 0x90 || cmd === 0x80) {
        const pitch = data[p++];
        const vel = data[p++];
        if (cmd === 0x90 && vel > 0) open.set(pitch, lastTick);
        else {
          const s = open.get(pitch);
          if (s !== undefined) {
            notes.push({ pitch, velocity: 0, startTicks: s, durTicks: Math.max(1, lastTick - s) });
            notes[notes.length - 1].velocity = 0; // placeholder, filled below
            open.delete(pitch);
          }
        }
      } else if (cmd === 0xc0) {
        programChange = data[p++];
      } else {
        // skip 2-byte events (CC, pitch bend); 1-byte events (note off / key)
        const nParams = cmd === 0xd0 ? 1 : 2;
        p += nParams;
      }
    }
  }
  // second pass: attach note-on velocities keyed by (start tick, pitch)
  const velByKey = new Map<string, number>();
  p = 14;
  while (p < data.length) {
    const len = data[p + 4] << 24 | (data[p + 5] << 16) | (data[p + 6] << 8) | data[p + 7];
    p += 8;
    const end = p + len;
    let t = 0;
    let st: number | null = null;
    while (p < end) {
      const d = decodeVarLen(data, p);
      t += d.value;
      p = d.next;
      if (p >= end) break;
      let bb = data[p++];
      if (bb & 0x80) st = bb;
      if (st === null || st === 0xff) continue;
      if ((st & 0xf0) === 0x90) {
        const pitch = data[p++];
        const vel = data[p++];
        if (vel > 0) velByKey.set(`${t}:${pitch}`, vel);
      } else if ((st & 0xf0) === 0x80) {
        p += 2;
      } else {
        const nParams = (st & 0xf0) === 0xd0 ? 1 : 2;
        p += nParams;
      }
    }
  }
  for (const n of notes) {
    const v = velByKey.get(`${n.startTicks}:${n.pitch}`);
    if (v !== undefined) n.velocity = v;
  }
  notes.sort((a, b) => a.startTicks - b.startTicks || a.pitch - b.pitch);
  return { bpm: 60_000_000 / tempo, ppq, programChange, notes };
}
