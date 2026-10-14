import { useEffect, useMemo, useRef, useState } from "react";
import { generateRegion, hitsToMidi, resolveArchetype } from "../../engine/engine";
import type { MidiNote } from "../../engine/types";
import { TICKS_PER_BAR } from "../../engine/midi";
import { actions, currentProfile, selectedRegion, store, useUI } from "../state/store";
import { player } from "../audio/player";

const CELL = 16; // px per 16th note
const ROW = 15; // px per pitch row
const PITCH_TOP = 60;
const PITCH_BOT = 35;
const ROWS = PITCH_TOP - PITCH_BOT + 1;
const HEADER = 18;

const PITCH_LABEL: Record<number, string> = {
  36: "BD", 37: "BD2", 38: "SD", 39: "CP", 41: "BDX", 42: "CH", 44: "PH",
  45: "LT", 46: "OH", 47: "LMT", 48: "HMT", 49: "CR", 50: "HT", 51: "RD",
};

function noteColor(pitch: number): string {
  if (pitch <= 37) return "#ff5d5d";
  if (pitch <= 40) return "#ffb84d";
  if (pitch >= 42 && pitch <= 46) return "#57c7ff";
  if (pitch >= 41 && pitch <= 50) return "#b48cff";
  return "#7ee787";
}

/** Sum of bars (in ticks) before the given region, read outside the React subscription. */
function regionStartTickFor(regionId: string): number {
  let t = 0;
  for (const r of store.get().regions) {
    if (r.id === regionId) return t;
    t += r.bars * TICKS_PER_BAR;
  }
  return t;
}

export function PianoRollPanel() {
  const region = useUI((s) => selectedRegion(s));
  const profile = useUI((s) => currentProfile(s));
  const playing = useUI((s) => s.playing);
  const [sel, setSel] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragRef = useRef<number | null>(null);
  const pendingSelect = useRef<{ tick: number; pitch: number } | null>(null);

  const editable = !!region.editable;

  // Notes to display: editable passes through; generated is re-mapped live.
  const notes: MidiNote[] = useMemo(() => {
    if (region.editable) return region.editable.notes;
    return hitsToMidi(generateRegion(region), profile);
  }, [region, profile]);

  const width = Math.max(1, region.bars) * 16 * CELL;
  const height = HEADER + ROWS * ROW;

  // ---- rendering (rAF loop keeps the playhead live) ----
  useEffect(() => {
    let raf = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      const cv = canvasRef.current;
      if (!cv) return;
      const ctx = cv.getContext("2d");
      if (!ctx) return;

      ctx.fillStyle = "#0d1017";
      ctx.fillRect(0, 0, cv.width, cv.height);

      // header with bar numbers
      ctx.fillStyle = "#151a24";
      ctx.fillRect(0, 0, cv.width, HEADER);
      ctx.font = "10px ui-monospace, monospace";
      ctx.fillStyle = "#8b96a8";
      for (let bar = 0; bar < region.bars; bar++) {
        ctx.fillText(String(bar + 1), bar * 16 * CELL + 4, 12);
      }

      // grid
      for (let bar = 0; bar < region.bars; bar++) {
        for (let b = 0; b <= 4; b++) {
          const x = bar * 16 * CELL + b * 4 * CELL;
          ctx.strokeStyle = b === 0 ? (bar % 4 === 0 ? "#39415a" : "#2a3145") : "#1b2130";
          ctx.beginPath();
          ctx.moveTo(x + 0.5, HEADER);
          ctx.lineTo(x + 0.5, cv.height);
          ctx.stroke();
        }
      }
      for (let p = PITCH_BOT; p <= PITCH_TOP; p++) {
        const y = HEADER + (PITCH_TOP - p) * ROW;
        ctx.strokeStyle = p === 36 ? "#2b3346" : "#151b27";
        ctx.beginPath();
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(cv.width, y + 0.5);
        ctx.stroke();
      }
      ctx.fillStyle = "#5c6a82";
      ctx.font = "9px ui-monospace, monospace";
      for (let p = PITCH_BOT; p <= PITCH_TOP; p++) {
        const y = HEADER + (PITCH_TOP - p) * ROW + ROW - 3;
        ctx.fillText(PITCH_LABEL[p] ?? String(p), cv.width - 26, y);
      }

      // notes
      for (let i = 0; i < notes.length; i++) {
        const n = notes[i];
        if (n.pitch < PITCH_BOT || n.pitch > PITCH_TOP) continue;
        const x = (n.startTicks / 120) * CELL;
        const y = HEADER + (PITCH_TOP - n.pitch + 1) * ROW - 2;
        const w = Math.max(3, (n.durTicks / 120) * CELL);
        ctx.globalAlpha = 0.35 + 0.65 * (n.velocity / 127);
        ctx.fillStyle = noteColor(n.pitch);
        ctx.fillRect(x, y, w, ROW - 4);
        ctx.globalAlpha = 1;
        if (i === sel) {
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1.5;
          ctx.strokeRect(x - 1, y - 1, w + 2, ROW - 2);
          ctx.lineWidth = 1;
        }
      }

      // playhead
      if (playing) {
        const t = player.getCurrentTicks();
        const start = regionStartTickFor(region.id);
        if (t >= start && t < start + region.bars * TICKS_PER_BAR) {
          const x = ((t - start) / 120) * CELL;
          ctx.strokeStyle = "#3ddc84";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, cv.height);
          ctx.stroke();
          ctx.lineWidth = 1;
        }
      }
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [notes, region, sel, playing]);

  // ---- interactions ----
  const cellFromEvent = (e: React.MouseEvent) => {
    const cv = canvasRef.current!;
    const rect = cv.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return {
      x,
      y,
      tick: Math.floor(x / CELL) * 120,
      pitch: PITCH_TOP - Math.floor((y - HEADER) / ROW),
    };
  };

  const hitNote = (x: number, y: number): number => {
    for (let i = notes.length - 1; i >= 0; i--) {
      const n = notes[i];
      if (n.pitch < PITCH_BOT || n.pitch > PITCH_TOP) continue;
      const nx = (n.startTicks / 120) * CELL;
      const ny = HEADER + (PITCH_TOP - n.pitch + 1) * ROW - 2;
      const nw = Math.max(6, (n.durTicks / 120) * CELL);
      if (x >= nx - 2 && x <= nx + nw && y >= ny - 2 && y <= ny + ROW - 4) return i;
    }
    return -1;
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (!editable) return;
    const c = cellFromEvent(e);
    if (c.pitch < PITCH_BOT || c.pitch > PITCH_TOP) return;
    const idx = hitNote(c.x, c.y);
    if (idx >= 0) {
      setSel(idx);
      dragRef.current = idx;
    } else {
      actions.addNote(region.id, c.tick, c.pitch);
      pendingSelect.current = { tick: c.tick, pitch: c.pitch };
    }
  };

  // after addNote, find the new note's index (notes are kept sorted)
  useEffect(() => {
    if (!pendingSelect.current) return;
    const { tick, pitch } = pendingSelect.current;
    pendingSelect.current = null;
    const i = notes.findIndex((n) => n.startTicks === tick && n.pitch === pitch);
    if (i >= 0) {
      setSel(i);
      dragRef.current = i;
    }
  }, [notes]);

  const onMouseMove = (e: React.MouseEvent) => {
    if (!editable || dragRef.current === null) return;
    const c = cellFromEvent(e);
    const tick = Math.max(0, Math.min(region.bars * TICKS_PER_BAR - 12, c.tick));
    const pitch = Math.max(PITCH_BOT, Math.min(PITCH_TOP, c.pitch));
    const idx = dragRef.current;
    const n = notes[idx];
    if (!n) return;
    if (n.startTicks !== tick || n.pitch !== pitch) {
      actions.moveNote(region.id, idx, tick, pitch);
    }
  };

  const onMouseUp = () => {
    dragRef.current = null;
  };

  const onContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!editable) return;
    const c = cellFromEvent(e);
    const idx = hitNote(c.x, c.y);
    if (idx >= 0) {
      actions.deleteNote(region.id, idx);
      setSel(null);
    }
  };

  // delete key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && sel !== null && editable) {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
        actions.deleteNote(region.id, sel);
        setSel(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sel, editable, region.id]);

  // reset selection when the region switches
  useEffect(() => setSel(null), [region.id]);

  const selNote = sel !== null ? notes[sel] : null;

  return (
    <div className="panel roll-panel">
      <h2 className="roll-head">
        <span>
          Piano roll <span className="region-tag">{region.name}</span>
          <span className="region-tag muted">{region.editable ? "editable MIDI" : `generated · ${resolveArchetype(region)}`}</span>
          <span className="region-tag muted">{notes.length} notes</span>
        </span>
        <span className="roll-actions">
          {selNote && (
            <label className="vel-field" title="Velocity of the selected note">
              vel
              <input type="range" min={1} max={127} value={selNote.velocity} onChange={(e) => actions.setNoteVelocity(region.id, sel!, Number(e.target.value))} />
              <em>{selNote.velocity}</em>
            </label>
          )}
          {editable ? (
            <button className="btn small" onClick={() => actions.revertEditable(region.id)}>
              ↩ Revert to generated
            </button>
          ) : (
            <button className="btn small primary" onClick={() => actions.convertToEditable(region.id)}>
              ⤵ Convert to Editable MIDI
            </button>
          )}
        </span>
      </h2>
      <div className="roll-wrap">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onContextMenu={onContextMenu}
          className={editable ? "roll editable" : "roll"}
        />
      </div>
      <p className="hint">
        {editable
          ? "Click empty cell to add · click + drag a note to move · right-click or Del to delete · velocity slider for the selected note."
          : "Read-only preview of the generated take. “Convert to Editable MIDI” bounces it to standard MIDI notes in the current profile (Day-1 requirement)."}
      </p>
    </div>
  );
}
