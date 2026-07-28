"use client";

import { useState } from "react";
import { CheckIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
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
  },
  en: {
    name: "Guest name",
    going: "Going",
    notGoing: "Not going",
    guests: "Guests",
    message: "Message (optional)",
    submit: "Submit",
    thanks: "Thanks for confirming!",
  },
};

export function InteractiveRSVPModal({ value, isRtl }: { value: InvitationDetail; isRtl: boolean }) {
  const t = isRtl ? COPY.ar : COPY.en;
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState<"yes" | "no" | null>(null);
  const [guestCount, setGuestCount] = useState(1);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-2 py-6 text-center">
        <span className="flex size-10 items-center justify-center rounded-full bg-gold/10 text-gold">
          <CheckIcon className="size-5" />
        </span>
        <p className="text-sm font-medium text-gray-800">{t.thanks}</p>
      </div>
    );
  }

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <input
        type="text"
        required
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder={t.name}
        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-gold"
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
            <span className="w-4 text-center text-xs">{guestCount}</span>
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
          className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-gold"
        />
      )}

      <button
        type="submit"
        disabled={value.rsvpShowAttendance && !attendance}
        className="w-full rounded-full bg-gold py-2 text-xs font-medium text-white transition-opacity disabled:opacity-40"
      >
        {t.submit}
      </button>
    </form>
  );
}
