"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { listOrders } from "@/lib/services/orders.service";
import { listPartners } from "@/lib/services/partners.service";
import { listInvitations } from "@/lib/services/invitations.service";

// Simple polling, no backend changes — each source's "latest" marker
// (a timestamp, or a running total for RSVPs) is compared against what was
// last acknowledged. Good enough for "tell me when something new shows up"
// without building a real notification table + write-side hooks into
// OrdersController/PartnersController/InvitationsController.
const POLL_INTERVAL_MS = 30_000;

interface Markers {
  orders: string; // ISO timestamp of the most recent order, "" if none
  partners: string; // ISO timestamp of the most recent partner application
  rsvp: number; // total RSVP response count across the user's own invitations
}

const EMPTY_MARKERS: Markers = { orders: "", partners: "", rsvp: 0 };

function storageKey(userId: string) {
  return `numinds_notif_seen_${userId}`;
}

function readSeenMarkers(userId: string): Markers {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return EMPTY_MARKERS;
    return { ...EMPTY_MARKERS, ...JSON.parse(raw) };
  } catch {
    return EMPTY_MARKERS;
  }
}

function writeSeenMarkers(userId: string, markers: Markers) {
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(markers));
  } catch {
    // Notifications are a nice-to-have — a full storage quota shouldn't break anything else.
  }
}

function maxIso(current: string, candidate: string | null | undefined): string {
  if (!candidate) return current;
  return candidate > current ? candidate : current;
}

// Two-tone chime synthesized with the Web Audio API — no audio file to host
// or license, and it works offline. Browsers block AudioContext playback
// until the page has seen a user gesture, so the context is created lazily
// by warmUpAudio() (call it from any early pointerdown/keydown handler)
// rather than at import time.
let audioContext: AudioContext | null = null;

export function warmUpAudio() {
  if (audioContext) return;
  try {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (Ctor) audioContext = new Ctor();
  } catch {
    // Sound is a nice-to-have — the visual badge still works without it.
  }
}

function playChime() {
  if (!audioContext) return;
  if (audioContext.state === "suspended") {
    audioContext.resume().catch(() => {});
  }
  const ctx = audioContext;
  const now = ctx.currentTime;
  [880, 1174.66].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    const start = now + i * 0.12;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.15, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.32);
  });
}

export function useAccountNotifications() {
  const { user } = useAuth();
  const [current, setCurrent] = useState<Markers>(EMPTY_MARKERS);
  const [seen, setSeen] = useState<Markers>(EMPTY_MARKERS);
  const prevRef = useRef<Markers | null>(null);

  useEffect(() => {
    if (!user) {
      // Sync local state to the "signed out" external event, not deriving
      // from prior React state — the pattern set-state-in-effect normally
      // warns about is deriving state from other state, which this isn't.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrent(EMPTY_MARKERS);
      setSeen(EMPTY_MARKERS);
      prevRef.current = null;
      return;
    }

    const initial = readSeenMarkers(user.id);
    setSeen(initial);
    setCurrent(initial);
    prevRef.current = initial;

    let cancelled = false;
    async function poll() {
      try {
        // Only the single most recent timestamp matters here, but listOrders/
        // listPartners are sorted newest-first, so page 1 always contains it
        // regardless of total row count — no need for a larger pageSize.
        const [orders, partners, invitations] = await Promise.all([
          user!.isAdmin ? listOrders() : Promise.resolve({ items: [] }),
          user!.isAdmin ? listPartners() : Promise.resolve({ items: [] }),
          listInvitations(),
        ]);
        if (cancelled) return;

        const next: Markers = {
          orders: orders.items.reduce((max, order) => maxIso(max, order.createdAt), ""),
          partners: partners.items.reduce((max, partner) => maxIso(max, partner.submittedAt), ""),
          rsvp: invitations.reduce((sum, invitation) => sum + invitation.responseCount, 0),
        };
        setCurrent(next);

        // Only chime on growth since the *previous poll*, not since the
        // last acknowledgment — otherwise it'd replay every 30s for as
        // long as the badge stays unread.
        const prev = prevRef.current ?? initial;
        if (next.orders > prev.orders || next.partners > prev.partners || next.rsvp > prev.rsvp) {
          playChime();
        }
        prevRef.current = next;
      } catch (error) {
        console.error("[notifications] poll failed:", error);
      }
    }

    poll();
    const intervalId = window.setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [user]);

  const hasNewOrders = current.orders > seen.orders;
  const hasNewPartners = current.partners > seen.partners;
  const newRsvpCount = Math.max(0, current.rsvp - seen.rsvp);
  const hasUnread = hasNewOrders || hasNewPartners || newRsvpCount > 0;

  const markAllSeen = useCallback(() => {
    if (!user) return;
    setSeen(current);
    writeSeenMarkers(user.id, current);
  }, [user, current]);

  return { hasUnread, hasNewOrders, hasNewPartners, newRsvpCount, markAllSeen };
}
