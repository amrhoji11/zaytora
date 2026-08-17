"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Slow enough to passively read each card as it drifts by (measured against
// the reference's own auto-scroll pacing) — fast enough that a ~3000px tall
// invitation finishes in well under a minute.
const AUTO_SCROLL_PX_PER_SEC = 55;

// If the primary rAF loop hasn't advanced the scroll in this long, the
// watchdog (below) steps in and advances it directly instead.
const WATCHDOG_STALL_MS = 260;
const WATCHDOG_INTERVAL_MS = 250;

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
//
// Driven primarily by requestAnimationFrame — it's synced to the display's
// own paint cycle, which is what makes native smooth-scrolling look smooth;
// a plain timer callback can land awkwardly between paints and read as a
// faint stutter even when its own math is correct. rAF alone isn't fully
// trusted, though: some browser contexts throttle or freeze it (backgrounded
// tabs, and there's a documented history of aggressive rAF throttling in
// certain iOS in-app browsers). A lightweight setInterval watchdog runs
// alongside it purely as a dead-man's switch — it only ever advances the
// scroll itself if rAF hasn't ticked in over WATCHDOG_STALL_MS, so it never
// competes with rAF during normal operation.
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
  const watchdogRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Real wall-clock time (Date.now()) of the last successful advance —
  // shared between the rAF loop and the watchdog so each step moves by
  // exactly how much time actually elapsed, regardless of which of the two
  // drove it.
  const lastTsRef = useRef<number | null>(null);
  // Mirrors isPaused for the rAF/watchdog closures — state updates aren't
  // visible inside an already-scheduled callback, so they read this ref
  // instead of re-subscribing to state on every pause/resume.
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
        // iOS's async scroll compositor thread the way a per-frame
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

  const cleanup = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (watchdogRef.current !== null) clearInterval(watchdogRef.current);
    watchdogRef.current = null;
    if (standalone && typeof document !== "undefined") {
      document.documentElement.style.scrollBehavior = previousScrollBehaviorRef.current ?? "";
    }
  }, [standalone]);

  // Advances the scroll by however much real time has passed since the last
  // successful advance. Called from both the rAF loop and the watchdog —
  // safe to call from either (or both, in quick succession) since it always
  // measures its own elapsed time rather than assuming a fixed step.
  const advance = useCallback(() => {
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
      cleanup();
      return;
    }

    target.set(next);
  }, [getScrollTarget, cleanup]);

  const rafLoop = useCallback(() => {
    if (!activeRef.current) return;
    advance();
    if (activeRef.current) {
      rafRef.current = requestAnimationFrame(rafLoop);
    }
  }, [advance]);

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
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(rafLoop);
    if (watchdogRef.current !== null) clearInterval(watchdogRef.current);
    watchdogRef.current = setInterval(() => {
      if (!activeRef.current || pausedRef.current) return;
      const last = lastTsRef.current ?? Date.now();
      if (Date.now() - last >= WATCHDOG_STALL_MS) {
        advance();
      }
    }, WATCHDOG_INTERVAL_MS);
  }, [standalone, rafLoop, advance]);

  const stop = useCallback(() => {
    activeRef.current = false;
    setIsActive(false);
    cleanup();
  }, [cleanup]);

  const togglePause = useCallback(() => {
    pausedRef.current = !pausedRef.current;
    setIsPaused(pausedRef.current);
    // Coming back from a pause shouldn't count the paused time as elapsed
    // (it would otherwise jump the scroll forward by however long the ride
    // was paused) — resetting the timestamp here means the next advance()
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
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      if (watchdogRef.current !== null) clearInterval(watchdogRef.current);
    };
  }, []);

  return { isActive, isPaused, start, stop, togglePause, pauseForInteraction };
}
