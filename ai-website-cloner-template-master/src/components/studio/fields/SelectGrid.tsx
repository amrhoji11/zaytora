import { cn } from "@/lib/utils";

export interface SelectGridOption {
  value: string;
  label: string;
  sublabel?: string;
  emoji?: string;
}

export function SelectGrid({
  options,
  value,
  onChange,
  columns = 2,
}: {
  options: readonly SelectGridOption[];
  value?: string | null;
  onChange: (value: string) => void;
  columns?: 2 | 4;
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
              "rounded-xl border-2 p-3 text-center text-sm font-medium transition-all",
              selected
                ? "border-gold bg-gold/10 text-gray-900"
                : "border-gray-200 bg-white text-gray-700 hover:border-gold/40"
            )}
          >
            {option.emoji && <span className="mb-1 block text-lg">{option.emoji}</span>}
            <span>{option.label}</span>
            {option.sublabel && (
              <span className="mt-0.5 block text-xs font-normal text-gray-400">{option.sublabel}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
