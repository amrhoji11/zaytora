// Single source of truth for the studio's preset music library, shared by
// the wizard's music step (the picker UI) and the phone preview's audio
// player (which needs to know a selected preset's title/artist/color even
// though it only ever receives the invitation's plain musicUrl/musicTitle).
//
// This template ships no licensed audio, so each preset plays a short,
// locally generated, perceptually distinct placeholder clip
// (public/audio/*.wav — its own waveform + melodic pattern, not just a
// different pitch of the same beep) rather than hotlinking a real copy of
// the named commercial track.
export interface PresetTrack {
  id: string;
  title: string;
  artist?: string;
  url: string;
  color: string;
}

export const PRESET_TRACKS: PresetTrack[] = [
  { id: "wildest-dreams", title: "Wildest Dreams", artist: "Taylor Swift", color: "#8B5CF6" },
  { id: "eid-milad", title: "Eid Milad", artist: "Nancy Ajram", color: "#F59E0B" },
  { id: "birthday-piano", title: "Birthday Song", artist: "Piano", color: "#10B981" },
  { id: "happy-birthday", title: "Happy Birthday", artist: "Khalid Assiri", color: "#EC4899" },
  { id: "ahlan-ya-mama", title: "Ahlan Ya Mama", artist: "Balqees", color: "#3B82F6" },
  { id: "hassa-be-saada", title: "Hassa Be Sa'ada", artist: "Carmen Soliman", color: "#EF4444" },
  { id: "huda-arabi", title: "Huda Arabi", color: "#14B8A6" },
  { id: "river-flows", title: "River Flows in You", artist: "Yiruma", color: "#6366F1" },
  { id: "elissa", title: "Elissa", color: "#F97316" },
].map((track) => ({ ...track, url: `/audio/${track.id}.wav` }));

export function trackLabel(track: Pick<PresetTrack, "title" | "artist">) {
  return track.artist ? `${track.title} - ${track.artist}` : track.title;
}

// Looks up a preset by its resolved audio URL, so the phone preview's player
// can recover the title/artist/color for whatever the invitation's plain
// musicUrl currently points at — falling back to null for a custom
// upload/link, which carries no library metadata.
export function findPresetTrackByUrl(url?: string | null): PresetTrack | null {
  if (!url) return null;
  return PRESET_TRACKS.find((track) => track.url === url) ?? null;
}
