/**
 * The Tight Driver — Rock / Modern Pop (PRD §5 persona matrix).
 * "Locked-to-grid acoustic feel, solid backbeat, energetic tom/snare turnarounds."
 * Target VST: Superior Drummer 3 / EZdrummer.
 *
 * 35 authored archetypes. Row alphabet (see articulations.ts):
 *   K kick  k kick(hard)  S snare  s snare(hard)  G ghost  R rim  W side
 *   P clap  H hat(closed) O hat(open)  E hat(edge, half-open)
 *   B tom(low) M tom(mid) T tom(high)  C crash  D ride
 *
 * Rows: 16 chars = 16th-note grid. Bars per archetype: A..D, sequence = 4-bar phrase.
 * Layers: base (core groove), add (Complexity 0→50 unmask), sub (Complexity 50→100 cross-fade).
 */

import { archetype } from "../patterns";
import type { ArchetypeDef } from "../patterns";

export const TIGHT_DRIVER: ArchetypeDef[] = [
  archetype("td-01", "Locked 8ths", "AABA",
    {
      kick: ["K.......K.......", "K...K...K...K.KK"],
      snare: ["....s.......s...", "....s.......s..."],
      hat: ["H.H.H.H.H.H.H.H.", "H.H.H.H.H.H.H.H."],
    },
    {
      snare: ["..G...G...G...G.", "..G...G...G...G."],
      hat: ["", "HHHHHHHHHHHHHHHH"],
    },
    {
      hat: ["", "..E...E...E...E."],
    },
  ),
  archetype("td-02", "Drive Eighths", "AAAA",
    {
      kick: ["K.K.K.K.K.K.K.K."],
      snare: ["....s.......s..."],
      hat: ["H.H.H.H.H.H.H.H."],
    },
    {
      snare: ["..G...G...G...G."],
      hat: ["HHHHHHHHHHHHHHHH"],
    },
    {
      hat: ["..E...E...E...E."],
      cym: ["D.D.D.D.D.D.D.D."],
    },
  ),
  archetype("td-03", "Offbeat Push", "AABA",
    {
      kick: ["....K..K....K..K"],
      snare: ["....s.......s..."],
      hat: ["H.H.H.H.H.H.H.H.", "H.H.H.H.H.H.H.H."],
    },
    {
      kick: ["K...............", ""],
      snare: ["..G...G...G...G.", ""],
      hat: ["", "HHHHHHHHHHHHHHHH"],
    },
    {
      hat: ["", "..E...E...E...E."],
    },
  ),
  archetype("td-04", "Rock Pump", "AAAA",
    {
      kick: ["K...K..KK...K..K"],
      snare: ["....s.......s..."],
      hat: ["H.H.H.H.H.H.H.H."],
    },
    {
      snare: ["..G...G...G...G."],
      hat: ["HHHHHHHHHHHHHHHH"],
    },
    {
      cym: ["D.D.D.D.D.D.D.D."],
    },
  ),
  archetype("td-05", "Straight 16ths", "ABAB",
    {
      kick: ["K.......K.......", "K...K...K...K..."],
      snare: ["....S.......S...", "....s.......s..."],
      hat: ["HHHHHHHHHHHHHHHH", "H.H.H.H.H.H.H.H."],
    },
    {
      kick: ["....K..K....K..K", "....K..K....K..K"],
      snare: ["", "..G...G...G...G."],
    },
    {
      hat: ["..E...E...E...E.", "..O...O...O...O."],
    },
  ),
  archetype("td-06", "Half Time", "AABB",
    {
      kick: ["K...............", "K..............."],
      snare: ["........s.......", "........s......."],
      hat: ["H.H.H.H.H.H.H.H.", "H.H.H.H.H.H.H.H."],
    },
    {
      kick: ["", "K.......K......."],
      snare: ["", "..G...G...G...G."],
    },
    {
      cym: ["", "D.......D......."],
    },
  ),
  archetype("td-07", "Metal Doubles", "AABB",
    {
      kick: ["K.K.K.K.K.K.K.K."],
      snare: ["....s.......s..."],
      hat: ["HHHHHHHHHHHHHHHH", "HHHHHHHHHHHHHHHH"],
    },
    {
      kick: ["", "K.K.K.K.K.K.K.K.K.K.K.K.K.KKKKKK"],
      snare: ["..G...G...G...G.", "..G...G...G...G."],
    },
    {
      hat: ["..E...E...E...E.", "..E...E...E...E."],
    },
  ),
  archetype("td-08", "Pop Punk", "AAAA",
    {
      kick: ["K..K.K..K..K.K.."],
      snare: ["....s.......s..."],
      hat: ["H.H.H.H.H.H.H.H."],
    },
    {
      hat: ["HHHHHHHHHHHHHHHH"],
      snare: ["..G...G...G...G."],
    },
    {
      hat: ["..E...E...E...E."],
    },
  ),
  archetype("td-09", "Anthem", "AABB",
    {
      kick: ["K.......K......."],
      snare: ["....s.......s..."],
      hat: ["HHHHHHHHHHHHHHHH", "HHHHHHHHHHHHHHHH"],
      cym: ["", "D.......D......."],
    },
    {
      snare: ["..G...G...G...G.", ""],
      tom: ["", "............MMMM"],
    },
    {
      hat: ["..E...E...E...E.", "..O...O...O...O."],
    },
  ),
  archetype("td-10", "Punk Stomp", "AAAA",
    {
      kick: ["K...K...K...K..."],
      snare: ["....s.......s..."],
      hat: ["H.H.H.H.H.H.H.H."],
    },
    {
      kick: ["K.K.K.K.K.K.K.K."],
      hat: ["HHHHHHHHHHHHHHHH"],
    },
    {
      hat: ["..O...O...O...O."],
    },
  ),
  archetype("td-11", "Power Ballad", "AABA",
    {
      kick: ["K..............."],
      snare: ["....S.......S..."],
      hat: ["H.H.H.H.H.H.H.H.", "H.H.H.H.H.H.H.H."],
    },
    {
      kick: ["", "K...K...K...K..."],
      snare: ["..G...G...G...G.", ""],
    },
    {
      hat: ["", "..E...E...E...E."],
    },
  ),
  archetype("td-12", "Rockabilly", "AAAA",
    {
      kick: ["K.......K......."],
      snare: ["s.s.s.s.s.s.s.s."],
      cym: ["D.D.D.D.D.D.D.D."],
    },
    {
      snare: ["...G..G..G..G..G"],
    },
    {
      snare: ["S.S.S.S.S.S.S.S."],
    },
  ),
  archetype("td-13", "Indie Shimmer", "AABB",
    {
      kick: ["K...K..KK...K..K"],
      snare: ["..G...G...G...G.", ""],
      hat: ["HHHHHHHHHHHHHHHH", "HHHHHHHHHHHHHHHH"],
    },
    {
      snare: ["", "..G...G...G...G."],
      kick: ["", "K.......K......."],
    },
    {
      hat: ["..E...E...E...E.", "..O...O...O...O."],
    },
  ),
  archetype("td-14", "Power Pop", "AAAA",
    {
      kick: ["K...K...K...K.K."],
      snare: ["....s.......s..."],
      hat: ["H.H.H.H.H.H.H.H."],
    },
    {
      hat: ["HHHHHHHHHHHHHHHH"],
      snare: ["..G...G...G...G."],
    },
    {
      hat: ["..E...E...E...E."],
    },
  ),
  archetype("td-15", "Synthwave Pulse", "AAAA",
    {
      kick: ["K...K...K...K..."],
      snare: ["....s.......s..."],
      hat: ["HHHHHHHHHHHHHHHH"],
    },
    {
      kick: ["K.K.K.K.K.K.K.K."],
      snare: ["..G...G...G...G."],
    },
    {
      hat: ["..O...O...O...O."],
      cym: ["D.......D......."],
    },
  ),
  archetype("td-16", "Garage Riff", "AABA",
    {
      kick: ["K...K..KK...K..K"],
      snare: ["....s.......s..."],
      hat: ["H.H.H.H.H.H.H.H.", "H.H.H.H.H.H.H.H."],
    },
    {
      hat: ["HHHHHHHHHHHHHHHH", ""],
      snare: ["..G...G...G...G.", ""],
    },
    {
      hat: ["", "..E...E...E...E."],
    },
  ),
  archetype("td-17", "Stomp & Clap", "AABB",
    {
      kick: ["K.......K......."],
      snare: [
        ["....s.......s...", "....P.......P..."],
        ["....s.......s...", "....P.......P..."],
      ],
      hat: ["H.H.H.H.H.H.H.H.", "H.H.H.H.H.H.H.H."],
    },
    {
      snare: ["..G...G...G...G.", ""],
    },
    {
      hat: ["", "..O...O...O...O."],
    },
  ),
  archetype("td-18", "Post Punk", "AAAA",
    {
      kick: ["K.K.K.K.K.K.K.K."],
      snare: ["....s.......s..."],
      hat: ["HHHHHHHHHHHHHHHH"],
    },
    {
      snare: ["..G...G...G...G."],
    },
    {
      hat: ["..E...E...E...E."],
    },
  ),
  archetype("td-19", "80s Rock", "AABB",
    {
      kick: ["K..K.K..K..K.K.."],
      snare: ["....s.......s..."],
      hat: ["HHHHHHHHHHHHHHHH", "HHHHHHHHHHHHHHHH"],
    },
    {
      snare: ["..G...G...G...G.", ""],
      hat: ["..O...O...O...O.", ""],
    },
    {
      hat: ["", "..E...E...E...E."],
    },
  ),
  archetype("td-20", "Honky Tonk", "AABA",
    {
      kick: ["K.......K......."],
      snare: ["....s.......s..."],
      hat: ["H.H.H.H.H.H.H.H.", "H.H.H.H.H.H.H.H."],
    },
    {
      snare: ["s.s.s.s.s.s.s.s.", ""],
      kick: ["K...K...K...K...", ""],
    },
    {
      hat: ["..O...O...O...O.", ""],
    },
  ),
  archetype("td-21", "Pop Ballad Pulse", "AAAA",
    {
      kick: ["K..............."],
      snare: ["....S.......S..."],
      hat: ["H.H.H.H.H.H.H.H."],
    },
    {
      kick: ["K.......K......."],
      snare: ["..G...G...G...G."],
    },
    {
      cym: ["D.......D......."],
    },
  ),
  archetype("td-22", "Alt Drive", "AABA",
    {
      kick: ["K.......K.......", "K.K.K.K.K.K.K.K."],
      snare: ["....s.......s...", "....s.......s..."],
      hat: ["H.H.H.H.H.H.H.H.", "H.H.H.H.H.H.H.H."],
    },
    {
      hat: ["HHHHHHHHHHHHHHHH", ""],
      snare: ["..G...G...G...G.", ""],
    },
    {
      hat: ["..E...E...E...E.", ""],
    },
  ),
  archetype("td-23", "Funk Rock", "AABA",
    {
      kick: ["K...K..KK..KK..K"],
      snare: ["G...G..GG..GG..G"],
      hat: ["HHHHHHHHHHHHHHHH", "HHHHHHHHHHHHHHHH"],
    },
    {
      kick: ["K.K.K.K.K.K.K.K.", ""],
      snare: ["..G...G...G...G.", ""],
    },
    {
      hat: ["..E...E...E...E.", ""],
    },
  ),
  archetype("td-24", "Hard Rock", "AABB",
    {
      kick: ["K.K.K.K.K.K.K.K."],
      snare: ["....s.......s..."],
      hat: ["HHHHHHHHHHHHHHHH", "HHHHHHHHHHHHHHHH"],
    },
    {
      kick: ["", "K.K.K.K.K.K.K.K.K.K.K.K.K.KKKKKK"],
      snare: ["..G...G...G...G.", ""],
    },
    {
      hat: ["", "..O...O...O...O."],
    },
  ),
  archetype("td-25", "Punk Core", "AAAA",
    {
      kick: ["K.K.K.K.K.K.K.K."],
      snare: ["....s.......s..."],
      hat: ["H.H.H.H.H.H.H.H."],
    },
    {
      hat: ["HHHHHHHHHHHHHHHH"],
      snare: ["..G...G...G...G."],
    },
    {
      hat: ["..E...E...E...E."],
    },
  ),
  archetype("td-26", "Indie Chorus", "AABA",
    {
      kick: ["K...K..KK...K..K"],
      snare: ["....s.......s..."],
      hat: ["H.H.H.H.H.H.H.H.", "H.H.H.H.H.H.H.H."],
    },
    {
      snare: ["..G...G...G...G.", ""],
      hat: ["", "HHHHHHHHHHHHHHHH"],
    },
    {
      hat: ["..E...E...E...E.", "..O...O...O...O."],
    },
  ),
  archetype("td-27", "Power Pop 2", "AAAA",
    {
      kick: ["K...K...K...K..."],
      snare: [
        ["....s.......s...", "....P.......P..."],
      ],
      hat: ["HHHHHHHHHHHHHHHH"],
    },
    {
      kick: ["K..K.K..K..K.K.."],
    },
    {
      hat: ["..E...E...E...E."],
    },
  ),
  archetype("td-28", "Metal Chug", "AABB",
    {
      kick: ["K.K.K.K.K.K.K.K."],
      snare: ["....s.......s..."],
      hat: ["HHHHHHHHHHHHHHHH", "HHHHHHHHHHHHHHHH"],
    },
    {
      snare: ["..G...G...G...G.", ""],
      hat: ["", "H.H.H.H.H.H.H.H.H.H.H.H.H.H.H.H."],
    },
    {
      hat: ["..E...E...E...E.", ""],
    },
  ),
  archetype("td-29", "Dance Rock", "AAAA",
    {
      kick: ["K..K.K..K..K.K.."],
      snare: ["....s.......s..."],
      hat: [
        ["H.H.H.H.H.H.H.H.", "..O...O...O...O."],
      ],
    },
    {
      hat: ["HHHHHHHHHHHHHHHH"],
      snare: ["..G...G...G...G."],
    },
    {
      hat: ["..E...E...E...E."],
    },
  ),
  archetype("td-30", "Surf Beat", "AABB",
    {
      kick: ["K.......K......."],
      snare: ["....s.......s..."],
      hat: ["H.H.H.H.H.H.H.H.", "H.O.H.O.H.O.H.O."],
    },
    {
      kick: ["K...K...K...K...", ""],
      hat: ["..O...O...O...O.", ""],
    },
    {
      hat: ["..E...E...E...E.", ""],
    },
  ),
  archetype("td-31", "Folk Rock", "AABA",
    {
      kick: ["K..............."],
      snare: ["....S.......S..."],
      hat: ["H.H.H.H.H.H.H.H.", "H.H.H.H.H.H.H.H."],
    },
    {
      kick: ["K.......K.......", ""],
      snare: ["..G...G...G...G.", ""],
    },
    {
      hat: ["", "..E...E...E...E."],
    },
  ),
  archetype("td-32", "Arena Anthem", "AABB",
    {
      kick: ["K.K.K.K.K.K.K.K."],
      snare: [
        ["....s.......s...", "....P.......P..."],
        ["....s.......s...", "....P.......P..."],
      ],
      hat: ["HHHHHHHHHHHHHHHH", "HHHHHHHHHHHHHHHH"],
    },
    {
      snare: ["..G...G...G...G.", ""],
      tom: ["", "............MMMM"],
    },
    {
      hat: ["..O...O...O...O.", ""],
    },
  ),
  archetype("td-33", "Garage Rock 2", "AAAA",
    {
      kick: ["K...K..KK...K..K"],
      snare: ["....s.......s..."],
      hat: ["H.H.H.H.H.H.H.H."],
    },
    {
      hat: ["HHHHHHHHHHHHHHHH"],
      snare: ["..G...G...G...G."],
    },
    {
      hat: ["..O...O...O...O."],
    },
  ),
  archetype("td-34", "Nu Rock Sparse", "AABA",
    {
      kick: ["K...............", "K...K...K...K..."],
      snare: ["....S.......S...", "....s.......s..."],
      hat: ["H.H.H.H.H.H.H.H.", "H.H.H.H.H.H.H.H."],
    },
    {
      kick: ["", "K.......K......."],
      snare: ["", "..G...G...G...G."],
      hat: ["", "HHHHHHHHHHHHHHHH"],
    },
    {
      hat: ["", "..E...E...E...E."],
    },
  ),
  archetype("td-35", "Stadium Anthem", "AABA",
    {
      kick: ["K.......K......."],
      snare: [
        ["....s.......s...", "....P.......P..."],
        ["....s.......s...", "....P.......P..."],
      ],
      hat: ["HHHHHHHHHHHHHHHH", "HHHHHHHHHHHHHHHH"],
    },
    {
      snare: ["..G...G...G...G.", ""],
      tom: ["", "............MMMM"],
    },
    {
      hat: ["..E...E...E...E.", ""],
    },
  ),
];
