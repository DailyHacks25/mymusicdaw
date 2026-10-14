import { PERSONAS, PERSONA_IDS, SEED_LIBRARY } from "../../engine/seedLibrary";
import { actions, selectedRegion, useUI } from "../state/store";

export function PersonaPanel() {
  const region = useUI((s) => selectedRegion(s));

  return (
    <div className="panel persona-panel">
      <h2>Session Drummer</h2>
      <div className="persona-cards">
        {PERSONA_IDS.map((pid) => {
          const p = PERSONAS[pid];
          const active = region.persona === pid;
          return (
            <button key={pid} className={active ? "persona-card active" : "persona-card"} onClick={() => actions.setPersona(region.id, pid)} title={p.style}>
              <div className="persona-name">{p.name}</div>
              <div className="persona-genre">{p.genre}</div>
              <div className="persona-vst">target: {p.targetVst}</div>
            </button>
          );
        })}
      </div>

      <label className="field">
        <span>Pattern (archetype)</span>
        <select
          value={region.archetypeId ?? "auto"}
          onChange={(e) => actions.setArchetype(region.id, e.target.value === "auto" ? null : e.target.value)}
        >
          <option value="auto">Auto (seeded — region #{region.seed})</option>
          {SEED_LIBRARY[region.persona].map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </label>

      <div className="field seed-row">
        <span>Region seed</span>
        <div className="seed-controls">
          <code>#{region.seed}</code>
          <button className="btn small" onClick={() => actions.reseedRegion(region.id)} title="Re-roll the region seed (new variation)">
            ⟳ Re-roll
          </button>
        </div>
      </div>

      <button className="btn wide" onClick={() => actions.applyPersonaDefaults(region.id)}>
        Load {PERSONAS[region.persona].name} defaults
      </button>
    </div>
  );
}
