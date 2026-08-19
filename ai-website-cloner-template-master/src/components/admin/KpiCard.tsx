import { cn } from "@/lib/utils";

export type KpiTone = "emerald" | "blue" | "violet" | "amber" | "rose";

const TONE_CLASSES: Record<KpiTone, string> = {
  emerald: "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400",
  blue: "bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400",
  violet: "bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-400",
  amber: "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400",
  rose: "bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400",
};

interface KpiCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  tone: KpiTone;
  label: string;
  value: string;
  trend?: { value: string; positive: boolean };
}

export function KpiCard({ icon: Icon, tone, label, value, trend }: KpiCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_1px_3px_rgba(16,24,40,0.06)] transition-shadow duration-300 hover:shadow-[0_4px_12px_rgba(16,24,40,0.08)]">
      <div className="flex items-center justify-between">
        <span className={cn("flex size-10 items-center justify-center rounded-xl", TONE_CLASSES[tone])}>
          <Icon className="size-5" />
        </span>
        {trend && (
          <span
            className={cn(
              "text-xs font-semibold",
              trend.positive ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"
            )}
            dir="ltr"
          >
            {trend.positive ? "▲" : "▼"} {trend.value}
          </span>
        )}
      </div>
      <p className="mt-4 text-2xl font-bold text-foreground" dir="ltr">
        {value}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
