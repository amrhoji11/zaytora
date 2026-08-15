"use client";

import { ChevronLeftIcon, ChevronRightIcon, EyeIcon } from "@/components/icons";
import { useLanguage } from "@/context/LanguageContext";

const COPY = {
  ar: {
    heading: "معاينة التصميم",
    subheading: "راجِع تصميم دعوتك قبل المتابعة.",
    notice: "دعوتك تبدو تماماً كما سيراها ضيوفك. افتحها على هاتفك قبل المتابعة.",
    openFullPreview: "فتح المعاينة الكاملة",
    back: "العودة للمعلومات",
    continue: "متابعة",
  },
  en: {
    heading: "Preview Design",
    subheading: "Review your invitation's design before continuing.",
    notice: "Your invitation looks exactly as your guests will see it. Open it on your phone before continuing.",
    openFullPreview: "Open Full Preview",
    back: "Back to Info",
    continue: "Continue",
  },
};

export function PreviewPhase({
  onOpenFullPreview,
  onContinue,
  onBack,
  continueLabel,
}: {
  onOpenFullPreview: () => void;
  onContinue: () => void;
  onBack: () => void;
  // Overrides the default "Continue →" wording — used when this invitation
  // is already approved and continuing just saves the edit instead of
  // moving on to a next step (see StudioWizard's onContinue).
  continueLabel?: string;
}) {
  const { language } = useLanguage();
  const t = COPY[language];

  return (
    <div className="flex flex-col items-center gap-6 px-6 py-12 text-center">
      <div>
        <h2 className="text-lg font-semibold text-foreground">{t.heading}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t.subheading}</p>
      </div>

      <div className="w-full rounded-2xl border border-gold/20 bg-gold/5 px-4 py-3 text-sm leading-relaxed text-body-foreground">
        {t.notice}
      </div>

      <button
        type="button"
        onClick={onOpenFullPreview}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-gold/40 py-3 text-sm font-medium text-gold transition-colors hover:bg-gold/5"
      >
        <EyeIcon className="size-4" />
        {t.openFullPreview}
      </button>

      <div dir="ltr" className="flex w-full items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-body-foreground transition-colors hover:bg-background/5"
        >
          <ChevronLeftIcon className="size-4" />
          {t.back}
        </button>
        <button
          type="button"
          onClick={onContinue}
          className="flex items-center gap-1 rounded-xl bg-gold px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gold/90"
        >
          {continueLabel ?? t.continue}
          <ChevronRightIcon className="size-4" />
        </button>
      </div>
    </div>
  );
}
