"use client";

import { useEffect } from "react";
import Image from "next/image";
import { XIcon } from "@/components/icons";

interface InvitationPreviewModalProps {
  open: boolean;
  onClose: () => void;
}

export function InvitationPreviewModal({ open, onClose }: InvitationPreviewModalProps) {
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
      aria-label="معاينة نموذج الدعوة"
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
          aria-label="إغلاق المعاينة"
          className="absolute -top-12 left-1/2 -translate-x-1/2 flex size-9 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-lg transition-colors hover:bg-white"
        >
          <XIcon className="size-4" />
        </button>

        <div className="relative bg-gray-900 rounded-[2rem] p-[3px] shadow-2xl">
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-3 bg-gray-900 rounded-full z-20" />
          <div className="relative bg-white rounded-[1.85rem] overflow-hidden aspect-[9/18]">
            <Image
              src="/images/hero/invitation-preview.jpg"
              alt="نموذج الدعوة"
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
