"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  BedDoubleIcon,
  CameraIcon,
  ClipboardListIcon,
  GiftIcon,
  HeartIcon,
  ImageIcon,
  MapPinIcon,
  MusicIcon,
  PhoneIcon,
  QrCodeIcon,
  XIcon,
} from "@/components/icons";
import { getTemplates } from "@/lib/services/templates.service";
import { findPresetTrackByUrl } from "@/lib/musicLibrary";
import type { TemplateDto } from "@/types/api";
import type { InvitationDetail } from "@/types/studio";
import { BottomBar, type BottomBarItem } from "./BottomBar";
import { MusicPlayerModal } from "./MusicPlayerModal";
import { InteractiveRSVPModal } from "./InteractiveRSVPModal";
import { LocationModal } from "./LocationModal";
import { ContactModal } from "./ContactModal";
import { GiftModal } from "./GiftModal";
import { CameraOverlay } from "./CameraOverlay";

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

const NAV_LABELS: Record<
  InvitationLanguage,
  { contact: string; music: string; capture: string; location: string; rsvp: string; gift: string }
> = {
  ar: { contact: "تواصل", music: "موسيقى", capture: "التقاط", location: "الموقع", rsvp: "تأكيد الحضور", gift: "هدية" },
  bilingual: { contact: "تواصل", music: "موسيقى", capture: "التقاط", location: "الموقع", rsvp: "تأكيد الحضور", gift: "هدية" },
  en: { contact: "Contact", music: "Music", capture: "Capture", location: "Location", rsvp: "RSVP", gift: "Gift" },
  ro: { contact: "Contact", music: "Muzică", capture: "Captură", location: "Locație", rsvp: "Confirmare", gift: "Cadou" },
  fr: { contact: "Contact", music: "Musique", capture: "Capture", location: "Lieu", rsvp: "Confirmer", gift: "Cadeau" },
  es: { contact: "Contacto", music: "Música", capture: "Captura", location: "Ubicación", rsvp: "Confirmar", gift: "Regalo" },
  hi: { contact: "संपर्क", music: "संगीत", capture: "कैप्चर", location: "स्थान", rsvp: "उपस्थिति", gift: "उपहार" },
  id: { contact: "Kontak", music: "Musik", capture: "Ambil", location: "Lokasi", rsvp: "Konfirmasi", gift: "Hadiah" },
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

// Sections float as translucent cards over the persistent full-height
// template canvas (see the scroll container below), instead of flush rows
// that assumed a plain white background.
const SECTION_CARD = "mx-3 my-2 rounded-2xl border border-white/60 bg-white/85 p-4 shadow-sm backdrop-blur-sm";

// The actual invitation content + bottom nav + modals — shared by the small
// phone-bezel mockup (PhonePreview) and the full-screen preview overlay, so
// both surfaces render exactly the same guest-facing experience instead of
// two versions that can drift apart.
export function InvitationCanvas({ value, className }: { value: InvitationDetail; className?: string }) {
  const [templates, setTemplates] = useState<TemplateDto[]>([]);
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
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
  const familyNames = value.hideFamilyNames
    ? ""
    : [value.familyName1, value.familyName2].filter(Boolean).join(" & ");
  const eventDate = formatEventDate(value.eventDateTime, LOCALE_TAGS[language]);
  const countdown = useCountdown(value.eventDateTime);
  const rules = (value.eventRulesText ?? "").split(RULES_DELIMITER).map((rule) => rule.trim()).filter(Boolean);

  const navItems: BottomBarItem[] = [
    { key: "contact", icon: PhoneIcon, label: labels.contact, show: value.contacts.length > 0 },
    { key: "music", icon: MusicIcon, label: labels.music, show: Boolean(value.musicUrl) },
    { key: "capture", icon: CameraIcon, label: labels.capture, show: !value.hideCameraButton, isAction: true },
    { key: "location", icon: MapPinIcon, label: labels.location, show: value.venues.length > 0 },
    { key: "gift", icon: GiftIcon, label: labels.gift, show: value.enableGifts },
    { key: "rsvp", icon: HeartIcon, label: labels.rsvp, show: value.enableRsvp },
  ];

  const modalTitles: Record<string, string> = {
    contact: labels.contact,
    location: labels.location,
    music: labels.music,
    gift: labels.gift,
    rsvp: labels.rsvp,
  };

  function handleNavSelect(key: string) {
    if (key === "capture") {
      setCameraOpen(true);
    } else {
      setOpenModal(key);
    }
  }

  function renderModalBody(key: string) {
    switch (key) {
      case "contact":
        return <ContactModal contacts={value.contacts} />;
      case "location":
        return <LocationModal venues={value.venues} openMapsLabel={isRtl ? "افتح خرائط جوجل" : "Open Google Maps"} />;
      case "music": {
        const preset = findPresetTrackByUrl(value.musicUrl);
        return (
          <MusicPlayerModal
            title={value.musicTitle}
            url={value.musicUrl}
            coverImageUrl={template?.imageUrl}
            coverColor={preset?.color}
            fallbackLabel={labels.music}
          />
        );
      }
      case "gift":
        return <GiftModal value={value} isRtl={isRtl} />;
      case "rsvp":
        return <InteractiveRSVPModal value={value} isRtl={isRtl} />;
      default:
        return null;
    }
  }

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      lang={LOCALE_TAGS[language]}
      className={cn(
        "relative flex flex-col overflow-hidden bg-gradient-to-b from-[#F5F0E8] to-white",
        isRtl ? "text-right" : "text-left",
        className
      )}
    >
      {/* Scrollable canvas: the template image + its darkening overlay are
          absolutely sized to match the *entire* content height below (not
          just the hero), so the background never runs out and shows a cream
          gap, no matter how far the user scrolls. */}
      <div ref={scrollRef} className="relative flex-1 overflow-y-auto scroll-smooth">
        {template?.imageUrl && (
          <>
            <Image src={template.imageUrl} alt="" fill sizes="480px" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/35 to-black/70" />
          </>
        )}

        <div className="relative z-10 pb-20">
          {/* Hero */}
          <div className="flex min-h-full flex-col items-center justify-center gap-3 px-6 py-10 text-center">
            {familyNames && (
              <p
                className={cn(
                  "text-[11px] tracking-wide",
                  value.familyNamesFont || "font-cinzel",
                  template?.imageUrl ? "text-white/80" : "text-gray-500"
                )}
              >
                {familyNames}
              </p>
            )}
            {value.eventTitle && (
              <p
                className={cn(
                  "text-sm",
                  value.eventTitleFont || "font-cinzel",
                  template?.imageUrl ? "text-white/90" : "text-gold"
                )}
              >
                {value.eventTitle}
              </p>
            )}
            {names ? (
              <p
                className={cn(
                  "text-2xl",
                  value.namesFont || "font-cinzel",
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
            {value.invitationText && (
              <p
                className={cn(
                  "max-w-[85%] text-[11px] leading-relaxed",
                  value.generalTextFont || "font-sans",
                  template?.imageUrl ? "text-white/85" : "text-gray-600"
                )}
              >
                {value.invitationText}
              </p>
            )}
            {eventDate && (
              <p className={cn("text-xs", template?.imageUrl ? "text-white/90" : "text-gray-500")}>{eventDate}</p>
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

          {/* Program */}
          {value.showEventProgram && value.programItems.length > 0 && (
            <div className={SECTION_CARD}>
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
            <div className={SECTION_CARD}>
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
            <div className={SECTION_CARD}>
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
            <div className={SECTION_CARD}>
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
            <div className={cn(SECTION_CARD, "text-center")}>
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
      </div>

      <BottomBar items={navItems} activeKey={openModal} onSelect={handleNavSelect} />

      {openModal && (
        <>
          <button
            type="button"
            aria-label="إغلاق"
            onClick={() => setOpenModal(null)}
            className="absolute inset-0 z-40 bg-black/30"
          />
          <div className="absolute inset-x-3 bottom-20 z-50 flex max-h-[70%] flex-col overflow-hidden rounded-3xl border border-white/40 bg-white/95 shadow-[0_8px_40px_rgba(0,0,0,0.18)] backdrop-blur-2xl">
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

      {cameraOpen && <CameraOverlay isRtl={isRtl} onClose={() => setCameraOpen(false)} />}
    </div>
  );
}
