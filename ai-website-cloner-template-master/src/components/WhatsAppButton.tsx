"use client";

import { useEffect, useState } from "react";
import { WhatsAppIcon } from "@/components/icons";
import { useLanguage } from "@/context/LanguageContext";
import { getContactSettings } from "@/lib/services/contactSettings.service";

const COPY = { ar: "تواصل معنا", en: "Contact Us" };

export function WhatsAppButton() {
  const { language } = useLanguage();
  // Admin-controlled via the "WhatsApp numbers" list on /admin/settings
  // (ContactSettingsForm) -- the first entry is the number this floating
  // button links to. No numbers configured -> button doesn't render.
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getContactSettings()
      .then((settings) => {
        if (!cancelled) setPhoneNumber(settings.whatsAppNumbers[0]?.phoneNumber ?? null);
      })
      .catch(() => {
        if (!cancelled) setPhoneNumber(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!phoneNumber) return null;

  return (
    <a
      href={`https://wa.me/${phoneNumber.replace(/[^0-9]/g, "")}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-28 right-6 z-50 flex h-[52px] items-center justify-center gap-0 rounded-full bg-[#25D366] px-[14px] text-white transition-all duration-200 hover:gap-2 hover:bg-[#20BA5A]"
    >
      <WhatsAppIcon className="size-6 shrink-0" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap transition-all duration-200 group-hover:max-w-xs">
        {COPY[language]}
      </span>
    </a>
  );
}
