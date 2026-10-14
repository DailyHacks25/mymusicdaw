import type { FillFrequency, InstrumentMutes, MacroState } from "../../engine/types";
import { actions, selectedRegion, useUI } from "../state/store";

const FILL_FREQS: { id: FillFrequency; label: string }[] = [
  { id: "off", label: "Off" },
  { id: "rare", label: "Rare" },
  { id: "standard", label: "Std" },
  { id: "frequent", label: "Freq" },
  { id: "turnarounds", label: "Turnarounds" },
];

const MUTES: { key: keyof InstrumentMutes; label: string }[] = [
  { key: "kick", label: "Kick" },
  { key: "snare", label: "Snare" },
  { key: "hats", label: "Hats" },
  { key: "toms", label: "Toms" },
  { key: "cymbals", label: "Cym" },
];

function Slider({ label, value, onChange, hint }: { label: string; value: number; onChange: (v: number) => void; hint: string }) {
  return (
    <label className="field slider-field" title={hint}>
      <span>
        {label} <em>{value}</em>
      </span>
      <input type="range" min={0} max={100} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}

export function MacroPanel() {
  const region = useUI((s) => selectedRegion(s));
  const m = region.macros;
  const set = (key: keyof MacroState) => (v: number | string) => actions.setMacro(region.id, key, v);

  return (
    <div className="panel">
      <h2>
        Macros <span className="region-tag">{region.name} · {region.bars} bars</span>
      </h2>
      <div className="macros-grid">
        <Slider label="Complexity" value={m.complexity} onChange={set("complexity")} hint="0–50: additive unmasking of ghost notes/16ths · 50–100: cross-fade to substitution layer" />
        <Slider label="Intensity" value={m.intensity} onChange={set("intensity")} hint="Velocity curve + accent shaping only — never changes note density" />
        <Slider label="Swing" value={m.swing} onChange={set("swing")} hint="Standard triplet-swing ratio (Logic/Ableton/FL convention)" />
        <Slider label="Tightness" value={m.tightness} onChange={set("tightness")} hint="100 = locked to grid · lower = Gaussian microtiming + correlated groove drift on kick/snare" />
      </div>

      <div className="field">
        <span>Fill frequency</span>
        <div className="segmented">
          {FILL_FREQS.map((f) => (
            <button key={f.id} className={m.fillFrequency === f.id ? "seg active" : "seg"} onClick={() => set("fillFrequency")(f.id)}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <span>Fill override</span>
        <div className="segmented">
          {(["auto", "force", "mute"] as const).map((f) => (
            <button key={f} className={m.fillOverride === f ? "seg active" : "seg"} onClick={() => set("fillOverride")(f)} title={f === "auto" ? "Fill engine heuristic" : f === "force" ? "Force Fill at Bar End" : "Mute Fill at Bar End"}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <span>Instrument mutes</span>
        <div className="mutes">
          {MUTES.map((x) => (
            <label key={x.key} className={region.mutes[x.key] ? "mute on" : "mute"}>
              <input type="checkbox" checked={region.mutes[x.key]} onChange={(e) => actions.setMute(region.id, x.key, e.target.checked)} />
              {x.label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
