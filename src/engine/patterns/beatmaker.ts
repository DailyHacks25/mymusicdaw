/**
 * The Beatmaker — Hip-Hop / Boom-Bap / Trap (PRD §5 persona matrix).
 * "Heavy kick displacement, triplets, trap hat rolls at high complexity,
 *  loose boom-bap swing." Target VST: Battery / Kontakt kits / internal SoundFont.
 *
 * 35 authored archetypes. Row resolutions used:
 *   16 chars = 16th grid (standard)
 *   32 chars = 32nd-note grid (trap hat rolls, 808 rolls)
 *   12 chars = 8th-note triplets (drill/2-step triplet kicks & hats)
 *   24 chars = 16th-note triplets
 */

import { archetype } from "../patterns";
import type { ArchetypeDef } from "../patterns";

export const BEATMAKER: ArchetypeDef[] = [
  archetype("bm-01", "Boom Bap Classic", "AABA",
    {
      kick: ["K.......K.......", "K.......K......."],
      snare: ["....s.......s...", "....s.......s..."],
      hat: ["H.H.H.H.H.H.H.H.", "H.H.H.H.H.H.H.H."],
    },
    {
      kick: ["...K.......K....", ""],
      snare: ["..G...G...G...G.", ""],
      hat: ["..O...O...O...O.", ""],
    },
    {
      hat: ["HHHHHHHHHHHH", ""],
    },
  ),
  archetype("bm-02", "East Coast 90s", "AABA",
    {
      kick: ["K......KK......K", "K......KK......K"],
      snare: ["....s.......s...", "....s.......s..."],
      hat: [
        ["H.H.H.H.H.H.H.H.", "......O........."],
        ["H.H.H.H.H.H.H.H.", "......O........."],
      ],
    },
    {
      kick: ["...K.......K....", ""],
      snare: ["..G...G...G...G.", ""],
    },
    {
      hat: ["HHHHHHHHHHHH", ""],
    },
  ),
  archetype("bm-03", "West Coast G-Funk", "AABA",
    {
      kick: ["K...K..KK......K", "K...K..KK......K"],
      snare: ["....s.......s...", "....s.......s..."],
      hat: [
        ["H.H.H.H.H.H.H.H.", "......O.......O."],
        ["H.H.H.H.H.H.H.H.", "......O.......O."],
      ],
    },
    {
      kick: ["...K.......K....", ""],
      snare: ["..G...G...G...G.", ""],
      hat: ["", "HHHHHHHHHHHHHHHH"],
    },
    {
      hat: ["HHHHHHHHHHHH", ""],
    },
  ),
  archetype("bm-04", "Boom Bap Loop", "ABAB",
    {
      kick: ["K.......K.......", "K......K.K......"],
      snare: ["....s.......s...", "....s.......s..."],
      hat: [
        ["H.H.H.H.H.H.H.H."],
        ["H.H.H.H.H.H.H.H.", "......O........."],
      ],
    },
    {
      kick: ["...K.......K....", ""],
      snare: ["..G...G...G...G.", ""],
    },
    {
      hat: ["HHHHHHHHHHHH", ""],
    },
  ),
  archetype("bm-05", "Trap Basic", "AAAA",
    {
      kick: ["K.........K....."],
      snare: ["....s.......s..."],
      hat: ["HHHHHHHHHHHHHHHH"],
    },
    {
      kick: [".......K.......K"],
      hat: ["H.H.H.H.H.H.H.H.H.H.H.H.H.H.HHHH"],
    },
    {
      hat: ["..O...O...O...O."],
      kick: [".....K.......K.."],
    },
  ),
  archetype("bm-06", "Trap Roll", "AAAA",
    {
      kick: ["K.........K....."],
      snare: ["....s.......s..."],
      hat: ["HHHHHHHHHHHHHHHH"],
    },
    {
      kick: [".......K.......K"],
      hat: ["H.H.H.H.H.H.H.HHHHH.H.H.H.H.HHHH"],
    },
    {
      hat: ["..O...O...O...O."],
    },
  ),
  archetype("bm-07", "Drill Triplet", "AABA",
    {
      kick: ["K.....K....."],
      snare: ["....s.......s...", "....s.......s..."],
      hat: ["HHHHHHHHHHHHHHHH", "HHHHHHHHHHHHHHHH"],
    },
    {
      kick: ["..K..K..K..K"],
      snare: ["..G...G...G...G.", ""],
    },
    {
      hat: ["HHHHHHHHHHHH", ""],
    },
  ),
  archetype("bm-08", "Boom Bap Sparse", "AAAA",
    {
      kick: ["K..............."],
      snare: ["....s.......s..."],
      hat: ["H.H.H.H.H.H.H.H."],
    },
    {
      kick: ["K.......K......."],
      hat: ["......O.......O."],
    },
    {
      hat: ["HHHHHHHHHHHH"],
    },
  ),
  archetype("bm-09", "Southern Trap", "AAAA",
    {
      kick: ["K..K...K..K..K.."],
      snare: ["....s.......s..."],
      hat: ["HHHHHHHHHHHHHHHH"],
    },
    {
      kick: ["......K.....K..."],
      snare: ["..G...G...G...G."],
    },
    {
      hat: ["..O...O...O...O."],
    },
  ),
  archetype("bm-10", "90s Boom", "ABAB",
    {
      kick: ["K.......K.......", "K......KK......K"],
      snare: ["....s.......s...", "....s.......s..."],
      hat: [
        ["H.H.H.H.H.H.H.H."],
        ["H.H.H.H.H.H.H.H.", "......O.......O."],
      ],
    },
    {
      kick: ["...K.......K....", ""],
      snare: ["..G...G...G...G.", ""],
    },
    {
      hat: ["HHHHHHHHHHHH", ""],
    },
  ),
  archetype("bm-11", "Gangsta 2-Step", "AAAA",
    {
      kick: ["K.......K......."],
      snare: ["....s.......s..."],
      hat: [
        ["H.H.H.H.H.H.H.H.", "..O...O...O...O."],
      ],
    },
    {
      kick: ["K.K.K.K.K.K."],
    },
    {
      hat: ["H...H...H...H...H...H..."],
    },
  ),
  archetype("bm-12", "Boom Bap Shuffle", "AAAA",
    {
      kick: ["K......K........"],
      snare: ["....s.......s..."],
      hat: ["H.H.H.H.H.H.H.H."],
    },
    {
      kick: ["K.......K......."],
      hat: ["......O........."],
    },
    {
      hat: ["HHHHHHHHHHHH"],
    },
  ),
  archetype("bm-13", "West Coast Bounce", "AABA",
    {
      kick: ["K...K.....K.....", "K...K.....K....."],
      snare: ["....s.......s...", "....s.......s..."],
      hat: [
        ["H.H.H.H.H.H.H.H.", "......O.......O."],
        ["H.H.H.H.H.H.H.H.", "......O.......O."],
      ],
    },
    {
      kick: ["...K.......K....", ""],
      snare: ["..G...G...G...G.", ""],
    },
    {
      hat: ["HHHHHHHHHHHH", ""],
    },
  ),
  archetype("bm-14", "Trap Minimal", "AAAA",
    {
      kick: ["K.......K......."],
      snare: ["....s.......s..."],
      hat: ["H...H...H...H..."],
    },
    {
      kick: [".......K.......K"],
      hat: ["HHHHHHHHHHHHHHHH"],
    },
    {
      hat: ["..O...O...O...O."],
    },
  ),
  archetype("bm-15", "Boom Bap Swing", "AABA",
    {
      kick: ["K.......K.......", "K.......K......."],
      snare: ["....s.......s...", "....s.......s..."],
      hat: [
        ["H.H.H.H.H.H.H.H.", "......O........."],
        ["H.H.H.H.H.H.H.H.", "......O........."],
      ],
    },
    {
      kick: ["K......K........", ""],
      hat: ["", "......O.......O."],
    },
    {
      hat: ["HHHHHHHHHHHH", ""],
    },
  ),
  archetype("bm-16", "East Coast Flip", "AABA",
    {
      kick: ["K.....K.K.......", "K.....K.K......."],
      snare: ["....s.......s...", "....s.......s..."],
      hat: [
        ["H.H.H.H.H.H.H.H.", "......O.......O."],
        ["H.H.H.H.H.H.H.H.", "......O.......O."],
      ],
    },
    {
      kick: ["...K.......K....", ""],
      snare: ["..G...G...G...G.", ""],
    },
    {
      hat: ["HHHHHHHHHHHH", ""],
    },
  ),
  archetype("bm-17", "Trap 808", "AAAA",
    {
      kick: ["K.........K....."],
      snare: ["....s.......s..."],
      hat: ["HHHHHHHHHHHHHHHH"],
    },
    {
      kick: ["K.K.K.K.K.K.K.K.K.K.K.K.K.KKKKKK"],
      hat: ["H.H.H.H.H.H.H.H.H.H.H.H.H.H.HHHH"],
    },
    {
      hat: ["..O...O...O...O."],
    },
  ),
  archetype("bm-18", "Boom Bap Break", "ABAB",
    {
      kick: ["K.....K...K.....", "K.....K.K......."],
      snare: ["....s.......s...", "....s.......s..."],
      hat: ["H.H.H.H.H.H.H.H.", "H.H.H.H.H.H.H.H."],
    },
    {
      kick: ["...K.......K....", ""],
      tom: ["", "............TT.."],
    },
    {
      hat: ["HHHHHHHHHHHH", "..O...O...O...O."],
    },
  ),
  archetype("bm-19", "Hip Hop Bounce", "AAAA",
    {
      kick: ["K...K..........."],
      snare: ["....s.......s..."],
      hat: ["H.H.H.H.H.H.H.H."],
    },
    {
      kick: ["........K....K.."],
      hat: ["HHHHHHHHHHHHHHHH"],
    },
    {
      hat: ["..O...O...O...O."],
    },
  ),
  archetype("bm-20", "Boom Bap Classic 2", "AABA",
    {
      kick: ["...K...K...K....", "...K...K...K...."],
      snare: ["....s.......s...", "....s.......s..."],
      hat: [
        ["H.H.H.H.H.H.H.H.", "......O........."],
        ["H.H.H.H.H.H.H.H.", "......O........."],
      ],
    },
    {
      kick: ["K.........K.....", ""],
      snare: ["..G...G...G...G.", ""],
    },
    {
      hat: ["HHHHHHHHHHHH", ""],
    },
  ),
  archetype("bm-21", "Trap Double Time", "AAAA",
    {
      kick: ["K.K.K.K.K.K.K.K."],
      snare: ["....s.......s..."],
      hat: ["HHHHHHHHHHHHHHHH"],
    },
    {
      kick: ["K.K.K.K.K.K.K.KKK.K.K.K.K.K.K.KK"],
      hat: ["H.H.H.H.H.H.H.H.H.H.H.H.H.H.HHHH"],
    },
    {
      hat: ["..O...O...O...O."],
    },
  ),
  archetype("bm-22", "Boom Bap Dusty", "AAAA",
    {
      kick: ["K.......K......."],
      snare: ["..G...G...G...G."],
      hat: ["H.H.H.H.H.H.H.H."],
    },
    {
      kick: ["...K.......K...."],
      hat: ["......O.......O."],
    },
    {
      hat: ["HHHHHHHHHHHH"],
    },
  ),
  archetype("bm-23", "Trap Hi-Hat Roll", "AAAA",
    {
      kick: ["K.........K....."],
      snare: ["....s.......s..."],
      hat: ["HHHHHHHHHHHHHHHH"],
    },
    {
      kick: [".......K.......K"],
      hat: ["H.H.H.H.H.H.H.HHHHH.H.H.H.H.HHHH"],
    },
    {
      hat: ["..O...O...O...O."],
    },
  ),
  archetype("bm-24", "Boom Bap 2-Step", "AABA",
    {
      kick: ["K.......K.......", "K.......K......."],
      snare: ["....s.......s...", "....s.......s..."],
      hat: [
        ["H.H.H.H.H.H.H.H.", "..O...O...O...O."],
        ["H.H.H.H.H.H.H.H.", "..O...O...O...O."],
      ],
    },
    {
      kick: ["K.K.K.K.K.K.", ""],
    },
    {
      hat: ["HHHHHHHHHHHHHHHHHHHHHHHH", ""],
    },
  ),
  archetype("bm-25", "West Coast Drift", "AAAA",
    {
      kick: ["K...K.......K..."],
      snare: ["....s.......s..."],
      hat: [
        ["H.H.H.H.H.H.H.H.", "......O.......O."],
      ],
    },
    {
      kick: ["K.......K......."],
      snare: ["..G...G...G...G."],
    },
    {
      hat: ["HHHHHHHHHHHH"],
    },
  ),
  archetype("bm-26", "Trap Bass Drop", "AABB",
    {
      kick: ["K.......K.......", "...K..K..K..K..."],
      snare: ["....s.......s...", "....s.......s..."],
      hat: ["HHHHHHHHHHHHHHHH", "HHHHHHHHHHHHHHHH"],
    },
    {
      kick: ["", ".......K.......K"],
      hat: ["", "H.H.H.H.H.H.H.H.H.H.H.H.H.H.HHHH"],
    },
    {
      hat: ["", "..O...O...O...O."],
    },
  ),
  archetype("bm-27", "Boom Bap Head Nod", "AAAA",
    {
      kick: ["K......K........"],
      snare: ["....s.......s..."],
      hat: [
        ["H.H.H.H.H.H.H.H.", "......O........."],
      ],
    },
    {
      kick: ["K.......K......."],
      snare: ["..G...G...G...G."],
    },
    {
      hat: ["HHHHHHHHHHHH"],
      cym: ["D.D.D.D.D.D.D.D."],
    },
  ),
  archetype("bm-28", "East Coast Boom", "AABA",
    {
      kick: ["K.....K.K.....K.", "K.....K.K.....K."],
      snare: ["....s.......s...", "....s.......s..."],
      hat: [
        ["H.H.H.H.H.H.H.H.", "......O.......O."],
        ["H.H.H.H.H.H.H.H.", "......O.......O."],
      ],
    },
    {
      kick: ["...K.......K....", ""],
      snare: ["..G...G...G...G.", ""],
    },
    {
      hat: ["HHHHHHHHHHHH", ""],
    },
  ),
  archetype("bm-29", "Trap Piano Loop", "AAAA",
    {
      kick: ["K...K...K......."],
      snare: ["....s.......s..."],
      hat: ["HHHHHHHHHHHHHHHH"],
    },
    {
      kick: ["........K...K..."],
      hat: ["H.H.H.H.H.H.H.H.H.H.H.H.H.H.HHHH"],
    },
    {
      hat: ["..O...O...O...O."],
    },
  ),
  archetype("bm-30", "Boom Bap Dusty 2", "AABB",
    {
      kick: ["K.......K.......", "K......K.K......"],
      snare: ["....s.......s...", "....s.......s..."],
      hat: [
        ["H.H.H.H.H.H.H.H."],
        ["H.H.H.H.H.H.H.H.", "......O.......O."],
      ],
    },
    {
      kick: ["...K.......K....", ""],
      snare: ["..G...G...G...G.", ""],
    },
    {
      hat: ["HHHHHHHHHHHH", ""],
    },
  ),
  archetype("bm-31", "G-Funk Bounce 2", "AAAA",
    {
      kick: ["K....K.K....K..."],
      snare: ["....s.......s..."],
      hat: [
        ["H.H.H.H.H.H.H.H.", "......O.......O."],
      ],
    },
    {
      kick: [".......K.....K.."],
      snare: ["..G...G...G...G."],
    },
    {
      hat: ["HHHHHHHHHHHH"],
    },
  ),
  archetype("bm-32", "Trap 16th Kick", "AAAA",
    {
      kick: ["K.K.K.K.K.K.K.K."],
      snare: ["....s.......s..."],
      hat: ["HHHHHHHHHHHHHHHH"],
    },
    {
      kick: ["KKKKKKKKKKKKKKKK"],
      hat: ["H.H.H.H.H.H.H.H.H.H.H.H.H.H.HHHH"],
    },
    {
      hat: ["..O...O...O...O."],
    },
  ),
  archetype("bm-33", "Boom Bap Chopped", "AABA",
    {
      kick: ["K.......K.......", "K.......K......."],
      snare: ["....s.......s...", "....s.......s..."],
      hat: ["H.H..H.H.H..H.H.", "H.H..H.H.H..H.H."],
    },
    {
      kick: ["...K.......K....", ""],
      hat: ["......O.........", ""],
    },
    {
      hat: ["HHHHHHHHHHHH", ""],
    },
  ),
  archetype("bm-34", "Southern Bounce 2", "AABB",
    {
      kick: ["K...K..K.K......", "K...K..K.K....K."],
      snare: ["....s.......s...", "....s.......s..."],
      hat: [
        ["H.H.H.H.H.H.H.H."],
        ["H.H.H.H.H.H.H.H.", "......O.......O."],
      ],
    },
    {
      kick: ["...K.......K....", ""],
      snare: ["..G...G...G...G.", ""],
    },
    {
      hat: ["HHHHHHHHHHHH", ""],
    },
  ),
  archetype("bm-35", "Trap Future", "AAAA",
    {
      kick: ["K.....K...K....."],
      snare: ["....s.......s..."],
      hat: ["HHHHHHHHHHHHHHHH"],
    },
    {
      kick: ["K...........K.......K...KKKKK..."],
      hat: ["H.H.H.H.H.H.H.H.H.H.H.H.H.H.HHHH"],
    },
    {
      hat: ["..O...O...O...O."],
    },
  ),
];
