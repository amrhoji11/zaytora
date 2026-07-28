"use client";

import { useEffect } from "react";
import { XIcon } from "@/components/icons";
import type { InvitationDetail } from "@/types/studio";
import { InvitationCanvas } from "./phone-preview/InvitationCanvas";

// Full-screen standalone rendering of the same invitation content the phone
// mockup shows — a "what your guests will actually see" overlay, launched
// from the Preview step before checkout. Constrained to a phone-realistic
// width and centered (edge-to-edge only on small screens) since guests view
// this on their own phones, not stretched across a desktop monitor.
export function FullPreviewOverlay({ value, onClose }: { value: InvitationDetail; onClose: () => void }) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 sm:p-6">
      <div className="relative flex h-full w-full max-w-md flex-col overflow-hidden bg-white shadow-2xl sm:h-[92vh] sm:rounded-[2.5rem] sm:border sm:border-gray-200">
        {/* Preview watermark */}
        <div className="pointer-events-none absolute inset-0 z-30 flex flex-wrap content-center items-center justify-center gap-x-10 gap-y-16 overflow-hidden opacity-[0.08]">
          {Array.from({ length: 8 }).map((_, index) => (
            <span key={index} className="rotate-[-30deg] whitespace-nowrap text-3xl font-bold tracking-widest text-black">
              معاينة · PREVIEW
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="إغلاق المعاينة"
          className="absolute end-3 top-3 z-40 flex size-9 items-center justify-center rounded-full bg-black/60 text-white shadow-lg backdrop-blur transition-colors hover:bg-black/80"
        >
          <XIcon className="size-4" />
        </button>

        <InvitationCanvas value={value} className="h-full" />
      </div>
    </div>
  );
}
