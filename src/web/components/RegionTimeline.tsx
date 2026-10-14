import type { SectionKind } from "../../engine/types";
import { actions, useUI } from "../state/store";

const SECTIONS: SectionKind[] = ["Intro", "Verse", "Pre-Chorus", "Chorus", "Bridge", "Outro"];

export function RegionTimeline() {
  const regions = useUI((s) => s.regions);
  const selectedId = useUI((s) => s.selectedRegionId);

  return (
    <div className="panel regions-panel">
      <h2>Arrangement</h2>
      <div className="region-chips">
        {regions.map((r) => (
          <div key={r.id} className={r.id === selectedId ? "chip selected" : "chip"} onClick={() => actions.selectRegion(r.id)}>
            <select
              value={r.section}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => actions.setRegionSection(r.id, e.target.value as SectionKind)}
            >
              {SECTIONS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <span className="chip-bars">
              <input
                type="number"
                min={1}
                max={64}
                value={r.bars}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => actions.setRegionBars(r.id, Number(e.target.value))}
              />
              bars
            </span>
            {r.editable && <span className="badge edit">EDIT</span>}
            {r.followSource && <span className="badge follow">FOLLOW</span>}
            {regions.length > 1 && (
              <button
                className="chip-x"
                title="Remove region"
                onClick={(e) => {
                  e.stopPropagation();
                  actions.removeRegion(r.id);
                }}
              >
                ×
              </button>
            )}
          </div>
        ))}
        <button className="chip add" onClick={() => actions.addRegion()}>
          + region
        </button>
      </div>
      <p className="hint">
        Each Drummer Region carries independent macro state, fill dial and instrument mutes — the same model Logic uses. Region
        boundaries trigger the fill engine (turnaround fills + section crashes).
      </p>
    </div>
  );
}
