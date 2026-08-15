"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { XIcon } from "@/components/icons";
import { useLanguage } from "@/context/LanguageContext";

const COPY = {
  ar: {
    close: "إغلاق",
    title: "لديك دعوة سابقة",
    subtitle: "دعوة بدون عنوان",
    resume: "متابعة آخر دعوة",
    openDashboard: "فتح لوحة التحكم",
  },
  en: {
    close: "Close",
    title: "You have a previous invitation",
    subtitle: "Untitled invitation",
    resume: "Continue last invitation",
    openDashboard: "Open dashboard",
  },
};

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

// Called on logout — this key is browser-scoped, not account-scoped, so
// without clearing it here, signing out and into a different account on
// the same device would have this banner offer to "continue" the previous
// account's invitation (which the new account can't actually save changes
// to, since it doesn't own it).
export function forgetLastInvitation() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(LAST_INVITATION_KEY);
  window.sessionStorage.removeItem(DISMISSED_KEY);
}

export function DraftBanner({
  previousDraftId,
  currentInvitationId,
}: {
  previousDraftId: string | null;
  currentInvitationId?: string;
}) {
  const { language } = useLanguage();
  const t = COPY[language];
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
        aria-label={t.close}
        className="absolute left-4 top-4 text-muted-foreground transition-colors hover:text-foreground"
      >
        <XIcon className="size-4" />
      </button>
      <p className="font-medium text-foreground">{t.title}</p>
      <p className="mt-0.5 text-sm text-muted-foreground">{t.subtitle}</p>
      <div className="mt-3 flex gap-2">
        <Link
          href={`/studio?invitationId=${draftId}`}
          className="rounded-xl bg-gold px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gold/90"
        >
          {t.resume}
        </Link>
        <Link
          href="/dashboard"
          className="rounded-xl border border-border bg-background/5 px-4 py-2 text-sm font-medium text-body-foreground transition-colors hover:bg-background/10"
        >
          {t.openDashboard}
        </Link>
      </div>
    </div>
  );
}
