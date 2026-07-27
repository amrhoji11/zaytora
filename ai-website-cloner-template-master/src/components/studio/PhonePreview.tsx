"use client";

import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  HeartIcon,
  MapPinIcon,
  MusicIcon,
  PhoneIcon,
  QrCodeIcon,
} from "@/components/icons";
import type { InvitationDetail } from "@/types/studio";

function formatEventDate(iso?: string | null) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("ar", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function PhonePreview({ value }: { value: InvitationDetail }) {
  const names = [value.firstName, value.invitationType === "couple" ? value.secondName : null]
    .filter(Boolean)
    .join(" & ");
  const eventDate = formatEventDate(value.eventDateTime);

  const navItems = [
    { icon: PhoneIcon, label: "CONTACT", show: value.contacts.length > 0 },
    { icon: MusicIcon, label: "MUSIC", show: Boolean(value.musicUrl) },
    { icon: MapPinIcon, label: "LOCATION", show: value.venues.length > 0 },
    { icon: HeartIcon, label: "RSVP", show: value.enableRsvp },
  ].filter((item) => item.show);

  return (
    <div className="sticky top-24 flex flex-col items-center gap-3">
      <div className="relative w-64">
        <div className="absolute inset-0 scale-110 rounded-[3rem] bg-gold/20 blur-3xl" />
        <div className="relative rounded-[2rem] bg-gray-900 p-[3px] shadow-2xl">
          <div className="absolute left-1/2 top-1.5 z-20 h-3 w-16 -translate-x-1/2 rounded-full bg-gray-900" />
          <div className="relative flex aspect-[9/18] flex-col overflow-hidden rounded-[1.85rem] bg-gradient-to-b from-[#F5F0E8] to-white">
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
              {names ? (
                <p className="font-cinzel text-2xl text-gray-900">{names}</p>
              ) : (
                <p className="font-cinzel text-4xl text-gold/40">&amp;</p>
              )}
              {eventDate && <p className="text-xs text-gray-500">{eventDate}</p>}
              {value.thankYouText && (
                <p
                  className="mt-2 text-[10px] uppercase tracking-widest"
                  style={{ color: value.thankYouTextColor ?? "#111111" }}
                >
                  {value.thankYouText}
                </p>
              )}
              {value.enableQrEntry && <QrCodeIcon className="mt-2 size-6 text-gray-400" />}
            </div>

            {navItems.length > 0 && (
              <div className="grid grid-cols-4 border-t border-gray-100 bg-white/80 py-2 backdrop-blur">
                {navItems.map((item) => (
                  <div key={item.label} className="flex flex-col items-center gap-0.5 text-gray-500">
                    <item.icon className="size-4" />
                    <span className="text-[8px]">{item.label}</span>
                  </div>
                ))}
              </div>
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
