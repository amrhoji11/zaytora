import { CheckIcon } from "@/components/icons";
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
                  (state === "active" || state === "done") && "bg-gold text-white",
                  state === "upcoming" && "bg-background/10 text-muted-foreground"
                )}
              >
                {state === "done" ? <CheckIcon className="size-4" /> : index + 1}
              </span>
              <span
                className={cn(
                  "text-xs font-medium",
                  state === "upcoming" ? "text-muted-foreground" : "text-gold"
                )}
              >
                {phase.label}
              </span>
            </div>
            {index < PHASES.length - 1 && (
              // Solid gold once the step this segment starts from is done —
              // i.e. the whole Design->Preview->Payment run behind the
              // active phase renders as a fully filled progress line, not a
              // faded one.
              <div className={cn("mx-2 h-px flex-1", state === "done" ? "bg-gold" : "bg-background/10")} />
            )}
          </div>
        );
      })}
    </div>
  );
}
