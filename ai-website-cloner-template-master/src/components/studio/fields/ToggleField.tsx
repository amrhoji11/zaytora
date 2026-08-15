import { cn } from "@/lib/utils";

export function ToggleField({
  label,
  description,
  checked,
  onChange,
  tone = "default",
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  tone?: "default" | "highlight";
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "flex w-full items-center justify-between gap-4 rounded-xl border px-4 py-3 text-right transition-colors",
        tone === "highlight" && checked
          ? "border-rose-800/40 bg-rose-100 dark:bg-rose-950/30"
          : checked
            ? "border-gold/30 bg-gold/5"
            : "border-border bg-background/5 hover:border-gold/40"
      )}
    >
      <span>
        <span
          className={cn(
            "block text-sm font-medium",
            tone === "highlight" && checked
              ? "text-rose-700 dark:text-rose-400"
              : checked
                ? "text-gold"
                : "text-foreground"
          )}
        >
          {label}
        </span>
        {description && <span className="mt-0.5 block text-xs text-muted-foreground">{description}</span>}
      </span>
      <span
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
          checked ? "bg-gold" : "bg-background/10"
        )}
      >
        <span
          className={cn(
            "inline-block size-4 transform rounded-full bg-background shadow transition-transform",
            checked ? "-translate-x-6" : "-translate-x-1"
          )}
        />
      </span>
    </button>
  );
}
