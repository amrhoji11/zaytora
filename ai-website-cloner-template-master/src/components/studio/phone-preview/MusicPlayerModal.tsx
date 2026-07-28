"use client";

import { useEffect, useRef, useState } from "react";
import { MusicIcon, PauseIcon, PlayIcon, VolumeIcon } from "@/components/icons";
import { extractYouTubeVideoId, loadYouTubeIframeApi } from "@/lib/youtube";

// Used only when a track's own URL fails to load, so the player never goes
// completely dead — a locally generated placeholder tone (no external
// network dependency, so it can't fail for the same reason the original did).
const FALLBACK_SAMPLE_URL = "/audio/fallback-sample.wav";

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
  coverColor,
  fallbackLabel,
}: {
  title?: string | null;
  url?: string | null;
  coverImageUrl?: string | null;
  coverColor?: string | null;
  fallbackLabel: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const youtubeContainerRef = useRef<HTMLDivElement>(null);
  const youtubePlayerRef = useRef<YT.Player | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [usingFallback, setUsingFallback] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // A YouTube link can't be handed to <audio src>, so it's played through a
  // background IFrame Player instead — everything else (direct file links,
  // uploads, preset tracks) stays on the plain HTML5 element. Once the
  // fallback tone kicks in it's always HTML5, regardless of what the
  // original source was.
  const youtubeVideoId = usingFallback ? null : extractYouTubeVideoId(url);
  const mode: "html5" | "youtube" = youtubeVideoId ? "youtube" : "html5";
  const effectiveUrl = usingFallback ? FALLBACK_SAMPLE_URL : mode === "html5" ? url : null;
  const canPlay = mode === "youtube" ? Boolean(youtubeVideoId) : Boolean(effectiveUrl);

  // Reset per-track state whenever the selected track changes, so a new
  // song doesn't inherit the last one's clock or fallback status. Done
  // during render (React's sanctioned "adjust state on prop change"
  // pattern) rather than in an effect, since it needs to happen before
  // the reset audio element paints, not one render later.
  const [trackedUrl, setTrackedUrl] = useState(url);
  if (trackedUrl !== url) {
    setTrackedUrl(url);
    setUsingFallback(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setLoadError(false);
  }

  // HTML5 <audio> backend.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration || 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnd = () => setIsPlaying(false);
    const onError = () => {
      setIsPlaying(false);
      if (!usingFallback) {
        setUsingFallback(true);
      } else {
        setLoadError(true);
      }
    };

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("durationchange", onMeta);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnd);
    audio.addEventListener("error", onError);

    // Fresh <audio> element for this track (remounted via key={effectiveUrl}
    // below) — explicitly (re)load it so playback state starts clean.
    audio.load();

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("durationchange", onMeta);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnd);
      audio.removeEventListener("error", onError);
    };
  }, [effectiveUrl, usingFallback]);

  // YouTube IFrame Player backend — instantiated fresh per video id and torn
  // down on cleanup, since the API has no "just change the src" equivalent.
  useEffect(() => {
    if (mode !== "youtube" || !youtubeVideoId) return;
    let cancelled = false;
    let player: YT.Player | null = null;

    loadYouTubeIframeApi()
      .then((YTApi) => {
        if (cancelled || !youtubeContainerRef.current) return;
        player = new YTApi.Player(youtubeContainerRef.current, {
          videoId: youtubeVideoId,
          playerVars: { controls: 0, disablekb: 1, modestbranding: 1, playsinline: 1, rel: 0 },
          events: {
            onReady: (event) => {
              event.target.setVolume(Math.round(volume * 100));
              setDuration(event.target.getDuration());
            },
            onStateChange: (event) => {
              if (event.data === YTApi.PlayerState.PLAYING) {
                setIsPlaying(true);
              } else if (event.data === YTApi.PlayerState.PAUSED) {
                setIsPlaying(false);
              } else if (event.data === YTApi.PlayerState.ENDED) {
                setIsPlaying(false);
                setCurrentTime(0);
              }
            },
            onError: () => {
              setIsPlaying(false);
              setUsingFallback(true);
            },
          },
        });
        youtubePlayerRef.current = player;
      })
      .catch(() => setUsingFallback(true));

    return () => {
      cancelled = true;
      player?.destroy();
      youtubePlayerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, youtubeVideoId]);

  // The IFrame API has no timeupdate event, so the seek bar is kept in sync
  // by polling getCurrentTime() while a YouTube track is actually playing.
  useEffect(() => {
    if (mode !== "youtube" || !isPlaying) return;
    const interval = setInterval(() => {
      const player = youtubePlayerRef.current;
      if (player) setCurrentTime(player.getCurrentTime());
    }, 250);
    return () => clearInterval(interval);
  }, [mode, isPlaying]);

  function togglePlay() {
    if (mode === "youtube") {
      const player = youtubePlayerRef.current;
      if (!player) return;
      if (isPlaying) player.pauseVideo();
      else player.playVideo();
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;
    // .play()/.pause() run directly inside the click handler (a real user
    // gesture), which is what satisfies browser autoplay policies — the
    // isPlaying state itself is only ever set from the audio's own
    // play/pause/ended events above, so the vinyl only spins when the
    // element is actually producing sound.
    if (audio.paused) {
      audio.play().catch(() => setLoadError(true));
    } else {
      audio.pause();
    }
  }

  function seek(value: number) {
    setCurrentTime(value);
    if (mode === "youtube") {
      youtubePlayerRef.current?.seekTo(value, true);
      return;
    }
    const audio = audioRef.current;
    if (audio) audio.currentTime = value;
  }

  function changeVolume(value: number) {
    setVolume(value);
    if (mode === "youtube") {
      youtubePlayerRef.current?.setVolume(Math.round(value * 100));
      return;
    }
    const audio = audioRef.current;
    if (audio) audio.volume = value;
  }

  return (
    <div className="flex flex-col items-center gap-3 py-1">
      {mode === "html5" && effectiveUrl && (
        <audio key={effectiveUrl} ref={audioRef} src={effectiveUrl} preload="metadata" />
      )}
      {mode === "youtube" && (
        <div className="pointer-events-none size-px overflow-hidden opacity-0" aria-hidden>
          <div ref={youtubeContainerRef} />
        </div>
      )}

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
