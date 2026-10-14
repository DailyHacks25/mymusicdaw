/**
 * Fill templates (PRD §5 "Fill Heuristics").
 *
 * 12 authored templates per persona (3 per length: 1/2/3/4 beats).
 * Rows are sixteenth-note grids of length beats*4.
 *
 * Engine-side heuristics (implemented in engine.ts):
 *  - fills bias toward region boundaries regardless of Fill Frequency
 *  - fill length scales with Complexity (1-beat at low, full-bar at high)
 *  - N=2 history buffer bans consecutive repeat fills
 *  - manual override: "Force Fill at Bar End" / "Mute Fill at Bar End"
 */

import type { PersonaId } from "./types";

export interface FillTemplate {
  id: string;
  beats: 1 | 2 | 3 | 4;
  /** snare-family letters: S s G R W P */
  snare: string;
  /** tom letters: B M T */
  tom: string;
  /** optional hat letters during the fill: H O E (usually empty) */
  hat: string;
}

const T = (id: string, beats: 1 | 2 | 3 | 4, snare: string, tom: string, hat = ""): FillTemplate => ({
  id,
  beats,
  snare,
  tom,
  hat,
});

export const FILLS: Record<PersonaId, FillTemplate[]> = {
  // Energetic tom/snare turnarounds (PRD persona note).
  tightDriver: [
    T("td-f1a", 1, "....", "MMMS", ""),
    T("td-f1b", 1, "....", "BM.T", ""),
    T("td-f1c", 1, "G.Gs", "....", ""),
    T("td-f2a", 2, ".......s", "MMMM....", ""),
    T("td-f2b", 2, "...G.Gs.", "BM.T....", ""),
    T("td-f2c", 2, ".......s", "MMMMMM.M", ""),
    T("td-f3a", 3, "...........s", "BMTMBMTM....", ""),
    T("td-f3b", 3, "...GG.G.G.Gs", "....BMTM....", ""),
    T("td-f3c", 3, "...........s", "MMMMMM..MMMM", ""),
    T("td-f4a", 4, "...............s", "BMTMBMTMBMTMMMTM", ""),
    T("td-f4b", 4, ".........GG.GGGs", "BMTM.BMTM.......", ""),
    T("td-f4c", 4, "...............s", "MMMMMMMMMMMMMMMM", "O.....O.....O..."),
  ],

  // Loose, rim/ghost-led, backbeat-oriented.
  beatmaker: [
    T("bm-f1a", 1, "....", "MMMM", ""),
    T("bm-f1b", 1, "..ss", "....", ""),
    T("bm-f1c", 1, "G..s", "B...", ""),
    T("bm-f2a", 2, ".......s", "MMMM....", ""),
    T("bm-f2b", 2, "GG.GG.Gs", "........", ""),
    T("bm-f2c", 2, "....G.Gs", "BMTM....", ""),
    T("bm-f3a", 3, "........G.Gs", "MMMMMMMM....", ""),
    T("bm-f3b", 3, "GG.GG.GGG.Gs", "............", ""),
    T("bm-f3c", 3, "........R..s", "BMTMBMTM....", ""),
    T("bm-f4a", 4, "...............s", "BMTMBMTMBMTM.M..", ""),
    T("bm-f4b", 4, "GG.GG.GG.GGGGGGs", "........BMTM....", ""),
    T("bm-f4c", 4, "........GGGGGGGs", "MMMM....MMMM....", ""),
  ],

  // Ghost rolls, side-stick accents, low toms (PRD persona note).
  pocketPlayer: [
    T("pp-f1a", 1, "R..s", "....", ""),
    T("pp-f1b", 1, "....", "BBBW", ""),
    T("pp-f1c", 1, "G.Gs", "....", ""),
    T("pp-f2a", 2, ".......W", "BBBB....", ""),
    T("pp-f2b", 2, "GG.GR.Gs", "........", ""),
    T("pp-f2c", 2, "....G.Gs", "BMTM....", ""),
    T("pp-f3a", 3, "........GGGs", "BBBBBB......", ""),
    T("pp-f3b", 3, "GG.GG.GGG.Ws", "............", ""),
    T("pp-f3c", 3, "........R..s", "BMTMBMTM....", ""),
    T("pp-f4a", 4, "...............W", "BBBBBBBMBMTM....", ""),
    T("pp-f4b", 4, "GG.GG.GG.GGGGGGs", "........BMTM....", ""),
    T("pp-f4c", 4, ".........R....Ws", "BMTM....BMTM....", ""),
  ],

  // Synced stabs, clap rolls (PRD persona: tight humanization baseline).
  groovebox: [
    T("gb-f1a", 1, "....", "MMMM", ""),
    T("gb-f1b", 1, "PP..", "....", ""),
    T("gb-f1c", 1, "....", "MMPP", ""),
    T("gb-f2a", 2, "....PP..", "MMMM....", ""),
    T("gb-f2b", 2, "MMMM....", "........", ""),
    T("gb-f2c", 2, "....PPPP", "MM.MM...", ""),
    T("gb-f3a", 3, "........PPPP", "MMMMMMMM....", ""),
    T("gb-f3b", 3, "MMMMMMMM....", "......MM.MM.", ""),
    T("gb-f3c", 3, "........PPPP", "B...B...B.M.", ""),
    T("gb-f4a", 4, "...............s", "BMTMBMTMBMTMMMTM", ""),
    T("gb-f4b", 4, "PPPPPPPPPPPPPPPP", "M.M.M.M.M.M.M.M.", ""),
    T("gb-f4c", 4, "..........GGGGGs", "B...B...B...M...", "O....O....O....O"),
  ],
};

/**
 * Allowed fill lengths by Complexity (PRD: "Fill length scales with
 * Complexity — 1-beat fills at low complexity, full-bar at high").
 */
export function allowedFillBeats(complexity: number): (1 | 2 | 3 | 4)[] {
  if (complexity < 25) return [1];
  if (complexity < 50) return [1, 2];
  if (complexity < 80) return [2, 3];
  if (complexity < 90) return [3, 4];
  return [4];
}
