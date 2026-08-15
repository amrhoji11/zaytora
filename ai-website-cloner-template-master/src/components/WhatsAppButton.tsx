"use client";

import { WhatsAppIcon } from "@/components/icons";
import { useLanguage } from "@/context/LanguageContext";

const COPY = { ar: "تواصل معنا", en: "Contact Us" };

export function WhatsAppButton() {
  const { language } = useLanguage();

  return (
    <a
      href="https://wa.me/966500000000"
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
