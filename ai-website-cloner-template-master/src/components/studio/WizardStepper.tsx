import { cn } from "@/lib/utils";

const PHASES = [
  { id: "design", label: "Design" },
  { id: "preview", label: "Preview" },
  { id: "payment", label: "Payment" },
  { id: "share", label: "Share" },
] as const;

export function WizardStepper({ activePhase }: { activePhase: (typeof PHASES)[number]["id"] }) {
  const activeIndex = PHASES.findIndex((phase) => phase.id === activePhase);

  return (
    <div className="mb-8 flex items-center">
      {PHASES.map((phase, index) => {
        const state = index < activeIndex ? "done" : index === activeIndex ? "active" : "upcoming";
        return (
          <div key={phase.id} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                  state === "active" && "bg-gold text-white",
                  state === "done" && "bg-gold/20 text-gold",
                  state === "upcoming" && "bg-gray-100 text-gray-400"
                )}
              >
                {index + 1}
              </span>
              <span
                className={cn(
                  "text-xs font-medium",
                  state === "active" ? "text-gold" : "text-gray-400"
                )}
              >
                {phase.label}
              </span>
            </div>
            {index < PHASES.length - 1 && (
              <div className={cn("mx-2 h-px flex-1", state === "done" ? "bg-gold/40" : "bg-gray-200")} />
            )}
          </div>
        );
      })}
    </div>
  );
}
