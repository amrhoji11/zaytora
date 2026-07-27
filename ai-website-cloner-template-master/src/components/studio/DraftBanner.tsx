"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { XIcon } from "@/components/icons";

const LAST_INVITATION_KEY = "numinds:lastInvitationId";
const DISMISSED_KEY = "numinds:draftBannerDismissed";

export function rememberInvitation(id: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LAST_INVITATION_KEY, id);
}

// Reads the last-remembered invitation id. Must be captured BEFORE this
// page load's own rememberInvitation() call overwrites it, so callers
// should read this once (e.g. via a lazy useState initializer) at the
// very top of the tree, ahead of any effect that saves the current draft.
export function readLastInvitationId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(LAST_INVITATION_KEY);
}

export function DraftBanner({
  previousDraftId,
  currentInvitationId,
}: {
  previousDraftId: string | null;
  currentInvitationId?: string;
}) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // One-time read of browser-only storage after mount (SSR has no
    // window/sessionStorage) — not a subscription, so there's nothing to
    // "sync" beyond this single read.
    const alreadyDismissed = window.sessionStorage.getItem(DISMISSED_KEY) === "1";
    if (alreadyDismissed) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDismissed(true);
    }
  }, []);

  const draftId = previousDraftId && previousDraftId !== currentInvitationId ? previousDraftId : null;

  if (!draftId || dismissed) return null;

  function dismiss() {
    window.sessionStorage.setItem(DISMISSED_KEY, "1");
    setDismissed(true);
  }

  return (
    <div className="relative mb-6 rounded-2xl border border-gold/30 bg-gold/5 p-4">
      <button
        type="button"
        onClick={dismiss}
        aria-label="إغلاق"
        className="absolute left-4 top-4 text-gray-400 transition-colors hover:text-gray-600"
      >
        <XIcon className="size-4" />
      </button>
      <p className="font-medium text-gray-900">لديك دعوة سابقة</p>
      <p className="mt-0.5 text-sm text-gray-500">دعوة بدون عنوان</p>
      <div className="mt-3 flex gap-2">
        <Link
          href={`/studio?invitationId=${draftId}`}
          className="rounded-xl bg-gold px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gold/90"
        >
          متابعة آخر دعوة
        </Link>
        <Link
          href="/dashboard"
          className="rounded-xl border border-gold/30 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gold/5"
        >
          فتح لوحة التحكم
        </Link>
      </div>
    </div>
  );
}
