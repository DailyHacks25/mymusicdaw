import { TransportBar } from "./components/TransportBar";
import { PersonaPanel } from "./components/PersonaPanel";
import { MacroPanel } from "./components/MacroPanel";
import { FollowPanel } from "./components/FollowPanel";
import { RegionTimeline } from "./components/RegionTimeline";
import { PianoRollPanel } from "./components/PianoRoll";
import { ProfilePanel } from "./components/ProfilePanel";

export default function App() {
  return (
    <div className="app">
      <TransportBar />
      <div className="layout">
        <aside className="col-left">
          <PersonaPanel />
          <FollowPanel />
        </aside>
        <main className="col-main">
          <RegionTimeline />
          <MacroPanel />
          <PianoRollPanel />
          <ProfilePanel />
        </main>
      </div>
      <footer className="foot">
        Rule-based session drummer · hybrid authored seed grid + procedural variation · deterministic per-region seeds ·
        semantic articulation model with BYO-VST mapping profiles. Prototype of the v1 DAW (PRD §5); audio here is the bundled
        fallback synth standing in for the sfizz/FluidSynth kit.
      </footer>
    </div>
  );
}
