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

  // Interval (ms) the ride advances on. Deliberately *not* rAF — this needs
  // to keep ticking reliably inside iOS in-app browsers (Messenger,
  // Instagram, etc.), which have a documented history of throttling
  // requestAnimationFrame far more aggressively than setInterval for an
  // actively-visible page. Must stay close to a real frame interval (~60fps)
  // though — the earlier 100ms (10fps) tick advanced the scroll position in
  // visibly discrete ~5.5px jumps instead of a continuous glide, which read
  // as trembling/jittering on every device, not just the ones rAF throttles.
  const TICK_MS = 16;

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTsRef = useRef<number | null>(null);
  // Mirrors isPaused for the interval loop's closure — state updates aren't
  // visible inside an already-scheduled callback, so the loop reads this
  // ref instead of re-subscribing to state on every pause/resume.
  const pausedRef = useRef(false);
  const activeRef = useRef(false);
  // Whichever scroll-behavior override was in place before the ride
  // started (standalone only) — restored once the ride stops/finishes so
  // it doesn't permanently disable smooth scrolling for anything else
  // (anchor links, scrollIntoView, etc.) on the page.
  const previousScrollBehaviorRef = useRef<string | null>(null);

  const getScrollTarget = useCallback((): ScrollTarget | null => {
    if (standalone) {
      if (typeof window === "undefined") return null;
      return {
        top: window.scrollY,
        max: document.documentElement.scrollHeight - window.innerHeight,
        // Direct scrollTop assignment only — no window.scrollTo() fallback.
        // scrollTo() used to be included as a third redundant write (the
        // page has a global `scroll-behavior: smooth`, and older browsers
        // were inconsistent about honoring direct scrollTop), but on real
        // iPhone testing calling scrollTo() on every ~16ms tick fought with
        // iOS's own async scroll compositor thread and produced a faint,
        // persistent jitter that direct scrollTop alone doesn't have. The
        // inline scrollBehavior override below (set in start(), restored in
        // stop()) already neutralizes the CSS smooth-scroll class, so the
        // scrollTo() fallback isn't needed to bypass it anymore.
        set: (value) => {
          document.documentElement.scrollTop = value;
          document.body.scrollTop = value;
        },
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

  const tick = useCallback(() => {
    if (!activeRef.current || pausedRef.current) return;

    const target = getScrollTarget();
    if (!target || target.max <= 0) return;

    const now = Date.now();
    const last = lastTsRef.current ?? now;
    const deltaSeconds = (now - last) / 1000;
    lastTsRef.current = now;

    const next = target.top + AUTO_SCROLL_PX_PER_SEC * deltaSeconds;
    if (next >= target.max - 1) {
      target.set(target.max);
      activeRef.current = false;
      setIsActive(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    target.set(next);
  }, [getScrollTarget]);

  const start = useCallback(() => {
    pausedRef.current = false;
    activeRef.current = true;
    lastTsRef.current = null;
    setIsPaused(false);
    setIsActive(true);
    if (standalone && typeof document !== "undefined") {
      previousScrollBehaviorRef.current = document.documentElement.style.scrollBehavior || null;
      document.documentElement.style.scrollBehavior = "auto";
    }
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(tick, TICK_MS);
  }, [standalone, tick]);

  const stop = useCallback(() => {
    activeRef.current = false;
    setIsActive(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (standalone && typeof document !== "undefined") {
      document.documentElement.style.scrollBehavior = previousScrollBehaviorRef.current ?? "";
    }
  }, [standalone]);

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
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { isActive, isPaused, start, stop, togglePause, pauseForInteraction };
}
