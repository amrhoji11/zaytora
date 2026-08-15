"use client";

import { useEffect } from "react";
import Image from "next/image";
import { XIcon } from "@/components/icons";
import { useLanguage } from "@/context/LanguageContext";

interface InvitationPreviewModalProps {
  open: boolean;
  onClose: () => void;
}

const COPY = {
  ar: { dialogLabel: "معاينة نموذج الدعوة", closeLabel: "إغلاق المعاينة", imageAlt: "نموذج الدعوة" },
  en: { dialogLabel: "Sample invitation preview", closeLabel: "Close preview", imageAlt: "Sample invitation" },
};

export function InvitationPreviewModal({ open, onClose }: InvitationPreviewModalProps) {
  const { language } = useLanguage();
  const t = COPY[language];
  useEffect(() => {
    if (!open) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.dialogLabel}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xs"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t.closeLabel}
          className="absolute -top-12 left-1/2 -translate-x-1/2 flex size-9 items-center justify-center rounded-full bg-background/90 text-body-foreground shadow-lg transition-colors hover:bg-background"
        >
          <XIcon className="size-4" />
        </button>

        <div className="relative bg-gray-900 rounded-[2rem] p-[3px] shadow-2xl">
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-3 bg-gray-900 rounded-full z-20" />
          <div className="relative bg-background rounded-[1.85rem] overflow-hidden aspect-[9/18]">
            <Image
              src="/images/hero/invitation-preview.jpg"
              alt={t.imageAlt}
              fill
              sizes="320px"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
