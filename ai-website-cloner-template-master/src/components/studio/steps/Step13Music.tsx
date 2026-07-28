import { useEffect, useRef, useState } from "react";
import { TextField } from "@/components/studio/fields/TextField";
import { HintBox } from "@/components/studio/fields/HintBox";
import { CheckIcon, LinkIcon, MusicIcon, PauseIcon, PlayIcon, RefreshIcon, TrashIcon, UploadIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { PRESET_TRACKS, trackLabel } from "@/lib/musicLibrary";
import type { InvitationDetail } from "@/types/studio";

function secondsToHms(total: number) {
  const clamped = Math.max(0, Math.floor(total || 0));
  return {
    h: Math.floor(clamped / 3600),
    m: Math.floor((clamped % 3600) / 60),
    s: clamped % 60,
  };
}

function hmsToSeconds(h: number, m: number, s: number) {
  return Math.max(0, h) * 3600 + Math.max(0, m) * 60 + Math.max(0, s);
}

export function Step13Music({
  value,
  onChange,
}: {
  value: InvitationDetail;
  onChange: (patch: Partial<InvitationDetail>) => void;
}) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [showLinkInput, setShowLinkInput] = useState(false);
  // Per-preset local overrides — this template ships no licensed audio, so
  // during testing a real file can be dropped in for any one preset slot
  // instead of its SoundHelix stand-in, without touching the others.
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const overrideTargetRef = useRef<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const overrideInputRef = useRef<HTMLInputElement>(null);

  const { h, m, s } = secondsToHms(value.musicStartSeconds ?? 0);

  function trackUrl(track: (typeof PRESET_TRACKS)[number]) {
    return overrides[track.id] ?? track.url;
  }

  // playingId only ever reflects the audio element's own pause/ended/error
  // events — not a manually-set flag — so the row highlight can't drift out
  // of sync with what's actually making sound.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPause = () => setPlayingId(null);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onPause);
    audio.addEventListener("error", onPause);
    return () => {
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onPause);
      audio.removeEventListener("error", onPause);
    };
  }, []);

  function selectTrack(track: (typeof PRESET_TRACKS)[number]) {
    onChange({ musicUrl: trackUrl(track), musicTitle: trackLabel(track) });
  }

  function togglePreview(track: (typeof PRESET_TRACKS)[number]) {
    const audio = audioRef.current;
    if (!audio) return;
    if (playingId === track.id) {
      audio.pause();
      return;
    }
    // Switching tracks while another preview is active: reassigning src on
    // the shared element implicitly stops whatever was playing, load()
    // makes the reset explicit, then play() starts the new track fresh.
    audio.src = trackUrl(track);
    audio.load();
    audio.play().then(() => setPlayingId(track.id)).catch(() => setPlayingId(null));
  }

  function requestOverride(trackId: string) {
    overrideTargetRef.current = trackId;
    overrideInputRef.current?.click();
  }

  async function handleOverrideSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    const trackId = overrideTargetRef.current;
    event.target.value = "";
    overrideTargetRef.current = null;
    if (!file || !trackId) return;

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });

    setOverrides((current) => ({ ...current, [trackId]: dataUrl }));

    // If this preset is the one currently selected for the invitation,
    // repoint its saved musicUrl at the new local file immediately.
    const track = PRESET_TRACKS.find((item) => item.id === trackId);
    if (track && value.musicUrl === trackUrl(track)) {
      onChange({ musicUrl: dataUrl });
    }
  }

  function updateStart(next: Partial<{ h: number; m: number; s: number }>) {
    const merged = { h, m, s, ...next };
    onChange({ musicStartSeconds: hmsToSeconds(merged.h, merged.m, merged.s) });
  }

  async function handleFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
    onChange({ musicUrl: dataUrl, musicTitle: value.musicTitle || file.name.replace(/\.[^.]+$/, "") });
  }

  function removeMusic() {
    if (playingId) audioRef.current?.pause();
    setPlayingId(null);
    setShowLinkInput(false);
    onChange({ musicUrl: null, musicTitle: null, musicStartSeconds: null });
  }

  return (
    <div className="space-y-5">
      <audio ref={audioRef} className="hidden" />
      <input
        ref={overrideInputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={handleOverrideSelected}
      />

      <HintBox>اختر مقطوعة من المكتبة أو ارفع ملفك الخاص — تعزف الموسيقى عند فتح الدعوة.</HintBox>

      {/* Preset library */}
      <div>
        <p className="mb-2 text-sm text-gray-700">مكتبة الموسيقى</p>
        <div className="space-y-2">
          {PRESET_TRACKS.map((track) => {
            const selected = value.musicUrl === trackUrl(track);
            const playing = playingId === track.id;
            const overridden = Boolean(overrides[track.id]);
            return (
              <div
                key={track.id}
                onClick={() => selectTrack(track)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter") selectTrack(track);
                }}
                className={cn(
                  "flex items-center gap-3 rounded-xl border-2 px-3.5 py-2.5 text-sm transition-colors",
                  selected ? "border-gold bg-gold/5" : "border-gray-200 hover:border-gold/40"
                )}
              >
                <span
                  className="flex size-8 shrink-0 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: track.color }}
                >
                  <MusicIcon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-gray-800">{track.title}</span>
                  {track.artist && (
                    <span className="block truncate text-xs text-gray-400">
                      {track.artist}
                      {overridden && <span className="text-gold"> · ملف محلي</span>}
                    </span>
                  )}
                </span>
                {selected && (
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-gold text-white">
                    <CheckIcon className="size-3" />
                  </span>
                )}
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    requestOverride(track.id);
                  }}
                  aria-label="استبدال بملف محلي"
                  title="استبدال بملف محلي (اختبار)"
                  className="flex size-8 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition-colors hover:border-gold/40 hover:text-gold"
                >
                  <RefreshIcon className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    togglePreview(track);
                  }}
                  aria-label={playing ? "إيقاف مؤقت" : "تشغيل"}
                  className="flex size-8 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-colors hover:border-gold/40 hover:text-gold"
                >
                  {playing ? <PauseIcon className="size-3.5" /> : <PlayIcon className="size-3.5 ms-0.5" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom upload / link */}
      <div className="space-y-3 border-t border-gray-100 pt-4">
        <TextField
          label="اسم المقطوعة / الفنان"
          value={value.musicTitle ?? ""}
          placeholder="مثال: Can't Help Falling in Love"
          onChange={(musicTitle) => onChange({ musicTitle })}
        />

        <div className="grid grid-cols-2 gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={handleFileSelected}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-gold/40 py-2.5 text-sm font-medium text-gold transition-colors hover:bg-gold/5"
          >
            <UploadIcon className="size-4" />
            رفع ملف
          </button>
          <button
            type="button"
            onClick={() => setShowLinkInput((open) => !open)}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-sm font-medium transition-colors",
              showLinkInput ? "border-gold bg-gold/5 text-gold" : "border-gray-200 text-gray-600 hover:border-gold/40"
            )}
          >
            <LinkIcon className="size-4" />
            يوتيوب / رابط
          </button>
        </div>

        {showLinkInput && (
          <TextField
            value={value.musicUrl ?? ""}
            placeholder="https://youtube.com/watch?v=..."
            onChange={(musicUrl) => onChange({ musicUrl })}
          />
        )}
      </div>

      {/* Start time */}
      <div className="space-y-2 border-t border-gray-100 pt-4">
        <p className="text-sm text-gray-700">وقت بدء الموسيقى</p>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <input
              type="number"
              min={0}
              value={h}
              onChange={(event) => updateStart({ h: Number(event.target.value) })}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-center text-sm outline-none focus:border-gold"
            />
            <p className="mt-1 text-center text-[11px] text-gray-400">ساعات (H)</p>
          </div>
          <div>
            <input
              type="number"
              min={0}
              max={59}
              value={m}
              onChange={(event) => updateStart({ m: Number(event.target.value) })}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-center text-sm outline-none focus:border-gold"
            />
            <p className="mt-1 text-center text-[11px] text-gray-400">دقائق (M)</p>
          </div>
          <div>
            <input
              type="number"
              min={0}
              max={59}
              value={s}
              onChange={(event) => updateStart({ s: Number(event.target.value) })}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-center text-sm outline-none focus:border-gold"
            />
            <p className="mt-1 text-center text-[11px] text-gray-400">ثواني (S)</p>
          </div>
        </div>
        <p className="text-xs text-gray-400">ستبدأ الموسيقى من هذه النقطة ({value.musicStartSeconds ?? 0}s)</p>
      </div>

      {value.musicUrl && (
        <button
          type="button"
          onClick={removeMusic}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-medium text-rose-500 transition-colors hover:bg-rose-50"
        >
          <TrashIcon className="size-3.5" />
          إزالة الموسيقى
        </button>
      )}
    </div>
  );
}
