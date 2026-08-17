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
// timer callbacks (never during render), so it stays SSR/hydration-safe.
//
// `standalone` matches InvitationCanvas's own prop: the guest-facing page
// scrolls the window itself, while the embedded phone-bezel mockup scrolls
// its own bounded container (`containerRef`).
//
// Driven by setInterval, not requestAnimationFrame — confirmed twice now on
// real iPhone hardware (the actual test environment: Facebook Messenger's
// in-app browser) that rAF simply does not run reliably there; a version
// built around it either froze or advanced in large, sparse jumps. setInterval
// keeps ticking in that same environment. A near-frame-rate tick (16ms) is
// what keeps the steps small enough to read as a continuous glide rather
// than discrete jumps — an earlier 100ms (10fps) tick was visibly steppy on
// every device, not just the ones that throttle timers.
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
        // Direct scrollTop assignment — spec-guaranteed to bypass the
        // page's global `scroll-behavior: smooth` (reinforced by the
        // inline override in start()/stop() below), and doesn't fight
        // iOS's async scroll compositor thread the way a per-tick
        // window.scrollTo() call was found to on real-device testing.
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
    lastTsRef.current = Date.now();
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
    // Coming back from a pause shouldn't count the paused time as elapsed
    // (it would otherwise jump the scroll forward by however long the ride
    // was paused) — resetting the timestamp here means the next tick
    // measures only time since resume.
    if (!pausedRef.current) lastTsRef.current = Date.now();
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
