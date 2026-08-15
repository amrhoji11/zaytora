import { LightbulbIcon } from "@/components/icons";

export function HintBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-gold/20 bg-gold/5 px-3 py-2.5 text-xs text-body-foreground">
      <LightbulbIcon className="mt-0.5 size-3.5 shrink-0 text-gold" />
      <p>{children}</p>
    </div>
  );
}
