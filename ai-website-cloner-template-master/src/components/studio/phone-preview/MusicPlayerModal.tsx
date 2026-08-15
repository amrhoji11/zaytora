"use client";

import { MusicIcon, PauseIcon, PlayIcon, VolumeIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import type { MusicPlayerController } from "./useMusicPlayer";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Pure UI shell — the actual <audio>/YouTube backend lives in
// useMusicPlayer(), owned by InvitationCanvas and mounted once at the
// canvas root, so the same track that started playing when the guest
// opened the envelope keeps playing (and this modal just reflects/controls
// it) instead of a second, independent player spinning up here.
export function MusicPlayerModal({
  title,
  coverImageUrl,
  coverColor,
  fallbackLabel,
  player,
}: {
  title?: string | null;
  coverImageUrl?: string | null;
  coverColor?: string | null;
  fallbackLabel: string;
  player: MusicPlayerController;
}) {
  const { mode, isPlaying, currentTime, duration, volume, usingFallback, loadError, canPlay, togglePlay, seek, changeVolume } =
    player;

  return (
    <div className="flex flex-col items-center gap-3 py-1">
      <div
        className="relative flex size-20 shrink-0 items-center justify-center rounded-full bg-[radial-gradient(circle,#2a2a2a_0%,#111_60%,#000_100%)] shadow-lg animate-spin"
        style={{ animationDuration: "5s", animationPlayState: isPlaying ? "running" : "paused" }}
      >
        {[0, 1, 2].map((ring) => (
          <span
            key={ring}
            className="absolute rounded-full border border-white/10"
            style={{ inset: `${5 + ring * 5}px` }}
          />
        ))}
        <div
          className="relative flex size-8 items-center justify-center overflow-hidden rounded-full border-2 border-gold bg-gold/20"
          style={coverColor ? { borderColor: coverColor } : undefined}
        >
          {coverColor ? (
            <span className="flex size-full items-center justify-center" style={{ backgroundColor: coverColor }}>
              <MusicIcon className="size-3.5 text-white" />
            </span>
          ) : coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverImageUrl} alt="" className="size-full object-cover" />
          ) : (
            <MusicIcon className="size-3.5 text-gold" />
          )}
        </div>
      </div>

      <p className="max-w-[85%] truncate text-center text-xs font-medium text-gray-700">{title || fallbackLabel}</p>
      {mode === "youtube" && <p className="text-[10px] text-gray-400">يتم التشغيل عبر يوتيوب</p>}
      {usingFallback && !loadError && (
        <p className="text-[10px] text-gray-400">تعذّر تحميل المقطع — يتم تشغيل مقطع تجريبي</p>
      )}
      {loadError && <p className="text-[10px] text-rose-500">تعذّر تشغيل الصوت</p>}

      <button
        type="button"
        onClick={togglePlay}
        disabled={!canPlay || loadError}
        aria-label={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
        className={cn(
          "flex size-9 items-center justify-center rounded-full bg-gold text-white shadow transition-transform active:scale-95 disabled:opacity-40",
          isPlaying && "pulse-glow-gold"
        )}
      >
        {isPlaying ? <PauseIcon className="size-4" /> : <PlayIcon className="size-4 ms-0.5" />}
      </button>

      <div className="w-full space-y-1 px-1">
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={Math.min(currentTime, duration || 0)}
          onChange={(event) => seek(Number(event.target.value))}
          disabled={!canPlay || loadError}
          className="w-full accent-gold disabled:opacity-40"
        />
        <div dir="ltr" className="flex items-center justify-between text-[10px] text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex w-full items-center gap-2 px-1">
        <VolumeIcon className="size-3.5 shrink-0 text-gray-400" />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(event) => changeVolume(Number(event.target.value))}
          className="w-full accent-gold"
        />
      </div>
    </div>
  );
}
