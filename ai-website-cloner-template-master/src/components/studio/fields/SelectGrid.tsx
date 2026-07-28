import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CheckIcon } from "@/components/icons";

export interface SelectGridOption {
  value: string;
  label: string;
  sublabel?: string;
  emoji?: string;
  // Prefer over `emoji` for anything that isn't a plain pictograph — country
  // flag emoji render as literal two-letter fallback text on Windows (no
  // flag glyphs in Segoe UI Emoji), which visually duplicates a `label` like
  // "GB". A real icon component sidesteps that font gap entirely.
  icon?: LucideIcon;
}

export function SelectGrid({
  options,
  value,
  onChange,
  columns = 2,
  layout = "tile",
}: {
  options: readonly SelectGridOption[];
  value?: string | null;
  onChange: (value: string) => void;
  columns?: 2 | 4;
  layout?: "tile" | "row";
}) {
  return (
    <div className={cn("grid gap-3", columns === 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2")}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "relative rounded-xl border-2 p-3 text-sm font-medium transition-all",
              layout === "row" ? "flex items-center gap-3 text-start" : "text-center",
              selected
                ? layout === "row"
                  ? "border-gold bg-white text-gold"
                  : "border-gold bg-gold/10 text-gray-900"
                : "border-gray-200 bg-white text-gray-700 hover:border-gold/40"
            )}
          >
            {selected && layout === "tile" && (
              <span className="absolute -top-2 -end-2 flex size-5 items-center justify-center rounded-full bg-gold text-white shadow">
                <CheckIcon className="size-3" />
              </span>
            )}
            {option.icon && (
              <option.icon
                className={cn("size-5 text-gold", layout === "row" ? "shrink-0" : "mb-1")}
              />
            )}
            {!option.icon && option.emoji && (
              <span className={cn("text-lg", layout === "row" ? "shrink-0" : "mb-1 block")}>
                {option.emoji}
              </span>
            )}
            <span>
              <span className="block">{option.label}</span>
              {option.sublabel && (
                <span className="mt-0.5 block text-xs font-normal text-gray-400">{option.sublabel}</span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
