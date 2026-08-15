"use client";

import { useEffect, useRef, useState } from "react";
import { extractYouTubeVideoId, loadYouTubeIframeApi } from "@/lib/youtube";

// Used only when a track's own URL fails to load, so the player never goes
// completely dead — a locally generated placeholder tone (no external
// network dependency, so it can't fail for the same reason the original did).
const FALLBACK_SAMPLE_URL = "/audio/fallback-sample.wav";

// Owns the actual <audio>/YouTube backend so a single instance can be
// mounted once at the canvas root (surviving the Music modal opening and
// closing) instead of a fresh player being created every time the modal
// mounts — that's what lets the envelope's "OPEN" tap start the track
// immediately, with the modal later just showing/controlling whatever is
// already playing rather than starting a second, independent instance.
//
// `startSeconds` (Step13Music's "music start time" H/M/S picker,
// InvitationDetail.musicStartSeconds) is where the track should *begin* —
// applied once per track, the first time it actually starts playing, not
// re-applied on every subsequent pause/resume (a guest resuming from pause
// should continue from where they left off, not jump back to the offset).
export function useMusicPlayer(url?: string | null, startSeconds = 0) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const youtubeContainerRef = useRef<HTMLDivElement>(null);
  const youtubePlayerRef = useRef<YT.Player | null>(null);
  // new YT.Player(...) returns an object synchronously, but its API methods
  // (playVideo, seekTo, ...) aren't actually wired up until the player's own
  // onReady event fires — calling them before that throws "is not a
  // function". The envelope's "OPEN" tap calls play() the instant it's
  // tapped, which can easily land inside that gap on a slow connection, so
  // every YouTube-branch call below is gated on this instead of just
  // youtubePlayerRef.current being non-null.
  const playerReadyRef = useRef(false);
  // Set when play() is called while still inside that gap — onReady drains
  // it, so a fast tap still results in playback instead of silently no-op'ing.
  const pendingPlayRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [usingFallback, setUsingFallback] = useState(false);
  const [loadError, setLoadError] = useState(false);
  // Tracks whether the offset has been applied yet for the *current* track —
  // reset alongside the rest of the per-track state below whenever `url`
  // changes, so a newly-selected track gets its own start offset applied
  // fresh instead of inheriting "already applied" from the previous one.
  const startAppliedRef = useRef(false);

  // A YouTube link can't be handed to <audio src>, so it's played through a
  // background IFrame Player instead — everything else (direct file links,
  // uploads, preset tracks) stays on the plain HTML5 element. Once the
  // fallback tone kicks in it's always HTML5, regardless of what the
  // original source was.
  const youtubeVideoId = usingFallback ? null : extractYouTubeVideoId(url);
  const mode: "html5" | "youtube" = youtubeVideoId ? "youtube" : "html5";
  const effectiveUrl = usingFallback ? FALLBACK_SAMPLE_URL : mode === "html5" ? (url ?? null) : null;
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
    startAppliedRef.current = false;
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
    // where it's rendered) — explicitly (re)load it so playback state
    // starts clean.
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
    playerReadyRef.current = false;
    pendingPlayRef.current = false;

    loadYouTubeIframeApi()
      .then((YTApi) => {
        if (cancelled || !youtubeContainerRef.current) return;
        player = new YTApi.Player(youtubeContainerRef.current, {
          videoId: youtubeVideoId,
          playerVars: { controls: 0, disablekb: 1, modestbranding: 1, playsinline: 1, rel: 0 },
          events: {
            onReady: (event) => {
              playerReadyRef.current = true;
              event.target.setVolume(Math.round(volume * 100));
              setDuration(event.target.getDuration());
              if (pendingPlayRef.current) {
                pendingPlayRef.current = false;
                if (!startAppliedRef.current && startSeconds > 0) {
                  startAppliedRef.current = true;
                  event.target.seekTo(startSeconds, true);
                }
                event.target.playVideo();
              }
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
      playerReadyRef.current = false;
      pendingPlayRef.current = false;
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

  function play() {
    if (mode === "youtube") {
      // If the player object exists but hasn't fired onReady yet, its API
      // methods (playVideo, seekTo) aren't callable — queue the request
      // instead of throwing; onReady drains it (and applies startSeconds)
      // once the player actually can play.
      if (!playerReadyRef.current || !youtubePlayerRef.current) {
        pendingPlayRef.current = true;
        return;
      }
      if (!startAppliedRef.current && startSeconds > 0) {
        startAppliedRef.current = true;
        youtubePlayerRef.current.seekTo(startSeconds, true);
      }
      youtubePlayerRef.current.playVideo();
      return;
    }

    // Seeks to the configured start offset the first time this track
    // actually starts, before asking it to play — so the envelope's "OPEN"
    // tap (or the modal's play button, whichever fires first) lands the
    // guest directly on the intended moment in the track instead of its
    // beginning.
    if (!startAppliedRef.current && startSeconds > 0) {
      startAppliedRef.current = true;
      if (audioRef.current) audioRef.current.currentTime = startSeconds;
    }
    const audio = audioRef.current;
    if (!audio) return;
    // Runs directly inside whatever click handler called it (a real user
    // gesture — the envelope's "OPEN" tap or the modal's play button),
    // which is what satisfies browser autoplay policies. isPlaying itself
    // is only ever set from the audio/YouTube player's own events above,
    // so the UI only ever shows "playing" once sound is actually coming out.
    audio.play().catch(() => setLoadError(true));
  }

  function pause() {
    if (mode === "youtube") {
      pendingPlayRef.current = false;
      if (playerReadyRef.current) youtubePlayerRef.current?.pauseVideo();
      return;
    }
    audioRef.current?.pause();
  }

  function togglePlay() {
    if (isPlaying) pause();
    else play();
  }

  function seek(value: number) {
    setCurrentTime(value);
    if (mode === "youtube") {
      if (playerReadyRef.current) youtubePlayerRef.current?.seekTo(value, true);
      return;
    }
    const audio = audioRef.current;
    if (audio) audio.currentTime = value;
  }

  function changeVolume(value: number) {
    setVolume(value);
    if (mode === "youtube") {
      if (playerReadyRef.current) youtubePlayerRef.current?.setVolume(Math.round(value * 100));
      return;
    }
    const audio = audioRef.current;
    if (audio) audio.volume = value;
  }

  return {
    audioRef,
    youtubeContainerRef,
    mode,
    effectiveUrl,
    isPlaying,
    currentTime,
    duration,
    volume,
    usingFallback,
    loadError,
    canPlay,
    play,
    pause,
    togglePlay,
    seek,
    changeVolume,
  };
}

export type MusicPlayerController = ReturnType<typeof useMusicPlayer>;
