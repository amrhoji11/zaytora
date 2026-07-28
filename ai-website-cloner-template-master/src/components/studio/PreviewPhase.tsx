"use client";

import { ChevronLeftIcon, ChevronRightIcon, EyeIcon } from "@/components/icons";

export function PreviewPhase({
  onOpenFullPreview,
  onContinue,
  onBack,
}: {
  onOpenFullPreview: () => void;
  onContinue: () => void;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-6 px-6 py-12 text-center">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">معاينة التصميم</h2>
        <p className="mt-1 text-sm text-gray-500">راجِع تصميم دعوتك قبل المتابعة.</p>
      </div>

      <div className="w-full rounded-2xl border border-gold/20 bg-gold/5 px-4 py-3 text-sm leading-relaxed text-gray-700">
        دعوتك تبدو تماماً كما سيراها ضيوفك. افتحها على هاتفك قبل المتابعة.
      </div>

      <button
        type="button"
        onClick={onOpenFullPreview}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-gold/40 py-3 text-sm font-medium text-gold transition-colors hover:bg-gold/5"
      >
        <EyeIcon className="size-4" />
        فتح المعاينة الكاملة
      </button>

      <div dir="ltr" className="flex w-full items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
        >
          <ChevronLeftIcon className="size-4" />
          العودة للمعلومات
        </button>
        <button
          type="button"
          onClick={onContinue}
          className="flex items-center gap-1 rounded-xl bg-gold px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gold/90"
        >
          متابعة
          <ChevronRightIcon className="size-4" />
        </button>
      </div>
    </div>
  );
}
