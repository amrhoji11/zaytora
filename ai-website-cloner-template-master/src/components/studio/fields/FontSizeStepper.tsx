"use client";

import { MinusIcon, PlusIcon } from "@/components/icons";
import { useLanguage } from "@/context/LanguageContext";

const MIN = 70;
const MAX = 150;
const STEP = 10;
export const DEFAULT_FONT_SIZE_PERCENT = 100;

const COPY = { ar: "حجم الخط", en: "Font size" };

// A percentage scale applied on top of the template's own base size for one
// text element (see InvitationCanvas.tsx's fontSizeStyle) -- kept as a
// relative percent rather than an absolute px/rem value so it stays
// meaningful across templates whose base sizes for the same field differ.
// Editable at any point, same as every other studio field (including after
// checkout) -- the chosen value just persists like anything else the guest
// saves.
export function FontSizeStepper({
  value,
  onChange,
}: {
  value?: number | null;
  onChange: (value: number) => void;
}) {
  const { language } = useLanguage();
  const size = value ?? DEFAULT_FONT_SIZE_PERCENT;

  function step(delta: number) {
    onChange(Math.min(MAX, Math.max(MIN, size + delta)));
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm text-body-foreground">{COPY[language]}</label>
      <div className="flex w-fit items-center gap-1 rounded-xl border border-border bg-background p-1">
        <button
          type="button"
          onClick={() => step(-STEP)}
          disabled={size <= MIN}
          aria-label="A-"
          className="flex size-8 items-center justify-center rounded-lg text-body-foreground transition-colors hover:bg-gold/10 hover:text-gold disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <MinusIcon className="size-3.5" />
        </button>
        <span className="w-12 text-center text-sm text-foreground" dir="ltr">
          {size}%
        </span>
        <button
          type="button"
          onClick={() => step(STEP)}
          disabled={size >= MAX}
          aria-label="A+"
          className="flex size-8 items-center justify-center rounded-lg text-body-foreground transition-colors hover:bg-gold/10 hover:text-gold disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <PlusIcon className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
