// Single source of truth for the studio's preset music library, shared by
// the wizard's music step (the picker UI) and the phone preview's audio
// player (which needs to know a selected preset's title/artist/color even
// though it only ever receives the invitation's plain musicUrl/musicTitle).
//
// Each preset's `url` is a real YouTube watch link to the actual track, not
// a hosted audio file — this template has no license to redistribute
// commercial recordings, so playback goes through the YouTube IFrame Player
// (see useMusicPlayer's extractYouTubeVideoId/mode switch) exactly like a
// custom-pasted YouTube link would.
export interface PresetTrack {
  id: string;
  title: string;
  artist?: string;
  url: string;
  color: string;
}

export const PRESET_TRACKS: PresetTrack[] = [
  { id: "wildest-dreams", title: "Wildest Dreams", artist: "Taylor Swift", color: "#8B5CF6", url: "https://www.youtube.com/watch?v=CUr_UwUUXzU" },
  { id: "eid-milad", title: "Eid Milad", artist: "Nancy Ajram", color: "#F59E0B", url: "https://www.youtube.com/watch?v=CI6dnkoHXgk" },
  { id: "birthday-piano", title: "Happy Birthday to You", artist: "Piano", color: "#10B981", url: "https://www.youtube.com/watch?v=pdbQtTbdNJw" },
  { id: "happy-birthday", title: "Happy Birthday", color: "#EC4899", url: "https://www.youtube.com/watch?v=K33Ybr-yRHE" },
  { id: "ahlan-ya-mama", title: "Ahlan Ya Mama", artist: "Balqees", color: "#3B82F6", url: "https://www.youtube.com/watch?v=Jb4ReXtJhZE" },
  { id: "hassa-be-saada", title: "Hassa Be Sa'ada", artist: "Carmen Soliman", color: "#EF4444", url: "https://www.youtube.com/watch?v=ozYMAIiymjM" },
  { id: "huda-arabi", title: "15 Hikaya", artist: "Huda Arabi", color: "#14B8A6", url: "https://www.youtube.com/watch?v=Hi8qpMiFQN8" },
  { id: "river-flows", title: "River Flows in You", artist: "Yiruma", color: "#6366F1", url: "https://www.youtube.com/watch?v=NPBCbTZWnq0" },
  { id: "elissa", title: "Bastanak", artist: "Elissa", color: "#F97316", url: "https://www.youtube.com/watch?v=wNL-uvPlelE" },
];

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
