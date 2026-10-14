/**
 * Minimal external store (useSyncExternalStore) + all project actions.
 */

import { useSyncExternalStore } from "react";
import type { DrummerRegion, SectionKind, SourceTrackId } from "../../engine/types";
import { EMPTY_MUTES, clamp } from "../../engine/types";
import { BUILTIN_PROFILES, GENERAL_MIDI, cloneProfile, validateProfile } from "../../engine/profiles";
import type { MappingProfile } from "../../engine/profiles";
import { PERSONAS, SEED_LIBRARY } from "../../engine/seedLibrary";
import type { PersonaId } from "../../engine/types";
import { resolveArchetype, generateRegion, hitsToMidi, regionToMidi, regionBarCount } from "../../engine/engine";
import { TICKS_PER_BAR, writeStandardMidiFile } from "../../engine/midi";
import { buildProjectEvents, player } from "../audio/player";

export interface UIState {
  bpm: number;
  regions: DrummerRegion[];
  selectedRegionId: string;
  profileId: string;
  userProfiles: MappingProfile[];
  playing: boolean;
}

let regionCounter = 0;
export function makeRegion(
  section: SectionKind,
  bars: number,
  persona: PersonaId
): DrummerRegion {
  regionCounter++;
  const id = `r${regionCounter}-${Math.floor(Math.random() * 1e6).toString(36)}`;
  return {
    id,
    name: section,
    section,
    bars,
    persona,
    archetypeId: null,
    seed: 1 + Math.floor(Math.random() * 99999),
    macros: { ...PERSONAS[persona].defaults },
    followSource: null,
    mutes: { ...EMPTY_MUTES },
    editable: null,
  };
}

export function defaultProject(): UIState {
  return {
    bpm: 118,
    regions: [makeRegion("Verse", 8, "tightDriver"), makeRegion("Chorus", 8, "tightDriver"), makeRegion("Bridge", 4, "pocketPlayer")],
    selectedRegionId: "",
    profileId: "gm",
    userProfiles: [],
    playing: false,
  };
}

type Listener = () => void;
function createStore<T>(initial: T) {
  let state: T = initial;
  const listeners = new Set<Listener>();
  return {
    get: () => state,
    set(patch: Partial<T> | ((s: T) => Partial<T>)) {
      state = { ...state, ...(typeof patch === "function" ? patch(state) : patch) };
      listeners.forEach((l) => l());
    },
    subscribe(l: Listener) {
      listeners.add(l);
      return () => {
        listeners.delete(l);
      };
    },
  };
}

const initial = defaultProject();
initial.selectedRegionId = initial.regions[0].id;
export const store = createStore<UIState>(initial);

export function useUI<T>(sel: (s: UIState) => T): T {
  return useSyncExternalStore(store.subscribe, () => sel(store.get()));
}

export function currentProfile(s: UIState): MappingProfile {
  return (
    s.userProfiles.find((p) => p.id === s.profileId) ??
    BUILTIN_PROFILES.find((p) => p.id === s.profileId) ??
    GENERAL_MIDI
  );
}

export function selectedRegion(s: UIState): DrummerRegion {
  return s.regions.find((r) => r.id === s.selectedRegionId) ?? s.regions[0];
}

function refreshAudio() {
  if (!player.isPlaying()) return;
  const s = store.get();
  const { events, totalTicks } = buildProjectEvents(s.regions, currentProfile(s));
  player.refresh(events, totalTicks, s.bpm);
}

/** Commit a state patch and keep the running audio in sync. */
function commit(patch: Partial<UIState> | ((s: UIState) => Partial<UIState>)) {
  store.set(patch);
  refreshAudio();
}

function patchRegion(id: string, fn: (r: DrummerRegion) => DrummerRegion) {
  commit((s) => ({ regions: s.regions.map((r) => (r.id === id ? fn(r) : r)) }));
}

export const actions = {
  setBpm(v: number) {
    commit({ bpm: clamp(Math.round(v), 40, 220) });
  },

  togglePlay() {
    const s = store.get();
    if (s.playing) {
      player.stop();
      store.set({ playing: false });
    } else {
      const { events, totalTicks } = buildProjectEvents(s.regions, currentProfile(s));
      player.start(events, totalTicks, s.bpm);
      store.set({ playing: true });
    }
  },

  selectRegion(id: string) {
    store.set({ selectedRegionId: id });
  },

  addRegion() {
    const s = store.get();
    const last = s.regions[s.regions.length - 1];
    const r = makeRegion("Verse", 4, last ? last.persona : "tightDriver");
    commit({ regions: [...s.regions, r], selectedRegionId: r.id });
  },

  removeRegion(id: string) {
    const s = store.get();
    if (s.regions.length <= 1) return;
    const regions = s.regions.filter((r) => r.id !== id);
    commit({ regions, selectedRegionId: s.selectedRegionId === id ? regions[0].id : s.selectedRegionId });
  },

  setRegionSection(id: string, section: SectionKind) {
    patchRegion(id, (r) => ({ ...r, section, name: section }));
  },

  setRegionBars(id: string, bars: number) {
    patchRegion(id, (r) => ({ ...r, bars: clamp(Math.round(bars), 1, 64) }));
  },

  reseedRegion(id: string) {
    patchRegion(id, (r) => ({ ...r, seed: 1 + Math.floor(Math.random() * 99999) }));
  },

  setPersona(id: string, persona: PersonaId) {
    patchRegion(id, (r) => ({ ...r, persona, archetypeId: null }));
  },

  applyPersonaDefaults(id: string) {
    patchRegion(id, (r) => ({ ...r, macros: { ...PERSONAS[r.persona].defaults } }));
  },

  setArchetype(id: string, archetypeId: string | null) {
    patchRegion(id, (r) => ({ ...r, archetypeId }));
  },

  setMacro(id: string, key: keyof DrummerRegion["macros"], value: number | string) {
    patchRegion(id, (r) => ({ ...r, macros: { ...r.macros, [key]: value } }));
  },

  setMute(id: string, key: keyof DrummerRegion["mutes"], value: boolean) {
    patchRegion(id, (r) => ({ ...r, mutes: { ...r.mutes, [key]: value } }));
  },

  setFollow(id: string, source: SourceTrackId | null) {
    patchRegion(id, (r) => ({ ...r, followSource: source }));
  },

  /** Day-1: bounce the generated take to editable MIDI in the current profile. */
  convertToEditable(id: string) {
    const s = store.get();
    const region = s.regions.find((r) => r.id === id);
    if (!region || region.editable) return;
    const notes = hitsToMidi(generateRegion(region), currentProfile(s));
    patchRegion(id, (r) => ({
      ...r,
      editable: {
        notes: notes.map((n) => ({ ...n })),
        convertedFrom: { archetypeId: resolveArchetype(r), macros: { ...r.macros }, seed: r.seed },
      },
    }));
  },

  revertEditable(id: string) {
    patchRegion(id, (r) => ({ ...r, editable: null }));
  },

  /** Piano-roll edits (only meaningful on editable regions). */
  addNote(id: string, startTicks: number, pitch: number) {
    patchRegion(id, (r) =>
      r.editable
        ? { ...r, editable: { ...r.editable, notes: [...r.editable.notes, { pitch, velocity: 100, startTicks, durTicks: 40 }].sort((a, b) => a.startTicks - b.startTicks) } }
        : r
    );
  },

  moveNote(id: string, noteIndex: number, startTicks: number, pitch: number) {
    patchRegion(id, (r) => {
      if (!r.editable) return r;
      const notes = [...r.editable.notes];
      const n = notes[noteIndex];
      if (!n) return r;
      notes[noteIndex] = { ...n, startTicks, pitch };
      return { ...r, editable: { ...r.editable, notes } };
    });
  },

  deleteNote(id: string, noteIndex: number) {
    patchRegion(id, (r) => {
      if (!r.editable) return r;
      const notes = r.editable.notes.filter((_, i) => i !== noteIndex);
      return { ...r, editable: { ...r.editable, notes } };
    });
  },

  setNoteVelocity(id: string, noteIndex: number, velocity: number) {
    patchRegion(id, (r) => {
      if (!r.editable) return r;
      const notes = [...r.editable.notes];
      const n = notes[noteIndex];
      if (!n) return r;
      notes[noteIndex] = { ...n, velocity: clamp(Math.round(velocity), 1, 127) };
      return { ...r, editable: { ...r.editable, notes } };
    });
  },

  setProfile(id: string) {
    store.set({ profileId: id });
    refreshAudio();
  },

  patchUserMap(profileId: string, art: string, patch: { pitch?: number; velOffset?: number }) {
    const s = store.get();
    const userProfiles = s.userProfiles.map((p) => {
      if (p.id !== profileId) return p;
      const maps = { ...p.maps };
      const cur = maps[art as keyof typeof maps];
      maps[art as keyof typeof maps] = { ...cur, ...patch };
      return { ...p, maps };
    });
    commit({ userProfiles });
  },

  saveUserProfile(name: string) {
    const s = store.get();
    const base = currentProfile(s);
    const id = `user-${Date.now().toString(36)}`;
    const p = cloneProfile(base, id, name || "My profile");
    const errors = validateProfile(p);
    if (errors.length) return;
    commit({ userProfiles: [...s.userProfiles, p], profileId: id });
  },

  deleteUserProfile(id: string) {
    const s = store.get();
    commit({
      userProfiles: s.userProfiles.filter((p) => p.id !== id),
      profileId: s.profileId === id ? "gm" : s.profileId,
    });
  },

  /** Export the whole project as a standard MIDI file download. */
  exportMidi(filename = "mymusicdaw-drummer.mid") {
    const s = store.get();
    const profile = currentProfile(s);
    let tick = 0;
    const notes = [];
    for (const r of s.regions) {
      for (const n of regionToMidi(r, profile)) notes.push({ ...n, startTicks: n.startTicks + tick });
      tick += r.bars * TICKS_PER_BAR;
    }
    const bytes = writeStandardMidiFile(s.bpm, notes);
    const blob = new Blob([bytes as unknown as BlobPart], { type: "audio/midi" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  },
};

export function projectBarCount(s: UIState): number {
  return regionBarCount(s.regions);
}

export { SEED_LIBRARY, PERSONAS, BUILTIN_PROFILES };
