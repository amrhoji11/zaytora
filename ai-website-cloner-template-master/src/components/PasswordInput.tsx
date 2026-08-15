"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from "@/components/icons";

export function PasswordInput({
  value,
  onChange,
  autoComplete,
  required = true,
  showLabel,
  hideLabel,
  leadingIcon,
}: {
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  required?: boolean;
  showLabel: string;
  hideLabel: string;
  leadingIcon?: ReactNode;
}) {
  const [visible, setVisible] = useState(false);

  return (
    // Hardcoded to the physical left/right (not the logical `start-*`/`end-*`
    // utilities) — the input's own text is always dir="ltr" regardless of
    // the page's language, so both icons must stay physically fixed in both
    // RTL and LTR pages. Logical properties would flip them under RTL,
    // colliding with password text that still starts left.
    <div className="relative">
      {leadingIcon && (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {leadingIcon}
        </span>
      )}
      <input
        type={visible ? "text" : "password"}
        required={required}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        dir="ltr"
        className={cn(
          "w-full rounded-xl border border-border bg-background/5 py-2.5 pr-10 text-sm text-foreground outline-none transition-colors focus:border-gold",
          leadingIcon ? "pl-10" : "pl-3"
        )}
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? hideLabel : showLabel}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-body-foreground"
      >
        {visible ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
      </button>
    </div>
  );
}
