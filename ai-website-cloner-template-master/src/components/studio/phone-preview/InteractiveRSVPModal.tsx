"use client";

import { useState } from "react";
import { CheckIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { ApiError } from "@/lib/api/client";
import { submitRsvp } from "@/lib/services/invitations.service";
import type { InvitationDetail } from "@/types/studio";

const COPY = {
  ar: {
    name: "الاسم",
    going: "بإذن الله حاضر",
    notGoing: "أعتذر عن الحضور",
    guests: "عدد الحضور",
    message: "رسالة (اختياري)",
    submit: "إرسال",
    thanks: "شكراً لتأكيدكم!",
    previewNotice: "هذه معاينة فقط، لم يتم حفظ أي بيانات.",
    guestLimitReached: "عذراً، وصل عدد الحضور للحد الأقصى المسموح به لهذه المناسبة.",
  },
  en: {
    name: "Guest name",
    going: "Going",
    notGoing: "Not going",
    guests: "Guests",
    message: "Message (optional)",
    submit: "Submit",
    thanks: "Thanks for confirming!",
    previewNotice: "This is only a preview — nothing was saved.",
    guestLimitReached: "Sorry, this event has reached its maximum guest capacity.",
  },
};

export function InteractiveRSVPModal({
  value,
  isRtl,
  readOnly = false,
}: {
  value: InvitationDetail;
  isRtl: boolean;
  // See InvitationCanvas's readOnly doc comment — true for the mock catalog
  // preview and the designer's own "?preview=true" draft preview, both of
  // which have no real guest behind the form. Skips the actual
  // POST /invitations/{id}/rsvp call while still showing the thank-you
  // state, so the flow still demos end-to-end without writing fake data
  // into a real invitation's RSVP list.
  readOnly?: boolean;
}) {
  const t = isRtl ? COPY.ar : COPY.en;
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState<"yes" | "no" | null>(null);
  const [guestCount, setGuestCount] = useState(1);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [limitReached, setLimitReached] = useState(false);

  async function handleSubmit() {
    if (readOnly) {
      setSubmitted(true);
      return;
    }

    setSubmitting(true);
    try {
      await submitRsvp(value.id, {
        guestName: name,
        attending: value.rsvpShowAttendance ? attendance === "yes" : null,
        guestCount: value.rsvpShowGuestCount && attendance === "yes" ? guestCount : null,
        message: value.rsvpShowMessage ? message : null,
      });
      setSubmitted(true);
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        // A real business rejection (event is at capacity) — the response
        // was NOT saved, so telling the guest "thanks" would be a lie.
        setLimitReached(true);
      } else {
        // The guest already filled out the form — don't strand them behind
        // a network hiccup, just log it and still show the thank-you state.
        console.error("[rsvp] failed to submit response:", error);
        setSubmitted(true);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (limitReached) {
    return (
      <div className="flex flex-col items-center gap-2 py-6 text-center">
        <p className="text-sm font-medium text-gray-800">{t.guestLimitReached}</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-2 py-6 text-center">
        <span className="flex size-10 items-center justify-center rounded-full bg-gold/10 text-gold">
          <CheckIcon className="size-5" />
        </span>
        <p className="text-sm font-medium text-gray-800">{t.thanks}</p>
        {readOnly && <p className="text-xs text-gray-400">{t.previewNotice}</p>}
      </div>
    );
  }

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
    >
      <input
        type="text"
        required
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder={t.name}
        // Explicit colors, not inherited — this modal's sheet is always
        // white (InvitationCanvas's bg-white/95), but body text defaults to
        // near-white in dark mode (globals.css --foreground), so an
        // unstyled input reads as invisible white-on-white there even
        // though it looks fine in light mode.
        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-800 outline-none placeholder:text-gray-400 focus:border-gold"
      />

      {value.rsvpShowAttendance && (
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setAttendance("yes")}
            className={cn(
              "rounded-xl border-2 py-2 text-xs font-medium transition-colors",
              attendance === "yes" ? "border-gold bg-gold/10 text-gold" : "border-gray-200 text-gray-600"
            )}
          >
            {t.going}
          </button>
          <button
            type="button"
            onClick={() => setAttendance("no")}
            className={cn(
              "rounded-xl border-2 py-2 text-xs font-medium transition-colors",
              attendance === "no" ? "border-gray-400 bg-gray-100 text-gray-700" : "border-gray-200 text-gray-600"
            )}
          >
            {t.notGoing}
          </button>
        </div>
      )}

      {value.rsvpShowGuestCount && attendance === "yes" && (
        <div className="flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2">
          <span className="text-xs text-gray-600">{t.guests}</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setGuestCount((count) => Math.max(1, count - 1))}
              className="flex size-6 items-center justify-center rounded-full bg-gray-100 text-gray-600"
            >
              −
            </button>
            <span className="min-w-4 text-center text-xs text-gray-800">{guestCount}</span>
            <button
              type="button"
              onClick={() =>
                setGuestCount((count) => (value.guestLimit ? Math.min(value.guestLimit, count + 1) : count + 1))
              }
              className="flex size-6 items-center justify-center rounded-full bg-gray-100 text-gray-600"
            >
              +
            </button>
          </div>
        </div>
      )}

      {value.rsvpShowMessage && (
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder={t.message}
          rows={2}
          className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-800 outline-none placeholder:text-gray-400 focus:border-gold"
        />
      )}

      <button
        type="submit"
        disabled={submitting || (value.rsvpShowAttendance && !attendance)}
        className="w-full rounded-full bg-gold py-2 text-xs font-medium text-white transition-opacity disabled:opacity-40"
      >
        {t.submit}
      </button>
    </form>
  );
}
