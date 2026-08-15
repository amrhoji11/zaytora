"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { cn, canUseNextImage } from "@/lib/utils";
import { ArrowRightIcon, EyeIcon } from "@/components/icons";
import { useLanguage } from "@/context/LanguageContext";
import type { TemplateDto } from "@/types/api";

const COPY = {
  ar: { preview: "معاينة", select: "اختر" },
  en: { preview: "Preview", select: "Select" },
};

export function TemplateCard({
  template,
  className,
  dark,
}: {
  template: TemplateDto;
  className?: string;
  // Lets the homepage's dark-themed teaser grid reuse this exact card (same
  // phone mockup, same /templates catalog styling) without a light backing
  // panel — only the caption text/select button below the mockup need a
  // different color here, since the phone frame itself is already dark.
  dark?: boolean;
}) {
  const { language } = useLanguage();
  const t = COPY[language];
  const router = useRouter();
  const isDataUrl = template.imageUrl.startsWith("data:");

  // Carries the template straight into a brand-new draft (StudioWizard reads
  // this ?templateId= on the no-invitationId "create" path and passes it to
  // POST /invitations) — so the phone preview already shows it from step 1
  // instead of leaving the guest to pick it again at Step03Template.
  function handleSelect() {
    router.push(`/studio?templateId=${template.id}`);
  }

  // Same /invitationpublic?template= flow (and same new-tab pattern) as
  // StudioWizard's own "فتح المعاينة الكاملة" full-preview button — renders
  // buildMockInvitation's fully-populated demo content (names, music,
  // gallery, RSVP, gifts...) through InvitationCanvas's standalone variant,
  // so this works for any current or future template with zero extra wiring.
  function handlePreview() {
    window.open(`/invitationpublic?template=${template.code}`, "_blank");
  }

  return (
    // content-visibility:auto skips layout/paint work for cards scrolled out
    // of view — the /templates grid renders dozens of these at once (each
    // with its own image, shadow, and rounded-corner clipping), which was
    // costing real main-thread time on every scroll frame. contain-intrinsic-size
    // is a rough placeholder height so the page doesn't jump once a card's
    // real size is measured.
    <div
      className={cn("group flex flex-col [content-visibility:auto] [contain-intrinsic-size:1px_420px]", className)}
    >
      <div className="relative mx-auto w-full">
        <div className="relative bg-gray-900 rounded-[2rem] p-[3px] shadow-lg">
          <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-16 h-3 bg-gray-900 rounded-full z-10" />
          <div className="relative bg-background rounded-[1.85rem] overflow-hidden aspect-[9/18]">
            {canUseNextImage(template.imageUrl) ? (
              <Image
                src={template.imageUrl}
                alt={`${template.code} ${template.category} template`}
                fill
                unoptimized={isDataUrl}
                className="object-cover"
                sizes="(min-width: 1024px) 16vw, (min-width: 640px) 25vw, 50vw"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={template.imageUrl}
                alt={`${template.code} ${template.category} template`}
                className="absolute inset-0 size-full object-cover"
              />
            )}
          </div>
        </div>
      </div>

      <div className="mt-2 text-center">
        <p
          className={cn(
            "font-medium text-sm group-hover:text-[#C8A24A] transition-colors",
            dark ? "text-foreground" : "text-foreground"
          )}
        >
          {template.code}
        </p>
        <p className={cn("text-xs capitalize mt-0.5", dark ? "text-muted-foreground" : "text-gray-400")}>{template.category}</p>
      </div>

      <div className="mt-3 flex flex-col sm:flex-row items-center justify-center gap-2">
        <button
          type="button"
          onClick={handleSelect}
          className={cn(
            "flex items-center justify-center gap-1 px-3 py-1.5 border rounded-full text-xs font-medium transition-colors shadow-sm w-full sm:w-auto",
            dark
              ? "bg-background/10 border-white/15 text-foreground hover:bg-background/15"
              : "bg-background border-border text-foreground hover:bg-muted"
          )}
        >
          <ArrowRightIcon className="size-3.5" />
          {t.select}
        </button>
        <button
          type="button"
          onClick={handlePreview}
          className="flex items-center justify-center gap-1 px-3 py-1.5 bg-[#C8A24A] text-white rounded-full text-xs font-medium hover:bg-[#B8923A] transition-colors shadow-sm w-full sm:w-auto"
        >
          <EyeIcon className="size-3.5" />
          {t.preview}
        </button>
      </div>
    </div>
  );
}
