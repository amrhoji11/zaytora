"use client";

import { CalendarIcon } from "@/components/icons";
import { useLanguage } from "@/context/LanguageContext";
import type { InvitationDetail } from "@/types/studio";
import { InvitationCanvas } from "./phone-preview/InvitationCanvas";

const COPY = { ar: "معاينة مباشرة", en: "Live preview" };

export function PhonePreview({
  value,
  isTemplateStep = false,
}: {
  value: InvitationDetail;
  // True while StudioWizard's active step is template selection — passed
  // straight through to InvitationCanvas's templatePreviewMode so the
  // picker shows the template's raw visual identity instead of the
  // not-yet-real placeholder content.
  isTemplateStep?: boolean;
}) {
  const { language } = useLanguage();
  return (
    <div className="sticky top-24 flex flex-col items-center gap-3">
      <div className="relative w-64">
        <div className="absolute inset-0 scale-110 rounded-[3rem] bg-gold/20 blur-3xl" />
        <div className="relative rounded-[2.5rem] border border-border bg-gradient-to-b from-gray-400 to-gray-500 p-2 shadow-2xl">
          <div className="absolute left-1/2 top-2 z-20 h-3.5 w-24 -translate-x-1/2 rounded-full bg-black" />
          <InvitationCanvas
            value={value}
            className="aspect-[9/18] rounded-[2.1rem]"
            templatePreviewMode={isTemplateStep}
          />
        </div>
      </div>
      <p className="flex items-center gap-1 text-xs text-muted-foreground">
        <CalendarIcon className="size-3" />
        {COPY[language]}
      </p>
    </div>
  );
}
