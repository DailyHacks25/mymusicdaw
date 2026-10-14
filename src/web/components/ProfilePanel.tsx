import { ARTICULATIONS, ARTICULATION_META } from "../../engine/articulations";
import type { ArticulationId } from "../../engine/articulations";
import { actions, BUILTIN_PROFILES, currentProfile, useUI } from "../state/store";

export function ProfilePanel() {
  const state = useUI((s) => s);
  const profile = currentProfile(state);
  const isUser = !profile.builtin;

  return (
    <div className="panel">
      <h2>
        Output Profile <span className="region-tag muted">semantic articulation → MIDI mapping</span>
      </h2>
      <div className="profile-row">
        <select value={profile.id} onChange={(e) => actions.setProfile(e.target.value)}>
          {BUILTIN_PROFILES.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
          {state.userProfiles.length > 0 && <option disabled>— user profiles —</option>}
          {state.userProfiles.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <button
          className="btn small"
          title="Duplicate the current profile as an editable user profile"
          onClick={() => {
            const name = window.prompt("User profile name:", `${profile.name} (custom)`);
            if (name === null) return;
            actions.saveUserProfile(name);
          }}
        >
          ⧉ Duplicate as user profile
        </button>
        {isUser && (
          <button className="btn small" title="Delete this user profile" onClick={() => {
            if (window.confirm(`Delete user profile “${profile.name}”?`)) actions.deleteUserProfile(profile.id);
          }}>
            🗑
          </button>
        )}
      </div>
      {!isUser && (
        <p className="hint">
          Bundled profiles are read-only — duplicate to one to remap. Toontrack / XLN / SSD tables are documented best-effort
          approximations; verifying note-map accuracy needs licensed copies (PRD §6 procurement line item).
        </p>
      )}
      <div className="map-table">
        {ARTICULATIONS.map((a: ArticulationId) => {
          const m = profile.maps[a];
          return (
            <div className="map-row" key={a}>
              <span className="map-label">{ARTICULATION_META[a].label}</span>
              <select
                className="map-pitch"
                value={m.pitch}
                disabled={!isUser}
                onChange={(e) => actions.patchUserMap(profile.id, a, { pitch: Number(e.target.value) })}
              >
                {Array.from({ length: 36 }, (_, i) => 35 + i).map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <input
                type="range"
                className="map-vel"
                min={-40}
                max={40}
                value={m.velOffset}
                disabled={!isUser}
                onChange={(e) => actions.patchUserMap(profile.id, a, { velOffset: Number(e.target.value) })}
                title="Velocity offset"
              />
              <em className="map-velv">{m.velOffset > 0 ? `+${m.velOffset}` : m.velOffset}</em>
            </div>
          );
        })}
      </div>
    </div>
  );
}
