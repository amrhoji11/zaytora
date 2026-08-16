"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Slow enough to passively read each card as it drifts by (measured against
// the reference's own auto-scroll pacing) — fast enough that a ~3000px tall
// invitation finishes in well under a minute.
const AUTO_SCROLL_PX_PER_SEC = 55;

interface ScrollTarget {
  top: number;
  max: number;
  set: (value: number) => void;
}

// Drives a slow, passive scroll through the invitation once the guest opens
// the envelope — "sit back and watch the card" rather than "keep scrolling
// yourself". Reads/writes real DOM scroll position only inside effects and
// rAF callbacks (never during render), so it stays SSR/hydration-safe.
//
// `standalone` matches InvitationCanvas's own prop: the guest-facing page
// scrolls the window itself, while the embedded phone-bezel mockup scrolls
// its own bounded container (`containerRef`).
export function useAutoScroll({
  standalone,
  containerRef,
}: {
  standalone: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  // Whether an auto-scroll "ride" is underway at all — governs whether the
  // floating pause/resume control is shown. Distinct from `isPaused`: a
  // paused ride is still active (control visible, resumable), it's just not
  // currently moving.
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  // Mirrors isPaused for the rAF loop's closure — state updates aren't
  // visible inside an already-scheduled callback, so the loop reads this
  // ref instead of re-subscribing to state on every pause/resume.
  const pausedRef = useRef(false);
  const activeRef = useRef(false);
  // The loop re-schedules itself via requestAnimationFrame(tickRef.current)
  // rather than closing over `tick` directly — referencing a useCallback
  // result from inside its own callback body trips
  // react-hooks/immutability's "accessed before declared" check, since the
  // binding isn't assigned until the useCallback call returns. A ref sidesteps
  // that: it exists (as an empty stub) before `tick` is ever defined, and is
  // repointed to the latest `tick` in the effect below.
  const tickRef = useRef<(ts: number) => void>(() => {});

  const getScrollTarget = useCallback((): ScrollTarget | null => {
    if (standalone) {
      if (typeof window === "undefined") return null;
      return {
        top: window.scrollY,
        max: document.documentElement.scrollHeight - window.innerHeight,
        // Explicit "instant" is required — the page has a global
        // `scroll-behavior: smooth`, and without overriding it here, every
        // one of this rAF loop's ~60 calls/sec starts a brand new smooth
        // scroll animation that cancels the previous one before it makes
        // any real progress, so the page never actually visibly moves.
        set: (value) => window.scrollTo({ top: value, left: 0, behavior: "instant" }),
      };
    }
    const el = containerRef.current;
    if (!el) return null;
    return {
      top: el.scrollTop,
      max: el.scrollHeight - el.clientHeight,
      set: (value) => {
        el.scrollTop = value;
      },
    };
  }, [standalone, containerRef]);

  const tick = useCallback(
    (ts: number) => {
      if (!activeRef.current) return;

      if (pausedRef.current) {
        lastTsRef.current = null;
        rafRef.current = requestAnimationFrame(tickRef.current);
        return;
      }

      const target = getScrollTarget();
      if (!target || target.max <= 0) {
        rafRef.current = requestAnimationFrame(tickRef.current);
        return;
      }

      const last = lastTsRef.current ?? ts;
      const deltaSeconds = (ts - last) / 1000;
      lastTsRef.current = ts;

      const next = target.top + AUTO_SCROLL_PX_PER_SEC * deltaSeconds;
      if (next >= target.max - 1) {
        target.set(target.max);
        activeRef.current = false;
        setIsActive(false);
        return;
      }

      target.set(next);
      rafRef.current = requestAnimationFrame(tickRef.current);
    },
    [getScrollTarget]
  );

  useEffect(() => {
    tickRef.current = tick;
  }, [tick]);

  const start = useCallback(() => {
    pausedRef.current = false;
    activeRef.current = true;
    lastTsRef.current = null;
    setIsPaused(false);
    setIsActive(true);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tickRef.current);
  }, []);

  const stop = useCallback(() => {
    activeRef.current = false;
    setIsActive(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  const togglePause = useCallback(() => {
    pausedRef.current = !pausedRef.current;
    setIsPaused(pausedRef.current);
  }, []);

  // Fired by the scroll target's own wheel/touch/pointer listeners — any
  // genuine guest gesture hands control back to them instead of fighting
  // their input, but only pauses (never toggles), so a guest who scrolls
  // manually mid-ride doesn't accidentally resume it a moment later.
  const pauseForInteraction = useCallback(() => {
    if (!pausedRef.current) {
      pausedRef.current = true;
      setIsPaused(true);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return { isActive, isPaused, start, stop, togglePause, pauseForInteraction };
}
