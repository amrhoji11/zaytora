"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  BedDoubleIcon,
  CalendarIcon,
  CameraIcon,
  ClipboardListIcon,
  HeartIcon,
  ImageIcon,
  MapPinIcon,
  MessageCircleIcon,
  MusicIcon,
  PhoneIcon,
  QrCodeIcon,
  XIcon,
} from "@/components/icons";
import { getTemplates } from "@/lib/services/templates.service";
import type { TemplateDto } from "@/types/api";
import type { InvitationDetail, VenueItem } from "@/types/studio";

function resolveMapsHref(venue: VenueItem) {
  if (venue.mapUrl) return venue.mapUrl;
  const query = [venue.name, venue.address].filter(Boolean).join(", ");
  return query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` : null;
}

// Keyed by the same `value` codes Step01Language hands out (see
// steps/Step01Language.tsx). "bilingual" reads Arabic-first, so it shares the
// Arabic RTL treatment and labels.
type InvitationLanguage = "en" | "ar" | "ro" | "fr" | "es" | "hi" | "id" | "bilingual";

const RTL_LANGUAGES = new Set<InvitationLanguage>(["ar", "bilingual"]);

const LOCALE_TAGS: Record<InvitationLanguage, string> = {
  en: "en",
  ar: "ar",
  ro: "ro",
  fr: "fr",
  es: "es",
  hi: "hi",
  id: "id",
  bilingual: "ar",
};

const NAV_LABELS: Record<InvitationLanguage, { contact: string; music: string; capture: string; location: string; rsvp: string }> = {
  ar: { contact: "تواصل", music: "موسيقى", capture: "التقاط", location: "الموقع", rsvp: "تأكيد الحضور" },
  bilingual: { contact: "تواصل", music: "موسيقى", capture: "التقاط", location: "الموقع", rsvp: "تأكيد الحضور" },
  en: { contact: "Contact", music: "Music", capture: "Capture", location: "Location", rsvp: "RSVP" },
  ro: { contact: "Contact", music: "Muzică", capture: "Captură", location: "Locație", rsvp: "Confirmare" },
  fr: { contact: "Contact", music: "Musique", capture: "Capture", location: "Lieu", rsvp: "Confirmer" },
  es: { contact: "Contacto", music: "Música", capture: "Captura", location: "Ubicación", rsvp: "Confirmar" },
  hi: { contact: "संपर्क", music: "संगीत", capture: "कैप्चर", location: "स्थान", rsvp: "उपस्थिति" },
  id: { contact: "Kontak", music: "Musik", capture: "Ambil", location: "Lokasi", rsvp: "Konfirmasi" },
};

function resolveLanguage(language?: string | null): InvitationLanguage {
  return language && language in NAV_LABELS ? (language as InvitationLanguage) : "ar";
}

function formatEventDate(iso: string | null | undefined, locale: string) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function useCountdown(iso?: string | null) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!iso) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [iso]);

  return useMemo(() => {
    if (!iso) return null;
    const target = new Date(iso).getTime();
    if (Number.isNaN(target)) return null;
    const diff = Math.max(0, target - now);
    const days = Math.floor(diff / 86_400_000);
    const hours = Math.floor((diff % 86_400_000) / 3_600_000);
    const minutes = Math.floor((diff % 3_600_000) / 60_000);
    const seconds = Math.floor((diff % 60_000) / 1000);
    return { days, hours, minutes, seconds };
  }, [iso, now]);
}

const RULES_DELIMITER = " · ";

export function PhonePreview({ value }: { value: InvitationDetail }) {
  const [templates, setTemplates] = useState<TemplateDto[]>([]);
  const [openModal, setOpenModal] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    getTemplates()
      .then((list) => {
        if (!cancelled) setTemplates(list);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const template = templates.find((item) => item.id === value.templateId) ?? null;

  const language = resolveLanguage(value.language);
  const isRtl = RTL_LANGUAGES.has(language);
  const labels = NAV_LABELS[language];

  const names = [value.firstName, value.invitationType === "couple" ? value.secondName : null]
    .filter(Boolean)
    .join(" & ");
  const eventDate = formatEventDate(value.eventDateTime, LOCALE_TAGS[language]);
  const countdown = useCountdown(value.eventDateTime);
  const rules = (value.eventRulesText ?? "").split(RULES_DELIMITER).map((rule) => rule.trim()).filter(Boolean);

  const navItems = [
    { key: "contact", icon: PhoneIcon, label: labels.contact, show: value.contacts.length > 0 },
    { key: "music", icon: MusicIcon, label: labels.music, show: Boolean(value.musicUrl) },
    { key: "capture", icon: CameraIcon, label: labels.capture, show: !value.hideCameraButton, isAction: true },
    { key: "location", icon: MapPinIcon, label: labels.location, show: value.venues.length > 0 },
    { key: "rsvp", icon: HeartIcon, label: labels.rsvp, show: value.enableRsvp },
  ].filter((item) => item.show);

  const modalTitles: Record<string, string> = {
    contact: labels.contact,
    location: labels.location,
    music: labels.music,
    rsvp: labels.rsvp,
  };

  function renderModalBody(key: string) {
    switch (key) {
      case "contact":
        return (
          <div className="space-y-2.5">
            {value.contacts.map((contact, index) => (
              <div key={index} className="flex items-center justify-between gap-2 rounded-xl bg-gray-50 px-3 py-2.5">
                <span className="text-xs font-medium text-gray-800">
                  {contact.name}
                  {contact.role ? ` (${contact.role})` : ""}
                </span>
                <span dir="ltr" className="text-xs text-gray-500">
                  {contact.phone}
                </span>
              </div>
            ))}
          </div>
        );
      case "location":
        return (
          <div className="space-y-2.5">
            {value.venues.map((venue, index) => {
              const href = resolveMapsHref(venue);
              return (
                <div key={index} className="space-y-2 rounded-xl bg-gray-50 px-3 py-2.5">
                  <p className="text-xs font-medium text-gray-800">{venue.name || "—"}</p>
                  {venue.address && <p className="text-[11px] text-gray-500">{venue.address}</p>}
                  {href && (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 rounded-lg border border-gold/40 py-1.5 text-[11px] font-medium text-gold transition-colors hover:bg-gold/5"
                    >
                      <MapPinIcon className="size-3" />
                      {isRtl ? "افتح خرائط جوجل" : "Open Google Maps"}
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        );
      case "music":
        return (
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2.5">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
                <MusicIcon className="size-3.5" />
              </span>
              <p className="truncate text-xs text-gray-700">{value.musicTitle || value.musicUrl}</p>
            </div>
            {value.musicUrl && <audio src={value.musicUrl} controls className="h-8 w-full" />}
          </div>
        );
      case "rsvp":
        return (
          <div className="space-y-3 text-center">
            <p className="text-xs text-gray-500">
              <MessageCircleIcon className="mb-0.5 inline size-3.5" /> يسعدنا تأكيد حضوركم
            </p>
            <button type="button" className="rounded-full bg-gold px-6 py-2 text-xs font-medium text-white">
              {labels.rsvp}
            </button>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="sticky top-24 flex flex-col items-center gap-3">
      <div className="relative w-64">
        <div className="absolute inset-0 scale-110 rounded-[3rem] bg-gold/20 blur-3xl" />
        <div className="relative rounded-[2.5rem] border border-gray-300 bg-gradient-to-b from-gray-400 to-gray-500 p-2 shadow-2xl">
          <div className="absolute left-1/2 top-2 z-20 h-3.5 w-24 -translate-x-1/2 rounded-full bg-black" />
          <div
            dir={isRtl ? "rtl" : "ltr"}
            lang={LOCALE_TAGS[language]}
            className={cn(
              "relative flex aspect-[9/18] flex-col overflow-hidden rounded-[2.1rem] bg-gradient-to-b from-[#F5F0E8] to-white",
              isRtl ? "text-right" : "text-left"
            )}
          >
            <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-smooth pb-20">
              {/* Hero — min-h-full so the template background fills the entire
                  phone viewport with no cream cutoff before other sections
                  come into view on scroll. */}
              <div className="relative flex min-h-full flex-col items-center justify-center gap-3 px-6 py-10 text-center">
                {template?.imageUrl && (
                  <>
                    <Image
                      src={template.imageUrl}
                      alt=""
                      fill
                      sizes="256px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/35 to-black/70" />
                  </>
                )}
                <div className="relative z-10 flex flex-col items-center gap-3">
                  {names ? (
                    <p
                      className={cn(
                        "font-cinzel text-2xl",
                        template?.imageUrl ? "text-white drop-shadow" : "text-gray-900"
                      )}
                    >
                      {names}
                    </p>
                  ) : (
                    <p className={cn("font-cinzel text-4xl", template?.imageUrl ? "text-white/80" : "text-gold/40")}>
                      &amp;
                    </p>
                  )}
                  {eventDate && (
                    <p className={cn("text-xs", template?.imageUrl ? "text-white/90" : "text-gray-500")}>
                      {eventDate}
                    </p>
                  )}
                  {countdown && (
                    <div
                      className={cn(
                        "flex items-center gap-2 rounded-full px-3 py-1 text-[10px]",
                        template?.imageUrl ? "bg-white/15 text-white" : "bg-gold/10 text-gold"
                      )}
                    >
                      <span>{countdown.days}ي</span>
                      <span>{countdown.hours}س</span>
                      <span>{countdown.minutes}د</span>
                      <span>{countdown.seconds}ث</span>
                    </div>
                  )}
                  {value.thankYouText && (
                    <p
                      className="mt-1 text-[10px] uppercase tracking-widest"
                      style={{ color: template?.imageUrl ? "#ffffff" : (value.thankYouTextColor ?? "#111111") }}
                    >
                      {value.thankYouText}
                    </p>
                  )}
                  {value.enableQrEntry && (
                    <QrCodeIcon className={cn("mt-2 size-6", template?.imageUrl ? "text-white/70" : "text-gray-400")} />
                  )}
                </div>
              </div>

              {/* Program */}
              {value.showEventProgram && value.programItems.length > 0 && (
                <div className="border-t border-gray-100 px-5 py-4">
                  <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold text-gray-700">
                    <ClipboardListIcon className="size-3.5 text-gold" />
                    برنامج الحفل
                  </p>
                  <ul className="space-y-1.5">
                    {value.programItems.map((item, index) => (
                      <li key={index} className="flex items-center justify-between text-[11px] text-gray-600">
                        <span>{item.title}</span>
                        {item.time && <span className="text-gray-400">{item.time}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Rules */}
              {value.showEventRules && rules.length > 0 && (
                <div className="border-t border-gray-100 px-5 py-4">
                  <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold text-gray-700">
                    <ClipboardListIcon className="size-3.5 text-gold" />
                    تفاصيل الحدث
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {rules.map((rule) => (
                      <span key={rule} className="rounded-full bg-gold/10 px-2 py-0.5 text-[10px] text-gold">
                        {rule}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Accommodation */}
              {value.showAccommodation && value.accommodations.length > 0 && (
                <div className="border-t border-gray-100 px-5 py-4">
                  <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold text-gray-700">
                    <BedDoubleIcon className="size-3.5 text-gold" />
                    أين تقيمون
                  </p>
                  <div className="space-y-2">
                    {value.accommodations.map((hotel, index) => (
                      <div key={index} className="rounded-lg bg-gray-50 px-2.5 py-2">
                        <p className="text-[11px] font-medium text-gray-800">{hotel.name || "—"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery */}
              {value.galleryImages.filter(Boolean).length > 0 && (
                <div className="border-t border-gray-100 px-5 py-4">
                  <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold text-gray-700">
                    <ImageIcon className="size-3.5 text-gold" />
                    معرض الصور
                  </p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {value.galleryImages.filter(Boolean).map((url, index) => (
                      <div key={index} className="aspect-square overflow-hidden rounded-md bg-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt="" className="size-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Personal message */}
              {value.showPersonalMessage && value.personalMessageText && (
                <div className="border-t border-gray-100 px-5 py-4 text-center">
                  {value.personalMessageTitle && (
                    <p className="text-[11px] font-semibold text-gray-700">{value.personalMessageTitle}</p>
                  )}
                  <p className="mt-1 text-[11px] leading-relaxed text-gray-600">{value.personalMessageText}</p>
                  {value.personalMessageSignature && (
                    <p className="mt-1 text-[10px] text-gold">{value.personalMessageSignature}</p>
                  )}
                </div>
              )}
            </div>

            {navItems.length > 0 && (
              <div
                className="absolute inset-x-3 bottom-3 z-30 grid items-center rounded-2xl border border-black/10 bg-white/60 px-1 py-2 shadow-sm backdrop-blur-md"
                style={{ gridTemplateColumns: `repeat(${navItems.length}, minmax(0, 1fr))` }}
              >
                {navItems.map((item) =>
                  item.isAction ? (
                    <button
                      key={item.key}
                      type="button"
                      className="flex min-w-0 flex-col items-center gap-0.5"
                    >
                      <span
                        className="-mt-6 flex size-[52px] shrink-0 items-center justify-center rounded-full shadow-[0_6px_24px_rgba(200,162,74,0.5),0_0_0_2px_rgba(200,162,74,0.2)]"
                        style={{ backgroundImage: "linear-gradient(135deg, #C8A24A 0%, #F0D98A 50%, #C8A24A 100%)" }}
                      >
                        <item.icon className="size-6 text-white drop-shadow-sm" />
                      </span>
                    </button>
                  ) : (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setOpenModal(item.key)}
                      className={cn(
                        "flex min-w-0 flex-col items-center gap-1 transition-colors",
                        openModal === item.key ? "text-gold" : "text-gray-800 hover:text-gold"
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-full transition-colors",
                          openModal === item.key ? "bg-gold/15" : "bg-black/[0.06]"
                        )}
                      >
                        <item.icon className="size-4" />
                      </span>
                      <span className="w-full truncate text-center text-[7px] font-medium uppercase leading-none">
                        {item.label}
                      </span>
                    </button>
                  )
                )}
              </div>
            )}

            {openModal && (
              <>
                <button
                  type="button"
                  aria-label="إغلاق"
                  onClick={() => setOpenModal(null)}
                  className="absolute inset-0 z-40 bg-black/30"
                />
                <div className="absolute inset-x-3 bottom-20 z-50 flex max-h-[55%] flex-col overflow-hidden rounded-3xl border border-white/40 bg-white/95 shadow-[0_8px_40px_rgba(0,0,0,0.18)] backdrop-blur-2xl">
                  <div className="relative flex shrink-0 items-center justify-center border-b border-gray-100/80 bg-gradient-to-r from-gray-50/60 to-white/60 px-4 py-2.5">
                    <h3 className="text-xs font-semibold tracking-wide text-gray-700">{modalTitles[openModal]}</h3>
                    <button
                      type="button"
                      onClick={() => setOpenModal(null)}
                      aria-label="إغلاق"
                      className="absolute end-3 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
                    >
                      <XIcon className="size-3.5 text-gray-500" />
                    </button>
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto p-4">{renderModalBody(openModal)}</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <p className={cn("flex items-center gap-1 text-xs text-gray-400")}>
        <CalendarIcon className="size-3" />
        معاينة مباشرة
      </p>
    </div>
  );
}
