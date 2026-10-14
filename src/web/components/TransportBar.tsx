import { actions, useUI, projectBarCount } from "../state/store";

export function TransportBar() {
  const bpm = useUI((s) => s.bpm);
  const playing = useUI((s) => s.playing);
  const bars = useUI((s) => projectBarCount(s));

  return (
    <header className="transport">
      <div className="brand">
        <span className="logo">mymusicdaw</span>
        <span className="sub">
          Intelligent Drummer · v1 · {bars} bars
        </span>
      </div>
      <div className="transport-right">
        <label className="bpm-box" title="Project tempo">
          <span>BPM</span>
          <input type="number" min={40} max={220} value={bpm} onChange={(e) => actions.setBpm(Number(e.target.value))} />
        </label>
        <button className={playing ? "btn play active" : "btn play"} onClick={() => actions.togglePlay()}>
          {playing ? "■ Stop" : "▶ Play"}
        </button>
        <button className="btn" onClick={() => actions.exportMidi()}>
          ⬇ Export MIDI
        </button>
      </div>
    </header>
  );
}
