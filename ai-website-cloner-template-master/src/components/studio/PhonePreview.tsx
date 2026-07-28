"use client";

import { CalendarIcon } from "@/components/icons";
import type { InvitationDetail } from "@/types/studio";
import { InvitationCanvas } from "./phone-preview/InvitationCanvas";

export function PhonePreview({ value }: { value: InvitationDetail }) {
  return (
    <div className="sticky top-24 flex flex-col items-center gap-3">
      <div className="relative w-64">
        <div className="absolute inset-0 scale-110 rounded-[3rem] bg-gold/20 blur-3xl" />
        <div className="relative rounded-[2.5rem] border border-gray-300 bg-gradient-to-b from-gray-400 to-gray-500 p-2 shadow-2xl">
          <div className="absolute left-1/2 top-2 z-20 h-3.5 w-24 -translate-x-1/2 rounded-full bg-black" />
          <InvitationCanvas value={value} className="aspect-[9/18] rounded-[2.1rem]" />
        </div>
      </div>
      <p className="flex items-center gap-1 text-xs text-gray-400">
        <CalendarIcon className="size-3" />
        معاينة مباشرة
      </p>
    </div>
  );
}
