import { cn } from "@/lib/utils";
import { STANDALONE_FULLSCREEN_CLASS } from "./standaloneCoverPosition";

// Which ambient motion layer drifts across the whole canvas — mirrors
// Template.AmbientEffect (see the backend entity's doc comment) and
// InvitationCanvas's resolveAmbientVariant(), which defaults an unset
// template to "smoke" (dark themes) or "sparkle" (light themes) rather than
// forcing every template to pick one explicitly.
export type AmbientVariant = "smoke" | "petals" | "sparkle" | "snow" | "none";

// Per-variant particle count/size/duration — smoke uses fewer, larger,
// slower shapes (individual wisps read better sparse); sparkle uses more,
// smaller, faster ones (a field of tiny twinkling motes). Sizes/durations
// are deliberately varied per-particle (via `i % 3`) rather than uniform, the
// same "measured off the reference, staggered" approach the original
// snowfall particles used. Counts/sizes (and every keyframe's opacity, in
// globals.css) were bumped up from the original numinds.me-measured values
// once real BackgroundImageUrl photos replaced the old flat-color/no-photo
// canvas: against a plain background the original subtle values already
// read as "moving", but against a busy full-bleed photo they all but
// disappeared — this motion layer needs to be legible over real photo
// detail, not just over empty color.
const VARIANT_CONFIG: Record<
  Exclude<AmbientVariant, "none">,
  { className: string; count: number; sizeBase: number; sizeStep: number; durationBase: number; durationStep: number; needsTopSpread: boolean }
> = {
  snow: { className: "ambient-particle-snow", count: 16, sizeBase: 6, sizeStep: 2, durationBase: 8, durationStep: 2.5, needsTopSpread: false },
  smoke: { className: "ambient-particle-smoke", count: 10, sizeBase: 14, sizeStep: 5, durationBase: 9, durationStep: 2, needsTopSpread: true },
  petals: { className: "ambient-particle-petals", count: 14, sizeBase: 9, sizeStep: 3, durationBase: 9, durationStep: 2, needsTopSpread: false },
  sparkle: { className: "ambient-particle-sparkle", count: 18, sizeBase: 5, sizeStep: 2, durationBase: 3, durationStep: 1, needsTopSpread: true },
};

function buildParticles(count: number, sizeBase: number, sizeStep: number, durationBase: number, durationStep: number) {
  return Array.from({ length: count }, (_, i) => ({
    left: `${((i * 37) % 100).toFixed(1)}%`,
    // Only read by variants whose keyframes oscillate in place (smoke rises
    // from, sparkle twinkles around, its own starting point) rather than
    // traveling the full canvas height like snow/petals — those need
    // particles pre-spread down the page, not all starting at the top.
    top: `${((i * 53) % 100).toFixed(1)}%`,
    size: sizeBase + (i % 3) * sizeStep,
    duration: durationBase + (i % 3) * durationStep,
    delay: (i % 4) * 1.2,
  }));
}

// A persistent motion layer drifting the *entire* scroll height of the
// invitation canvas, not just the hero — grounded directly in numinds.me's
// own live templates (W038/W039), which keep an equivalent particle layer
// running continuously behind every section as the guest scrolls. Tinted
// via --tpl-accent (set by resolveCanvasTheme) so the color follows each
// template's own palette instead of a flat white every template shared.
export function AmbientParticles({
  standalone,
  variant = "snow",
}: {
  standalone: boolean;
  variant?: AmbientVariant;
}) {
  if (variant === "none") return null;
  const config = VARIANT_CONFIG[variant];
  const particles = buildParticles(config.count, config.sizeBase, config.sizeStep, config.durationBase, config.durationStep);

  return (
    <div
      className={cn("pointer-events-none z-10 overflow-hidden", standalone ? STANDALONE_FULLSCREEN_CLASS : "absolute inset-0")}
      aria-hidden
    >
      {particles.map((particle, index) => (
        <span
          key={index}
          className={cn("absolute bg-[var(--tpl-accent)]", config.className)}
          style={{
            left: particle.left,
            top: config.needsTopSpread ? particle.top : undefined,
            width: particle.size,
            height: particle.size,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
