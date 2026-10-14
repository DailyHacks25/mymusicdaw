/**
 * The Groovebox — Electronic / House / Four-on-the-Floor (PRD §5 persona
 * matrix). "Relentless kick anchors, off-beat open hats, syncopated
 * substitutions, tight humanization baseline." Target VST: SSD5 / stock synth drums.
 *
 * 35 authored archetypes. The sub layer is where "syncopated substitutions"
 * live: off-beat kicks, 32nd-note 808 displacements, tom stabs.
 */

import { archetype } from "../patterns";
import type { ArchetypeDef } from "../patterns";

export const GROOVEBOX: ArchetypeDef[] = [
  archetype("gb-01", "House Classic", "AAAA",
    {
      kick: ["K...K...K...K..."],
      snare: ["....P.......P..."],
      hat: ["H.O.H.O.H.O.H.O."],
    },
    {
      hat: ["HHHHHHHHHHHHHHHH"],
    },
    {
      kick: ["..K...K...K...K."],
    },
  ),
  archetype("gb-02", "Deep House", "AABB",
    {
      kick: ["K...K...K...K...", "K...K...K...K..."],
      snare: ["....P.......P...", ""],
      hat: ["H.O.H.O.H.O.H.O.", "H.O.H.O.H.O.H.O."],
    },
    {
      snare: ["", "....P.......P..."],
      kick: ["...K.......K....", ""],
    },
    {
      kick: ["..K...K...K...K.", ""],
    },
  ),
  archetype("gb-03", "Tech House", "AAAA",
    {
      kick: ["K...K...K...K..."],
      snare: ["....P.......P..."],
      hat: ["HHHHHHHHHHHHHHHH"],
    },
    {
      hat: ["..O...O...O...O."],
    },
    {
      kick: ["..K...K...K...K."],
    },
  ),
  archetype("gb-04", "Disco", "AAAA",
    {
      kick: ["K...K...K...K..."],
      snare: ["....s.......s..."],
      hat: ["HHHHHHHHHHHHHHHH"],
      cym: ["D.D.D.D.D.D.D.D."],
    },
    {
      snare: ["..G...G...G...G."],
      hat: ["..O...O...O...O."],
    },
    {
      kick: ["..K...K...K...K."],
    },
  ),
  archetype("gb-05", "Four-on-Floor", "AAAA",
    {
      kick: ["K...K...K...K..."],
      snare: ["....P.......P..."],
      hat: ["H.H.H.H.H.H.H.H."],
    },
    {
      hat: ["..O...O...O...O.", "HHHHHHHHHHHHHHHH"],
    },
    {
      kick: ["..K...K...K...K."],
    },
  ),
  archetype("gb-06", "Acid House", "AABB",
    {
      kick: ["K...K...K...K...", "K...K...K...K..."],
      snare: ["....P.......P...", "....P.......P..."],
      hat: ["HHHHHHHHHHHHHHHH", "H.O.H.O.H.O.H.O."],
    },
    {
      hat: ["..O...O...O...O.", ""],
    },
    {
      kick: ["", "....K.......K.......K.......K..."],
    },
  ),
  archetype("gb-07", "Minimal", "AAAA",
    {
      kick: ["K...K...K...K..."],
      hat: ["H...H...H...H..."],
    },
    {
      hat: ["H.H.H.H.H.H.H.H.", "..O...O...O...O."],
    },
    {
      kick: ["..K...K...K...K."],
    },
  ),
  archetype("gb-08", "Future House", "AABA",
    {
      kick: ["K...K...K...K...", "K...K...K...K..."],
      snare: ["....P.......P...", "....P.......P..."],
      hat: ["HHHHHHHHHHHHHHHH", "HHHHHHHHHHHHHHHH"],
    },
    {
      hat: ["H.H.H.H.H.H.H.H.H.H.H.H.H.H.HHHH", ""],
    },
    {
      kick: ["..K...K...K...K.", ""],
    },
  ),
  archetype("gb-09", "Tech Minimal", "AAAA",
    {
      kick: ["K...K...K...K..."],
      hat: ["..O...O...O...O."],
    },
    {
      hat: ["HHHHHHHHHHHHHHHH"],
    },
    {
      kick: ["..K...K...K...K."],
      hat: ["H.H.H.H.H.H.H.H."],
    },
  ),
  archetype("gb-10", "Disco Funk", "AABB",
    {
      kick: ["K...K...K...K...", "K...K..KK...K..K"],
      snare: ["....s.......s...", "....s.......s..."],
      hat: ["HHHHHHHHHHHHHHHH", "HHHHHHHHHHHHHHHH"],
      cym: ["D.D.D.D.D.D.D.D.", ""],
    },
    {
      snare: ["..G...G...G...G.", ""],
      hat: ["", "..O...O...O...O."],
    },
    {
      kick: ["..K...K...K...K.", ""],
    },
  ),
  archetype("gb-11", "House Bounce", "AAAA",
    {
      kick: ["K...K...K..K.K.."],
      snare: ["....P.......P..."],
      hat: ["H.H.H.H.H.H.H.H."],
    },
    {
      hat: ["..O...O...O...O.", "HHHHHHHHHHHHHHHH"],
    },
    {
      kick: ["..K...K...K...K."],
    },
  ),
  archetype("gb-12", "Deep Soul", "AABA",
    {
      kick: ["K...K...K...K...", "K...K...K...K..."],
      snare: ["....P.......P...", "....P.......P..."],
      hat: ["H.O.H.O.H.O.H.O.", "H.O.H.O.H.O.H.O."],
    },
    {
      kick: [".......K........", ""],
      snare: ["..G...G...G...G.", ""],
    },
    {
      kick: ["..K...K...K...K.", ""],
    },
  ),
  archetype("gb-13", "Detroit", "AAAA",
    {
      kick: ["K...K...K...K..."],
      snare: ["....P.......P..."],
      hat: ["HHHHHHHHHHHHHHHH"],
    },
    {
      hat: ["..O...O...O...O.", "H.H.H.H.H.H.H.H.H.H.H.H.H.H.HHHH"],
    },
    {
      kick: ["..K...K...K...K."],
      tom: ["............MM.."],
    },
  ),
  archetype("gb-14", "Tech House 2", "AABB",
    {
      kick: ["K...K...K...K...", "K...K...K...K..."],
      snare: ["....P.......P...", "....P.......P..."],
      hat: ["HHHHHHHHHHHHHHHH", "H.H.H.H.H.H.H.H.H.H.H.H.H.H.HHHH"],
    },
    {
      hat: ["..O...O...O...O.", ""],
    },
    {
      kick: ["..K...K...K...K.", ""],
    },
  ),
  archetype("gb-15", "Garage House", "AAAA",
    {
      kick: ["K...K...K...K..."],
      snare: ["....P.......P..."],
      hat: [
        ["H.H.H.H.H.H.H.H.", "..O...O...O...O."],
      ],
    },
    {
      hat: ["H.H.H.H.H.H.H.H.H.H.H.H.H.H.HHHH"],
    },
    {
      kick: ["..K...K...K...K."],
    },
  ),
  archetype("gb-16", "Soulful House", "AABA",
    {
      kick: ["K...K...K...K...", "K...K...K...K..."],
      snare: ["....P.......P...", "....P.......P..."],
      hat: ["H.O.H.O.H.O.H.O.", "H.O.H.O.H.O.H.O."],
    },
    {
      snare: ["..G...G...G...G.", ""],
    },
    {
      kick: ["..K...K...K...K.", ""],
      tom: ["..M.......M.....", ""],
    },
  ),
  archetype("gb-17", "Acid Bounce", "AABB",
    {
      kick: ["K...K...K...K...", "K...K...K..K.K.K"],
      snare: ["....P.......P...", "....P.......P..."],
      hat: ["HHHHHHHHHHHHHHHH", "HHHHHHHHHHHHHHHH"],
    },
    {
      hat: ["..O...O...O...O.", "H.H.H.H.H.H.H.HHHHH.H.H.H.H.HHHH"],
    },
    {
      kick: ["..K...K...K...K.", ""],
    },
  ),
  archetype("gb-18", "Minimal Techno", "AAAA",
    {
      kick: ["K...K...K...K..."],
      hat: ["H...H...H...H..."],
    },
    {
      hat: ["HHHHHHHHHHHHHHHH"],
      snare: ["....P.......P..."],
    },
    {
      kick: ["..K...K...K...K."],
    },
  ),
  archetype("gb-19", "House Piano", "AAAA",
    {
      kick: ["K...K...K...K..."],
      snare: ["....P.......P..."],
      hat: ["H.O.H.O.H.O.H.O."],
    },
    {
      kick: ["...K.......K...."],
      snare: ["..G...G...G...G."],
    },
    {
      hat: ["HHHHHHHHHHHHHHHH"],
      kick: ["..K...K...K...K."],
    },
  ),
  archetype("gb-20", "Tech Disco", "AABB",
    {
      kick: ["K...K...K...K...", "K...K...K...K..."],
      snare: ["....s.......s...", "....s.......s..."],
      hat: ["HHHHHHHHHHHHHHHH", "H.H.H.H.H.H.H.H.H.H.H.H.H.H.HHHH"],
      cym: ["D.D.D.D.D.D.D.D.", ""],
    },
    {
      hat: ["..O...O...O...O.", ""],
    },
    {
      kick: ["..K...K...K...K.", ""],
    },
  ),
  archetype("gb-21", "Future Bounce", "AAAA",
    {
      kick: ["K...K...K...K..."],
      snare: ["....P.......P..."],
      hat: ["HHHHHHHHHHHHHHHH"],
    },
    {
      kick: ["K.K.K.K.K.K.K.K."],
    },
    {
      kick: ["..K...K...K...K."],
    },
  ),
  archetype("gb-22", "Deep Tech", "AABB",
    {
      kick: ["K...K...K...K...", "K...K...K...K..."],
      snare: ["", "....P.......P..."],
      hat: ["..O...O...O...O.", "HHHHHHHHHHHHHHHH"],
    },
    {
      snare: ["....P.......P...", ""],
      hat: ["H.H.H.H.H.H.H.H.", ""],
    },
    {
      kick: ["..K...K...K...K.", ""],
    },
  ),
  archetype("gb-23", "Groove House", "AAAA",
    {
      kick: ["K...K...K...K..."],
      snare: ["....P.......P..."],
      hat: ["H.O.H.O.H.O.H.O."],
    },
    {
      snare: ["..G...G...G...G."],
    },
    {
      kick: ["..K...K...K...K."],
      tom: ["..M.......M....."],
    },
  ),
  archetype("gb-24", "House Break", "AABB",
    {
      kick: ["K...K...K...K...", "K.....K...K....."],
      snare: ["....P.......P...", "....s.......s..."],
      hat: ["H.H.H.H.H.H.H.H.", "HHHHHHHHHHHHHHHH"],
    },
    {
      tom: ["", "..T.......T....."],
      hat: ["", "..O...O...O...O."],
    },
    {
      kick: ["..K...K...K...K.", ""],
    },
  ),
  archetype("gb-25", "Soul House", "AABA",
    {
      kick: ["K...K...K...K...", "K...K...K...K..."],
      snare: ["....P.......P...", "....P.......P..."],
      hat: ["H.O.H.O.H.O.H.O.", "H.O.H.O.H.O.H.O."],
    },
    {
      kick: [".......K.......K", ""],
      snare: ["..G...G...G...G.", ""],
    },
    {
      kick: ["..K...K...K...K.", ""],
    },
  ),
  archetype("gb-26", "Acid Line", "AABB",
    {
      kick: ["K...K...K...K...", "K...K...K...K..."],
      snare: ["....P.......P...", "....P.......P..."],
      hat: ["HHHHHHHHHHHHHHHH", "H.H.H.H.H.H.H.HHHHH.H.H.H.H.HHHH"],
    },
    {
      hat: ["..O...O...O...O.", ""],
    },
    {
      kick: ["", "....K.......K.......K.......K..."],
    },
  ),
  archetype("gb-27", "Minimal Bounce", "AAAA",
    {
      kick: ["K...K...K...K..."],
      hat: ["H.H.H.H.H.H.H.H."],
    },
    {
      hat: ["..O...O...O...O."],
      snare: ["....P.......P..."],
    },
    {
      kick: ["..K...K...K...K."],
      tom: ["..B.......B....."],
    },
  ),
  archetype("gb-28", "Detroit Soul", "AABB",
    {
      kick: ["K...K...K...K...", "K...K...K...K.K."],
      snare: ["....P.......P...", "....P.......P..."],
      hat: ["H.O.H.O.H.O.H.O.", "HHHHHHHHHHHHHHHH"],
    },
    {
      snare: ["..G...G...G...G.", ""],
      hat: ["", "..O...O...O...O."],
    },
    {
      kick: ["..K...K...K...K.", ""],
    },
  ),
  archetype("gb-29", "Tech Bounce", "AAAA",
    {
      kick: ["K...K..KK...K..K"],
      snare: ["....P.......P..."],
      hat: ["HHHHHHHHHHHHHHHH"],
    },
    {
      hat: ["..O...O...O...O.", "H.H.H.H.H.H.H.H.H.H.H.H.H.H.HHHH"],
    },
    {
      kick: ["..K...K...K...K."],
    },
  ),
  archetype("gb-30", "House Classic 2", "AABB",
    {
      kick: ["K...K...K...K...", "K...K...K...K..."],
      snare: ["....P.......P...", "....P.......P..."],
      hat: ["H.O.H.O.H.O.H.O.", "HHHHHHHHHHHHHHHH"],
    },
    {
      snare: ["..G...G...G...G.", ""],
    },
    {
      kick: ["..K...K...K...K.", ""],
      tom: ["", "............MM.."],
    },
  ),
  archetype("gb-31", "Disco 70s", "AAAA",
    {
      kick: ["K...K...K...K..."],
      snare: ["....s.......s..."],
      hat: ["HHHHHHHHHHHHHHHH"],
      cym: ["D.D.D.D.D.D.D.D."],
    },
    {
      hat: ["..O...O...O...O."],
      snare: ["..G...G...G...G."],
    },
    {
      kick: ["..K...K...K...K."],
      hat: ["H.H.H.H.H.H.H.H.H.H.H.H.H.H.HHHH"],
    },
  ),
  archetype("gb-32", "Deep House 2", "AAAA",
    {
      kick: ["K...K...K...K..."],
      snare: ["....P.......P..."],
      hat: ["H.O.H.O.H.O.H.O."],
    },
    {
      kick: ["...K.......K...."],
      snare: ["..G...G...G...G."],
    },
    {
      kick: ["..K...K...K...K."],
      tom: ["..M.......M....."],
    },
  ),
  archetype("gb-33", "Future Rave", "AABB",
    {
      kick: ["K...K...K...K...", "K...K...K...K..."],
      snare: ["....P.......P...", "....P.......P..."],
      hat: ["HHHHHHHHHHHHHHHH", "HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH"],
    },
    {
      hat: ["..O...O...O...O.", ""],
    },
    {
      kick: ["..K...K...K...K.", ""],
    },
  ),
  archetype("gb-34", "Garage Bounce", "AAAA",
    {
      kick: ["K...K...K...K..."],
      snare: ["....P.......P..."],
      hat: [
        ["H.H.H.H.H.H.H.H.", "..O...O...O...O."],
      ],
    },
    {
      hat: ["H.H.H.H.H.H.H.H.H.H.H.H.H.H.HHHH"],
      kick: ["..K...K...K...K."],
    },
    {
      hat: ["..E...E...E...E."],
    },
  ),
  archetype("gb-35", "Anthem House", "AABA",
    {
      kick: ["K...K...K...K...", "K...K...K...K..."],
      snare: ["....P.......P...", "....P.......P..."],
      hat: ["HHHHHHHHHHHHHHHH", "HHHHHHHHHHHHHHHH"],
    },
    {
      hat: ["..O...O...O...O.", "H.H.H.H.H.H.H.H.H.H.H.H.H.H.HHHH"],
    },
    {
      kick: ["..K...K...K...K.", ""],
      tom: ["", "............MM.."],
    },
  ),
];
