/**
 * The Pocket Player — Acoustic / Singer-Songwriter / Indie (PRD §5 persona
 * matrix). "High dynamic range, extensive ghost notes, side-stick accents,
 * laidback behind-the-beat drift." Target VST: Addictive Drums 2.
 *
 * 35 authored archetypes. Dynamic range is expressed with soft (S) vs hard
 * (s) snare letters, low-velocity ghost/rim/side work in the base layer, and
 * a low-tightness persona default so the microtiming layer leans behind the
 * beat (PRD: "laidback behind-the-beat drift").
 */

import { archetype } from "../patterns";
import type { ArchetypeDef } from "../patterns";

export const POCKET_PLAYER: ArchetypeDef[] = [
  archetype("pp-01", "Fingerpicked", "AAAA",
    {
      kick: ["K.......K......."],
      snare: ["....S.......S..."],
      hat: ["H.H.H.H.H.H.H.H."],
    },
    {
      kick: ["K...K...K...K..."],
      snare: ["..G...G...G...G."],
    },
    {
      hat: ["..E...E...E...E."],
    },
  ),
  archetype("pp-02", "Singer Songwriter", "AABA",
    {
      kick: ["K......K.K......", "K......K.K......"],
      snare: ["....S.......S...", "....S.......S..."],
      hat: ["H.H.H.H.H.H.H.H.", "H.H.H.H.H.H.H.H."],
    },
    {
      kick: ["K.......K.......", ""],
      snare: ["..G...G...G...G.", ""],
    },
    {
      hat: ["..O...O...O...O.", ""],
    },
  ),
  archetype("pp-03", "Indie Folk", "AABB",
    {
      kick: ["K.......K.......", "K...K...K...K..."],
      snare: ["....S.......S...", "....s.......s..."],
      hat: ["H.H.H.H.H.H.H.H.", "H.H.H.H.H.H.H.H."],
    },
    {
      kick: ["", "K...K...K...K..."],
      snare: ["", "..G...G...G...G."],
    },
    {
      hat: ["", "..E...E...E...E."],
    },
  ),
  archetype("pp-04", "Brushed Ballad", "AAAA",
    {
      kick: ["K..............."],
      snare: ["....S.......S..."],
      cym: ["D.......D......."],
    },
    {
      snare: ["..G...G...G...G."],
      kick: ["........K......."],
    },
    {
      snare: ["S.S.S.S.S.S.S.S."],
    },
  ),
  archetype("pp-05", "Laidback Groove", "AAAA",
    {
      kick: ["K.......K......."],
      snare: ["....S.......S..."],
      hat: [
        ["H.H.H.H.H.H.H.H.", "......O........."],
      ],
    },
    {
      kick: ["...K.......K...."],
      snare: ["..G...G...G...G."],
    },
    {
      cym: ["D.D.D.D.D.D.D.D."],
    },
  ),
  archetype("pp-06", "Acoustic Drive", "AABA",
    {
      kick: ["K...K...K...K...", "K...K...K...K..."],
      snare: ["....S.......S...", "....S.......S..."],
      hat: ["H.H.H.H.H.H.H.H.", "H.H.H.H.H.H.H.H."],
    },
    {
      kick: [".......K.......K", ""],
      snare: ["..G...G...G...G.", ""],
    },
    {
      hat: ["HHHHHHHHHHHHHHHH", ""],
    },
  ),
  archetype("pp-07", "Cafe Jazz", "AABA",
    {
      kick: ["K.......K.......", "K.......K......."],
      snare: ["....S.......S...", "....S.......S..."],
      cym: ["D.D.D.D.D.D.D.D.", "D.D.D.D.D.D.D.D."],
    },
    {
      kick: ["...K.......K....", ""],
      snare: ["..G...G...G...G.", ""],
    },
    {
      snare: ["S.S.S.S.S.S.S.S.", ""],
    },
  ),
  archetype("pp-08", "Shaker Pop", "AAAA",
    {
      kick: ["K.......K......."],
      snare: ["....S.......S...", "..G...G...G...G."],
      hat: ["H.H.H.H.H.H.H.H."],
    },
    {
      kick: ["K...K...K...K..."],
      hat: ["HHHHHHHHHHHHHHHH"],
    },
    {
      hat: ["..E...E...E...E."],
    },
  ),
  archetype("pp-09", "Indie Ballad", "AABB",
    {
      kick: ["K...............", "K.......K......."],
      snare: ["....S.......S...", "....s.......s..."],
      hat: ["H.H.H.H.H.H.H.H.", "H.H.H.H.H.H.H.H."],
    },
    {
      kick: ["........K.......", ""],
      snare: ["..G...G...G...G.", ""],
    },
    {
      hat: ["", "..O...O...O...O."],
    },
  ),
  archetype("pp-10", "Folk Shuffle", "AAAA",
    {
      kick: ["K......K........"],
      snare: ["....S.......S..."],
      hat: ["H.H.H.H.H.H.H.H."],
    },
    {
      kick: ["K.......K......."],
      snare: ["..G...G...G...G."],
    },
    {
      hat: ["HHHHHHHHHHHH"],
    },
  ),
  archetype("pp-11", "Singer Songwriter 2", "AABA",
    {
      kick: ["...K...K..K.....", "...K...K..K....."],
      snare: ["....S.......S...", "....S.......S..."],
      hat: ["H.H.H.H.H.H.H.H.", "H.H.H.H.H.H.H.H."],
    },
    {
      kick: ["K.............K.", ""],
      snare: ["..G...G...G...G.", ""],
    },
    {
      hat: ["..O...O...O...O.", ""],
    },
  ),
  archetype("pp-12", "Acoustic Pop", "AAAA",
    {
      kick: ["K...K...K...K..."],
      snare: ["....S.......S...", "..G...G...G...G."],
      hat: ["H.H.H.H.H.H.H.H."],
    },
    {
      kick: [".......K.......K"],
      hat: ["HHHHHHHHHHHHHHHH"],
    },
    {
      hat: ["..E...E...E...E."],
    },
  ),
  archetype("pp-13", "Campfire", "AABB",
    {
      kick: ["K.......K.......", "K...K...K...K..."],
      snare: ["....S.......S...", "....s.......s..."],
      hat: [
        ["H.H.H.H.H.H.H.H."],
        ["H.H.H.H.H.H.H.H.", "......O.......O."],
      ],
    },
    {
      snare: ["..G...G...G...G.", ""],
    },
    {
      hat: ["", "..E...E...E...E."],
    },
  ),
  archetype("pp-14", "Indie Midtempo", "AABA",
    {
      kick: ["K.....K.K.K.....", "K.....K.K.K....."],
      snare: ["....S.......S...", "....S.......S..."],
      hat: ["H.H.H.H.H.H.H.H.", "H.H.H.H.H.H.H.H."],
    },
    {
      kick: ["..............K.", ""],
      snare: ["..G...G...G...G.", ""],
    },
    {
      hat: ["..E...E...E...E.", ""],
    },
  ),
  archetype("pp-15", "Ghost Town", "AAAA",
    {
      kick: ["K.......K......."],
      snare: ["....S.......S...", "..G..G.G..G..G.G"],
      hat: ["H.H.H.H.H.H.H.H."],
    },
    {
      snare: [".G.G.G.G.G.G.G.G.G.G.G.G.G.G.G.G"],
      kick: ["...K.......K...."],
    },
    {
      snare: ["..R...R...R...R."],
    },
  ),
  archetype("pp-16", "Side Stick", "AAAA",
    {
      kick: ["K.......K......."],
      snare: ["....S.......S...", "..W...W...W...W."],
      hat: ["H.H.H.H.H.H.H.H."],
    },
    {
      kick: ["K...K...K...K..."],
      snare: ["..G...G...G...G."],
    },
    {
      hat: ["..E...E...E...E."],
    },
  ),
  archetype("pp-17", "Acoustic Chorus", "AABB",
    {
      kick: ["K...K...K...K...", "K...K..KK...K..K"],
      snare: ["....S.......S...", "....s.......s..."],
      hat: ["H.H.H.H.H.H.H.H.", "H.H.H.H.H.H.H.H."],
    },
    {
      kick: ["", "K...K...K...K..."],
      snare: ["", "..G...G...G...G."],
      hat: ["", "HHHHHHHHHHHHHHHH"],
    },
    {
      hat: ["", "..O...O...O...O."],
    },
  ),
  archetype("pp-18", "Lounge", "AAAA",
    {
      kick: ["K.......K......."],
      snare: ["....S.......S..."],
      cym: ["D.......D......."],
    },
    {
      kick: ["...K.......K...."],
      snare: ["..G...G...G...G."],
    },
    {
      hat: ["H.H.H.H.H.H.H.H."],
    },
  ),
  archetype("pp-19", "Indie Rock Light", "AABA",
    {
      kick: ["K......KK......K", "K......KK......K"],
      snare: ["....S.......S...", "....S.......S..."],
      hat: ["H.H.H.H.H.H.H.H.", "H.H.H.H.H.H.H.H."],
    },
    {
      kick: ["K...............", ""],
      snare: ["..G...G...G...G.", ""],
      hat: ["HHHHHHHHHHHHHHHH", ""],
    },
    {
      hat: ["", "..E...E...E...E."],
    },
  ),
  archetype("pp-20", "Singer Songwriter 3", "AAAA",
    {
      kick: ["K.....K...K....."],
      snare: ["....S.......S..."],
      hat: ["H.H.H.H.H.H.H.H."],
    },
    {
      kick: ["K.......K......."],
      snare: ["..G...G...G...G."],
    },
    {
      hat: ["HHHHHHHHHHHH"],
    },
  ),
  archetype("pp-21", "Acoustic Groove", "AABB",
    {
      kick: ["K...K...K.......", "K...K..KK..KK..."],
      snare: ["....S.......S...", "....s.......s..."],
      hat: ["H.H.H.H.H.H.H.H.", "H.H.H.H.H.H.H.H."],
    },
    {
      kick: ["", "K...K...K...K..."],
      snare: ["", "..G...G...G...G."],
      hat: ["", "HHHHHHHHHHHHHHHH"],
    },
    {
      hat: ["", "..E...E...E...E."],
    },
  ),
  archetype("pp-22", "Bedroom Pop", "AAAA",
    {
      kick: ["K.......K......."],
      snare: ["....S.......S...", "..G...G...G...G."],
      hat: ["H.H.H.H.H.H.H.H."],
    },
    {
      kick: ["K...K...K...K..."],
      hat: ["HHHHHHHHHHHHHHHH"],
    },
    {
      hat: ["..O...O...O...O."],
    },
  ),
  archetype("pp-23", "Folk Rock Drive", "AABA",
    {
      kick: ["K...K...K...K...", "K...K...K...K..."],
      snare: ["....s.......s...", "....s.......s..."],
      hat: ["H.H.H.H.H.H.H.H.", "H.H.H.H.H.H.H.H."],
    },
    {
      kick: [".......K.......K", ""],
      snare: ["..G...G...G...G.", ""],
      hat: ["HHHHHHHHHHHHHHHH", ""],
    },
    {
      hat: ["..E...E...E...E.", ""],
    },
  ),
  archetype("pp-24", "Songwriter Ballad", "AABB",
    {
      kick: ["K...............", "K.......K......."],
      snare: ["....S.......S...", "....S.......S..."],
      hat: ["H.H.H.H.H.H.H.H.", "H.H.H.H.H.H.H.H."],
    },
    {
      kick: ["........K.......", ""],
      snare: ["..G...G...G...G.", ""],
    },
    {
      hat: ["", "..E...E...E...E."],
    },
  ),
  archetype("pp-25", "Indie Drowsy", "AAAA",
    {
      kick: ["K.......K......."],
      snare: ["....S.......S...", "..G...G...G...G."],
      cym: ["D.......D......."],
    },
    {
      kick: ["...K.......K...."],
      hat: ["H.H.H.H.H.H.H.H."],
    },
    {
      hat: ["..O...O...O...O."],
    },
  ),
  archetype("pp-26", "Acoustic Bop", "AAAA",
    {
      kick: ["...K...K..K....."],
      snare: ["....S.......S..."],
      hat: [
        ["H.H.H.H.H.H.H.H.", "......O........."],
      ],
    },
    {
      kick: ["K.............K."],
      snare: ["..G...G...G...G."],
    },
    {
      cym: ["D.D.D.D.D.D.D.D."],
    },
  ),
  archetype("pp-27", "Cafe Hop", "AAAA",
    {
      kick: ["K.......K......."],
      snare: ["....S.......S..."],
      cym: ["D.D.D.D.D.D.D.D."],
    },
    {
      snare: ["..G...G...G...G."],
      kick: ["...K.......K...."],
    },
    {
      snare: ["S.S.S.S.S.S.S.S."],
    },
  ),
  archetype("pp-28", "Indie Anthem Light", "AABB",
    {
      kick: ["K.......K.......", "K...K...K...K..."],
      snare: ["....S.......S...", "....s.......s..."],
      hat: ["H.H.H.H.H.H.H.H.", "H.H.H.H.H.H.H.H."],
    },
    {
      snare: ["", "..G...G...G...G."],
      hat: ["", "HHHHHHHHHHHHHHHH"],
    },
    {
      hat: ["", "..O...O...O...O."],
    },
  ),
  archetype("pp-29", "Singer Songwriter 4", "AABA",
    {
      kick: ["K......K.......K", "K......K.......K"],
      snare: ["....S.......S...", "....S.......S..."],
      hat: ["H.H.H.H.H.H.H.H.", "H.H.H.H.H.H.H.H."],
    },
    {
      kick: ["K.......K.......", ""],
      snare: ["..G...G...G...G.", ""],
      hat: ["......O.........", ""],
    },
    {
      hat: ["HHHHHHHHHHHH", "..E...E...E...E."],
    },
  ),
  archetype("pp-30", "Acoustic Strut", "AAAA",
    {
      kick: ["K...K.....K....."],
      snare: ["....S.......S...", "..G...G...G...G."],
      hat: ["H.H.H.H.H.H.H.H."],
    },
    {
      kick: ["K.......K....K.."],
      hat: ["HHHHHHHHHHHHHHHH"],
    },
    {
      hat: ["..E...E...E...E."],
    },
  ),
  archetype("pp-31", "Fingerstyle Ditty", "AABB",
    {
      kick: ["K.......K.......", "K...K...K...K.K."],
      snare: ["....S.......S...", "....s.......s..."],
      hat: ["H.H.H.H.H.H.H.H.", "H.H.H.H.H.H.H.H."],
    },
    {
      snare: ["", ".G.G.G.G.G.G.G.G.G.G.G.G.G.G.G.G"],
    },
    {
      hat: ["", "..E...E...E...E."],
    },
  ),
  archetype("pp-32", "Lounge Acoustic", "AAAA",
    {
      kick: ["K.......K......."],
      snare: ["....S.......S...", "..G...G...G...G."],
      cym: ["D.......D......."],
    },
    {
      kick: ["...K.......K...."],
    },
    {
      snare: ["S.S.S.S.S.S.S.S."],
      hat: ["H.H.H.H.H.H.H.H."],
    },
  ),
  archetype("pp-33", "Indie Midtempo 2", "AABA",
    {
      kick: ["K.....K.K......K", "K.....K.K......K"],
      snare: ["....S.......S...", "....S.......S..."],
      hat: ["H.H.H.H.H.H.H.H.", "H.H.H.H.H.H.H.H."],
    },
    {
      kick: ["..K............."],
      snare: ["..G...G...G...G.", ""],
    },
    {
      hat: ["..E...E...E...E.", ""],
    },
  ),
  archetype("pp-34", "Songwriter Build", "AABB",
    {
      kick: ["K...............", "K...K..KK...K..K"],
      snare: ["....S.......S...", "....s.......s..."],
      hat: [
        ["H.H.H.H.H.H.H.H."],
        ["H.H.H.H.H.H.H.H.", "......O.......O."],
      ],
    },
    {
      kick: ["........K.......", ""],
      snare: ["", "..G...G...G...G."],
      hat: ["", "HHHHHHHHHHHHHHHH"],
    },
    {
      hat: ["", "..E...E...E...E."],
    },
  ),
  archetype("pp-35", "Acoustic Finale", "AABA",
    {
      kick: ["K...K...K...K...", "K...K...K...K..."],
      snare: ["....S.......S...", "..G...G...G...G."],
      hat: ["H.H.H.H.H.H.H.H.", "H.H.H.H.H.H.H.H."],
    },
    {
      kick: [".......K.......K", ""],
      snare: ["", "....P.......P..."],
      hat: ["HHHHHHHHHHHHHHHH", ""],
    },
    {
      hat: ["..E...E...E...E.", ""],
    },
  ),
];
