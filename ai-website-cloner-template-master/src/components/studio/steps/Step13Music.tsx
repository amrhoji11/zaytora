"use client";

import { useEffect, useRef, useState } from "react";
import { TextField } from "@/components/studio/fields/TextField";
import { HintBox } from "@/components/studio/fields/HintBox";
import { CheckIcon, LinkIcon, MusicIcon, PauseIcon, PlayIcon, RefreshIcon, TrashIcon, UploadIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { PRESET_TRACKS, trackLabel } from "@/lib/musicLibrary";
import { useMusicPlayer } from "@/components/studio/phone-preview/useMusicPlayer";
import { useLanguage } from "@/context/LanguageContext";
import type { InvitationDetail } from "@/types/studio";

const COPY = {
  ar: {
    hint: "اختر مقطوعة من المكتبة أو ارفع ملفك الخاص — تعزف الموسيقى عند فتح الدعوة.",
    library: "مكتبة الموسيقى",
    localFile: "ملف محلي",
    replaceAria: "استبدال بملف محلي",
    replaceTitle: "استبدال بملف محلي (اختبار)",
    pause: "إيقاف مؤقت",
    play: "تشغيل",
    trackTitle: "اسم المقطوعة / الفنان",
    trackTitlePlaceholder: "مثال: Can't Help Falling in Love",
    uploadFile: "رفع ملف",
    youtubeLink: "يوتيوب / رابط",
    startTime: "وقت بدء الموسيقى",
    hours: "ساعات (H)",
    minutes: "دقائق (M)",
    seconds: "ثواني (S)",
    startHint: (s: number) => `ستبدأ الموسيقى من هذه النقطة (${s}s)`,
    removeMusic: "إزالة الموسيقى",
    viaYoutube: "التشغيل عبر يوتيوب",
  },
  en: {
    hint: "Choose a track from the library or upload your own — the music plays when the invitation opens.",
    library: "Music library",
    localFile: "local file",
    replaceAria: "Replace with local file",
    replaceTitle: "Replace with local file (testing)",
    pause: "Pause",
    play: "Play",
    trackTitle: "Track name / artist",
    trackTitlePlaceholder: "e.g. Can't Help Falling in Love",
    uploadFile: "Upload file",
    youtubeLink: "YouTube / link",
    startTime: "Music start time",
    hours: "Hours (H)",
    minutes: "Minutes (M)",
    seconds: "Seconds (S)",
    startHint: (s: number) => `Music will start from this point (${s}s)`,
    removeMusic: "Remove music",
    viaYoutube: "Playing via YouTube",
  },
};

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
  const { language } = useLanguage();
  const t = COPY[language];
  const [previewTrackId, setPreviewTrackId] = useState<string | null>(null);
  const [showLinkInput, setShowLinkInput] = useState(false);
  // Per-preset local overrides — lets a preset slot be swapped for a locally
  // uploaded file instead of its YouTube source, without touching the others.
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const overrideTargetRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const overrideInputRef = useRef<HTMLInputElement>(null);

  const { h, m, s } = secondsToHms(value.musicStartSeconds ?? 0);

  function trackUrl(track: (typeof PRESET_TRACKS)[number]) {
    return overrides[track.id] ?? track.url;
  }

  const previewTrack = PRESET_TRACKS.find((track) => track.id === previewTrackId) ?? null;
  const previewUrl = previewTrack ? trackUrl(previewTrack) : null;
  const preview = useMusicPlayer(previewUrl);
  // Rows can't call preview.play() the instant they're clicked — for a
  // YouTube-backed track the IFrame Player is still being created
  // asynchronously at that point, so play() would land on a null ref and do
  // nothing. Both backends set a real duration once genuinely ready
  // (loadedmetadata for <audio>, onReady for YouTube), so that's used as the
  // "safe to play" signal instead. Guarded per-url so a manual pause
  // afterwards doesn't get immediately overridden by this effect replaying it.
  const autoplayedUrlRef = useRef<string | null>(null);
  useEffect(() => {
    if (!previewUrl || preview.duration <= 0) return;
    if (autoplayedUrlRef.current === previewUrl) return;
    autoplayedUrlRef.current = previewUrl;
    preview.play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewUrl, preview.duration]);

  function selectTrack(track: (typeof PRESET_TRACKS)[number]) {
    onChange({ musicUrl: trackUrl(track), musicTitle: trackLabel(track) });
  }

  function togglePreview(track: (typeof PRESET_TRACKS)[number]) {
    if (previewTrackId === track.id) {
      preview.togglePlay();
      return;
    }
    setPreviewTrackId(track.id);
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
    preview.pause();
    setPreviewTrackId(null);
    setShowLinkInput(false);
    onChange({ musicUrl: null, musicTitle: null, musicStartSeconds: null });
  }

  return (
    <div className="space-y-5">
      <audio key={preview.effectiveUrl} ref={preview.audioRef} src={preview.effectiveUrl ?? undefined} className="hidden" />
      <div ref={preview.youtubeContainerRef} className="hidden" />
      <input
        ref={overrideInputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={handleOverrideSelected}
      />

      <HintBox>{t.hint}</HintBox>

      {/* Preset library */}
      <div>
        <p className="mb-2 text-sm text-body-foreground">{t.library}</p>
        <div className="space-y-2">
          {PRESET_TRACKS.map((track) => {
            const selected = value.musicUrl === trackUrl(track);
            const isPreviewTrack = previewTrackId === track.id;
            const playing = isPreviewTrack && preview.isPlaying;
            const loading = isPreviewTrack && !preview.isPlaying && !preview.loadError && preview.duration <= 0;
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
                  selected ? "border-gold bg-gold/5" : "border-border hover:border-gold/40"
                )}
              >
                <span
                  className="flex size-8 shrink-0 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: track.color }}
                >
                  <MusicIcon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-foreground">{track.title}</span>
                  {(track.artist || overridden || isPreviewTrack) && (
                    <span className="block truncate text-xs text-muted-foreground">
                      {track.artist}
                      {overridden && <span className="text-gold"> · {t.localFile}</span>}
                      {!overridden && isPreviewTrack && <span className="text-gold"> · {t.viaYoutube}</span>}
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
                  aria-label={t.replaceAria}
                  title={t.replaceTitle}
                  className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-gold/40 hover:text-gold"
                >
                  <RefreshIcon className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    togglePreview(track);
                  }}
                  aria-label={playing ? t.pause : t.play}
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full border border-border text-body-foreground transition-colors hover:border-gold/40 hover:text-gold",
                    loading && "animate-pulse"
                  )}
                >
                  {playing ? <PauseIcon className="size-3.5" /> : <PlayIcon className="size-3.5 ms-0.5" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom upload / link */}
      <div className="space-y-3 border-t border-border pt-4">
        <TextField
          label={t.trackTitle}
          value={value.musicTitle ?? ""}
          placeholder={t.trackTitlePlaceholder}
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
            {t.uploadFile}
          </button>
          <button
            type="button"
            onClick={() => setShowLinkInput((open) => !open)}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-sm font-medium transition-colors",
              showLinkInput ? "border-gold bg-gold/5 text-gold" : "border-border text-body-foreground hover:border-gold/40"
            )}
          >
            <LinkIcon className="size-4" />
            {t.youtubeLink}
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
      <div className="space-y-2 border-t border-border pt-4">
        <p className="text-sm text-body-foreground">{t.startTime}</p>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <input
              type="number"
              min={0}
              value={h}
              onChange={(event) => updateStart({ h: Number(event.target.value) })}
              className="w-full rounded-xl border border-border bg-background/5 px-3 py-2 text-center text-sm text-foreground outline-none focus:border-gold"
            />
            <p className="mt-1 text-center text-[11px] text-muted-foreground">{t.hours}</p>
          </div>
          <div>
            <input
              type="number"
              min={0}
              max={59}
              value={m}
              onChange={(event) => updateStart({ m: Number(event.target.value) })}
              className="w-full rounded-xl border border-border bg-background/5 px-3 py-2 text-center text-sm text-foreground outline-none focus:border-gold"
            />
            <p className="mt-1 text-center text-[11px] text-muted-foreground">{t.minutes}</p>
          </div>
          <div>
            <input
              type="number"
              min={0}
              max={59}
              value={s}
              onChange={(event) => updateStart({ s: Number(event.target.value) })}
              className="w-full rounded-xl border border-border bg-background/5 px-3 py-2 text-center text-sm text-foreground outline-none focus:border-gold"
            />
            <p className="mt-1 text-center text-[11px] text-muted-foreground">{t.seconds}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{t.startHint(value.musicStartSeconds ?? 0)}</p>
      </div>

      {value.musicUrl && (
        <button
          type="button"
          onClick={removeMusic}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-medium text-rose-700 dark:text-rose-400 transition-colors hover:bg-rose-100 dark:bg-rose-950/30"
        >
          <TrashIcon className="size-3.5" />
          {t.removeMusic}
        </button>
      )}
    </div>
  );
}
