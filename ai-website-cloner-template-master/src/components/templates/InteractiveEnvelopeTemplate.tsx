"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { LazyMotion, domAnimation, m, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { CalendarIcon, CheckIcon, MapPinIcon, MusicIcon, SparklesIcon } from "@/components/icons";

export interface InteractiveEnvelopeTemplateProps {
  waxSealColor?: string;
  envelopeBg?: string;
  monogramText?: string;
  groomName: string;
  brideName: string;
  date: string; // ISO string — drives both the formatted date and the live countdown
  venue?: string;
  heroImage: string;
  galleryImages?: string[];
  musicUrl?: string;
  language?: "ar" | "en";
  onRsvpSubmit?: (data: { name: string; attending: "yes" | "no"; guests: number }) => void;
  className?: string;
}

type Stage = "sealed" | "opening" | "revealed";

// Stage 1 (envelope/flap/seal) is driven by plain CSS transitions/keyframes
// rather than framer-motion — that stage gates whether the guest ever sees
// the invitation at all, so it can't depend on a JS animation library's
// completion callback firing. These constants are the single source of
// truth for both the CSS transition-delay/duration values below AND the
// setTimeout that reliably advances the stage machine even if the browser
// never fires a single animation event (reduced motion, a throttled tab,
// whatever) — the content still reveals on schedule either way.
const FLAP_OPEN_DELAY_MS = 300;
const FLAP_OPEN_DURATION_MS = 900;
const ENVELOPE_FADE_DELAY_MS = 1100;
const ENVELOPE_FADE_DURATION_MS = 400;
const REVEAL_AT_MS = ENVELOPE_FADE_DELAY_MS + ENVELOPE_FADE_DURATION_MS;

const COPY = {
  ar: {
    tapToOpen: "اضغط لفتح الدعوة",
    countdownLabels: { days: "أيام", hours: "ساعات", minutes: "دقائق", seconds: "ثواني" },
    rsvpTitle: "تأكيد الحضور",
    namePlaceholder: "اسمك الكامل",
    attendingYes: "سأحضر بكل سرور",
    attendingNo: "لا أستطيع الحضور",
    guestsLabel: "عدد الضيوف",
    submit: "إرسال التأكيد",
    submitted: "شكراً لتأكيدكم!",
    toggleMusicAria: "تشغيل/إيقاف الموسيقى",
  },
  en: {
    tapToOpen: "Tap to open your invitation",
    countdownLabels: { days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds" },
    rsvpTitle: "RSVP",
    namePlaceholder: "Your full name",
    attendingYes: "Joyfully accept",
    attendingNo: "Regretfully decline",
    guestsLabel: "Guests",
    submit: "Send RSVP",
    submitted: "Thank you for your RSVP!",
    toggleMusicAria: "Toggle music",
  },
};

// Simple, self-contained ticking countdown — no external state needed
// beyond the target ISO date, re-derives days/hours/minutes/seconds once a
// second while mounted.
function useCountdown(iso: string) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  return useMemo(() => {
    const target = new Date(iso).getTime();
    if (Number.isNaN(target)) return null;
    const diff = Math.max(0, target - now);
    return {
      days: Math.floor(diff / 86_400_000),
      hours: Math.floor((diff % 86_400_000) / 3_600_000),
      minutes: Math.floor((diff % 3_600_000) / 60_000),
      seconds: Math.floor((diff % 60_000) / 1000),
    };
  }, [iso, now]);
}

function formatEventDate(iso: string, locale: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(locale, { weekday: "long", year: "numeric", month: "long", day: "numeric" }).format(date);
}

// Stage 2 & 3 (card extraction + staggered reveal) are cosmetic polish on
// top of content that's already mounted and functional — safe to leave on
// framer-motion (via the lighter LazyMotion/`m` bundle) since a stalled
// animation here just means the content appears instantly instead of
// sliding in, not that it never appears at all.
const cardVariants: Variants = {
  hidden: { y: 100, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

const heroImageVariants: Variants = {
  hidden: { scale: 1.05 },
  visible: { scale: 1, transition: { duration: 1.4, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
};

const staggerItem: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

export function InteractiveEnvelopeTemplate({
  waxSealColor = "#C8A24A",
  envelopeBg = "linear-gradient(135deg, #FBF7EF 0%, #F0E4CC 100%)",
  monogramText,
  groomName,
  brideName,
  date,
  venue,
  heroImage,
  galleryImages = [],
  musicUrl,
  language = "ar",
  onRsvpSubmit,
  className,
}: InteractiveEnvelopeTemplateProps) {
  const t = COPY[language];
  const dir = language === "ar" ? "rtl" : "ltr";
  const [stage, setStage] = useState<Stage>("sealed");
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [rsvpName, setRsvpName] = useState("");
  const [rsvpAttending, setRsvpAttending] = useState<"yes" | "no" | null>(null);
  const [rsvpGuests, setRsvpGuests] = useState(1);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  useEffect(() => {
    return () => {
      if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
    };
  }, []);

  const countdown = useCountdown(date);
  const eventDateLabel = useMemo(
    () => formatEventDate(date, language === "ar" ? "ar-EG" : "en-US"),
    [date, language]
  );
  const initials = monogramText ?? `${brideName.charAt(0)}${groomName.charAt(0)}`;

  function handleOpen() {
    if (stage !== "sealed") return;
    setStage("opening");
    // The seal/flap/envelope CSS transitions play visually in the
    // background, but this timeout — not their completion — is what's
    // guaranteed to advance the stage and reveal the invitation.
    revealTimerRef.current = setTimeout(() => setStage("revealed"), REVEAL_AT_MS);
    if (musicUrl && audioRef.current) {
      audioRef.current
        .play()
        .then(() => setMusicPlaying(true))
        .catch(() => {
          // Autoplay can still be blocked depending on browser policy —
          // the floating toggle button lets the guest start it manually.
        });
    }
  }

  function toggleMusic() {
    if (!audioRef.current) return;
    if (musicPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setMusicPlaying((playing) => !playing);
  }

  function handleRsvpSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!rsvpName.trim() || !rsvpAttending) return;
    onRsvpSubmit?.({ name: rsvpName.trim(), attending: rsvpAttending, guests: rsvpGuests });
    setRsvpSubmitted(true);
  }

  const countdownEntries = countdown
    ? ([
        [countdown.days, t.countdownLabels.days],
        [countdown.hours, t.countdownLabels.hours],
        [countdown.minutes, t.countdownLabels.minutes],
        [countdown.seconds, t.countdownLabels.seconds],
      ] as const)
    : null;

  return (
    <div
      dir={dir}
      className={cn(
        "relative mx-auto w-full min-w-[375px] max-w-[430px] overflow-hidden rounded-[2.5rem] bg-black shadow-2xl",
        className
      )}
      style={{ aspectRatio: "9 / 19.5" }}
    >
      {musicUrl && <audio ref={audioRef} src={musicUrl} loop />}

      {/* Stage 1 — Envelope & wax seal intro (plain CSS transitions/keyframes,
          not framer-motion — see the comment on the *_MS constants above) */}
      {stage !== "revealed" && (
        <button
          type="button"
          onClick={handleOpen}
          aria-label={t.tapToOpen}
          className={cn(
            "absolute inset-0 z-20 flex flex-col items-center justify-center transition-opacity ease-in-out",
            stage === "opening" ? "pointer-events-none opacity-0" : "opacity-100"
          )}
          style={{
            background: envelopeBg,
            perspective: 1000,
            transitionDuration: `${ENVELOPE_FADE_DURATION_MS}ms`,
            transitionDelay: stage === "opening" ? `${ENVELOPE_FADE_DELAY_MS}ms` : "0ms",
          }}
        >
          {/* 3D top flap — rotates back and up around its top edge */}
          <div
            className="absolute inset-x-0 top-0 h-1/2 ease-[cubic-bezier(0.65,0,0.35,1)]"
            style={{
              transformOrigin: "top center",
              transformStyle: "preserve-3d",
              transform: stage === "opening" ? "rotateX(-180deg)" : "rotateX(0deg)",
              transitionProperty: "transform",
              transitionDuration: `${FLAP_OPEN_DURATION_MS}ms`,
              transitionDelay: stage === "opening" ? `${FLAP_OPEN_DELAY_MS}ms` : "0ms",
            }}
          >
            <div
              className="h-full w-full"
              style={{
                background: envelopeBg,
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
              }}
            />
          </div>

          <div className="absolute inset-x-10 bottom-16 h-px bg-black/10" />

          {/* Wax seal badge — native @keyframes (see globals.css), so it
              plays even if a JS animation loop is starved */}
          <div
            className={cn(
              "relative z-10 flex size-20 items-center justify-center rounded-full text-white shadow-lg",
              stage === "opening" && "[animation:sealDissolve_0.6s_ease-in-out_forwards]"
            )}
            style={{ backgroundColor: waxSealColor }}
          >
            <span className="font-cinzel text-xl">{initials}</span>
          </div>

          <p className="relative z-10 mt-6 text-xs uppercase tracking-[0.3em] text-muted-foreground">{t.tapToOpen}</p>
        </button>
      )}

      {/* Stage 2 & 3 — Card extraction + staggered details reveal */}
      {stage === "revealed" && (
        <LazyMotion features={domAnimation} strict={false}>
          <m.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="absolute inset-0 overflow-y-auto bg-background"
          >
            <div className="relative h-[52%] w-full overflow-hidden">
              <m.div variants={heroImageVariants} initial="hidden" animate="visible" className="absolute inset-0">
                <Image
                  src={heroImage}
                  alt={`${brideName} & ${groomName}`}
                  fill
                  className="object-cover"
                  sizes="430px"
                  priority
                />
              </m.div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

              {musicUrl && (
                <button
                  type="button"
                  onClick={toggleMusic}
                  aria-label={t.toggleMusicAria}
                  className="absolute top-4 end-4 z-10 flex size-9 items-center justify-center rounded-full bg-background/20 text-white backdrop-blur-md transition-colors hover:bg-background/30"
                >
                  <MusicIcon className={cn("size-4", musicPlaying && "animate-pulse")} />
                </button>
              )}
            </div>

            <m.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="relative z-10 -mt-8 space-y-6 rounded-t-[2rem] bg-background px-6 pb-10 pt-8 text-center"
            >
              <m.div variants={staggerItem} className="flex justify-center text-[#C8A24A]">
                <SparklesIcon className="size-6" />
              </m.div>

              <m.p variants={staggerItem} className="font-cinzel text-2xl font-semibold text-foreground">
                {brideName} <span className="text-[#C8A24A]">&</span> {groomName}
              </m.p>

              <m.div variants={staggerItem} className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <CalendarIcon className="size-4" />
                <span>{eventDateLabel}</span>
              </m.div>

              {venue && (
                <m.div variants={staggerItem} className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <MapPinIcon className="size-4" />
                  <span>{venue}</span>
                </m.div>
              )}

              {countdownEntries && (
                <m.div variants={staggerItem} className="grid grid-cols-4 gap-2">
                  {countdownEntries.map(([value, label]) => (
                    <div key={label} className="rounded-xl bg-[#C8A24A]/10 p-3">
                      <p className="font-cinzel text-lg font-semibold text-foreground">{String(value).padStart(2, "0")}</p>
                      <p className="mt-0.5 text-[10px] uppercase tracking-wide text-gray-400">{label}</p>
                    </div>
                  ))}
                </m.div>
              )}

              {galleryImages.length > 0 && (
                <m.div variants={staggerItem} className="flex gap-2 overflow-x-auto pb-1">
                  {galleryImages.map((src, index) => (
                    <div key={`${src}-${index}`} className="relative size-20 shrink-0 overflow-hidden rounded-xl">
                      <Image src={src} alt="" fill className="object-cover" sizes="80px" />
                    </div>
                  ))}
                </m.div>
              )}

              <m.form
                variants={staggerItem}
                onSubmit={handleRsvpSubmit}
                className="space-y-3 rounded-2xl border border-border p-4 text-start"
              >
                <p className="text-center text-sm font-semibold text-foreground">{t.rsvpTitle}</p>
                {rsvpSubmitted ? (
                  <p className="flex items-center justify-center gap-2 py-2 text-sm text-emerald-600">
                    <CheckIcon className="size-4" />
                    {t.submitted}
                  </p>
                ) : (
                  <>
                    <input
                      value={rsvpName}
                      onChange={(event) => setRsvpName(event.target.value)}
                      placeholder={t.namePlaceholder}
                      className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[#C8A24A]"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setRsvpAttending("yes")}
                        className={cn(
                          "flex-1 rounded-xl border px-3 py-2 text-xs font-medium transition-colors",
                          rsvpAttending === "yes"
                            ? "border-[#C8A24A] bg-[#C8A24A]/10 text-[#A68832]"
                            : "border-border text-body-foreground hover:border-border"
                        )}
                      >
                        {t.attendingYes}
                      </button>
                      <button
                        type="button"
                        onClick={() => setRsvpAttending("no")}
                        className={cn(
                          "flex-1 rounded-xl border px-3 py-2 text-xs font-medium transition-colors",
                          rsvpAttending === "no"
                            ? "border-rose-300 bg-rose-50 text-rose-600"
                            : "border-border text-body-foreground hover:border-border"
                        )}
                      >
                        {t.attendingNo}
                      </button>
                    </div>
                    {rsvpAttending === "yes" && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-body-foreground">{t.guestsLabel}</span>
                        <input
                          type="number"
                          min={1}
                          max={10}
                          value={rsvpGuests}
                          onChange={(event) => setRsvpGuests(Number(event.target.value))}
                          className="w-16 rounded-lg border border-border px-2 py-1 text-center text-sm outline-none focus:border-[#C8A24A]"
                        />
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={!rsvpName.trim() || !rsvpAttending}
                      className="w-full rounded-xl bg-[#C8A24A] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#A68832] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {t.submit}
                    </button>
                  </>
                )}
              </m.form>
            </m.div>
          </m.div>
        </LazyMotion>
      )}
    </div>
  );
}
