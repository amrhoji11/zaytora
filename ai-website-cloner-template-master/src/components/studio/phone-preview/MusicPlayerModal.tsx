"use client";

import { useEffect, useRef, useState } from "react";
import { MusicIcon, PauseIcon, PlayIcon, VolumeIcon } from "@/components/icons";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function MusicPlayerModal({
  title,
  url,
  coverImageUrl,
  fallbackLabel,
}: {
  title?: string | null;
  url?: string | null;
  coverImageUrl?: string | null;
  fallbackLabel: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration || 0);
    const onEnd = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnd);
    };
  }, [url]);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  }

  function seek(value: number) {
    const audio = audioRef.current;
    if (audio) audio.currentTime = value;
    setCurrentTime(value);
  }

  function changeVolume(value: number) {
    setVolume(value);
    const audio = audioRef.current;
    if (audio) audio.volume = value;
  }

  return (
    <div className="flex flex-col items-center gap-3 py-1">
      {url && <audio ref={audioRef} src={url} preload="metadata" />}

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
        <div className="relative flex size-8 items-center justify-center overflow-hidden rounded-full border-2 border-gold bg-gold/20">
          {coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverImageUrl} alt="" className="size-full object-cover" />
          ) : (
            <MusicIcon className="size-3.5 text-gold" />
          )}
        </div>
      </div>

      <p className="max-w-[85%] truncate text-center text-xs font-medium text-gray-700">{title || fallbackLabel}</p>

      <button
        type="button"
        onClick={togglePlay}
        disabled={!url}
        aria-label={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
        className="flex size-9 items-center justify-center rounded-full bg-gold text-white shadow transition-transform active:scale-95 disabled:opacity-40"
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
          disabled={!url}
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
