import { cn } from "@/lib/utils";

export type StatusTone = "success" | "warning" | "danger" | "neutral" | "info";

const TONE_CLASSES: Record<StatusTone, string> = {
  success: "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 ring-emerald-600/20 dark:ring-emerald-500/20",
  warning: "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 ring-amber-600/20 dark:ring-amber-500/20",
  danger: "bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 ring-rose-600/20 dark:ring-rose-500/20",
  neutral: "bg-muted text-body-foreground ring-border",
  info: "bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 ring-blue-600/20 dark:ring-blue-500/20",
};

export function StatusBadge({ tone, children }: { tone: StatusTone; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full min-w-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        TONE_CLASSES[tone]
      )}
    >
      {children}
    </span>
  );
}
