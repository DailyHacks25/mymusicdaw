import { SOURCE_TRACKS } from "../../engine/sources";
import { actions, selectedRegion, useUI } from "../state/store";

export function FollowPanel() {
  const region = useUI((s) => selectedRegion(s));
  return (
    <div className="panel">
      <h2>Follow</h2>
      <label className="field">
        <span>Source MIDI track</span>
        <select value={region.followSource ?? "none"} onChange={(e) => actions.setFollow(region.id, e.target.value === "none" ? null : (e.target.value as "demoBass" | "demoGuitar"))}>
          <option value="none">None</option>
          {Object.values(SOURCE_TRACKS).map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </label>
      <p className="hint">
        The engine reads this track's Note-On positions and velocities and biases kick placement to coincide with them.
        v1 scope: MIDI-to-MIDI only — no audio transient detection, no chord-track dependency.
      </p>
    </div>
  );
}
