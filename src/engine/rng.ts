/**
 * Deterministic PRNG utilities.
 *
 * All engine randomness flows through here so that a given
 * (regionSeed, salt) pair always produces the identical sequence — this is
 * what makes "moving a macro interpolates into the existing groove" possible
 * (per-note thresholds are drawn once, in a fixed order, and never reshuffled).
 */

/** xmur3 string hash (see https://gist.github.com/josephblack/96113004). */
export function xmur3(str: string): () => number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
}

/** Stable 32-bit hash of an arbitrary string. */
export function hashString(s: string): number {
  return xmur3(s)();
}

/** Combine a numeric region seed with a purpose salt. */
export function hashSeed(seed: number, salt: string): number {
  return xmur3(`${seed >>> 0}:${salt}`)();
}

/** mulberry32 — fast, deterministic, good-enough quality for music offsets. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Standard-normal sample (Box–Muller) from a deterministic uniform source.
 * Returns 0 for the degenerate u=0 case (measure zero, keeps things finite).
 */
export function gaussian(rng: () => number): number {
  let u = rng();
  if (u === 0) u = 1e-12;
  const v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}
