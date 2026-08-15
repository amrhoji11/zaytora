"use client";

import { useId } from "react";
import Image from "next/image";
import { motion, type MotionProps } from "framer-motion";
import { canUseNextImage, cn, isVideoSource } from "@/lib/utils";
import { cuspedArchPath, cuspedArchOutline, FloralSprig, LanternSilhouette } from "./decorative";

const FRAME_WIDTH = 220;
const FRAME_HEIGHT = 320;

// The hero's "archIslamic" HeroFrameStyle — a wider, multi-cusped
// Mughal/mihrab arch around the template photo (replacing InvitationCanvas's
// default plain rounded-top arch window), with patterned pillar edges,
// hanging lantern silhouettes, and floral corner sprigs — cloned from the
// reference video's hero scene. Self-contained (owns its own SVG clip +
// border layers) so InvitationCanvas only has to swap this in for the
// default frame, not thread extra per-shape plumbing through it.
export function ArchIslamicHeroFrame({
  imageUrl,
  unoptimized,
  kenBurnsProps,
  accent,
}: {
  imageUrl: string;
  unoptimized?: boolean;
  kenBurnsProps: MotionProps;
  // Resolved --tpl-accent hex — used for the pillar/lantern line color so
  // this frame still tracks a template's own palette rather than a fixed
  // gold, in case a future non-gold template also opts into this style.
  accent: string;
}) {
  const clipId = useId();
  const archD = cuspedArchPath({ width: FRAME_WIDTH, height: FRAME_HEIGHT, lobes: 7, springlineRatio: 0.4 });
  const outlineD = cuspedArchOutline({ width: FRAME_WIDTH, height: FRAME_HEIGHT, lobes: 7, springlineRatio: 0.4 });

  return (
    <div className="relative mx-auto mt-1" style={{ width: FRAME_WIDTH * 0.72, height: FRAME_HEIGHT * 0.72 }}>
      <span
        aria-hidden
        className="absolute inset-x-0 -top-4 mx-auto h-40 w-40 rounded-full blur-2xl"
        style={{ background: `radial-gradient(circle, ${accent}55, transparent 70%)` }}
      />

      <div className="relative h-full w-full">
        <svg
          className="absolute inset-0 h-full w-full overflow-visible"
          viewBox={`0 0 ${FRAME_WIDTH} ${FRAME_HEIGHT}`}
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
              <path d={archD} />
            </clipPath>
          </defs>
        </svg>

        <div
          className="absolute inset-0 overflow-hidden shadow-[0_0_30px_rgba(255,214,160,0.35)]"
          style={{ clipPath: `url(#${clipId})` }}
        >
          <motion.div className="absolute inset-0" {...kenBurnsProps}>
            {isVideoSource(imageUrl) ? (
              <video
                src={imageUrl}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : canUseNextImage(imageUrl) ? (
              <Image
                src={imageUrl}
                alt=""
                fill
                unoptimized={unoptimized}
                sizes={`${FRAME_WIDTH}px`}
                className="object-cover"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
            )}
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
        </div>

        {/* Double-line carved-pillar border tracing the same cusped outline
            — an outer line hugging the arch/photo edge and a slightly
            inset second line, matching the reference's carved stone-pillar
            arch detail. */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          viewBox={`0 0 ${FRAME_WIDTH} ${FRAME_HEIGHT}`}
          preserveAspectRatio="none"
          aria-hidden
        >
          <path d={archD} fill="none" stroke={accent} strokeWidth="2" opacity="0.85" />
          <path
            d={cuspedArchPath({ width: FRAME_WIDTH - 10, height: FRAME_HEIGHT - 6, lobes: 7, springlineRatio: 0.4 })}
            transform="translate(5, 0)"
            fill="none"
            stroke={accent}
            strokeWidth="1"
            opacity="0.4"
          />
        </svg>
      </div>

      {/* Hanging lanterns, one per side, at the springline — matching the
          reference's ornate arch lanterns. Each carries its own soft
          flickering glow (gently randomized delay so the two never pulse in
          lockstep) so they read as lit rather than a flat silhouette, even
          without an actual video behind the arch. */}
      {[{ side: "left" as const, delay: 0 }, { side: "right" as const, delay: 0.7 }].map(({ side, delay }) => (
        <div key={side} className={cn("absolute top-[34%]", side === "left" ? "left-[-14%]" : "right-[-14%]")}>
          <motion.span
            aria-hidden
            className="absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 rounded-full blur-md"
            style={{ background: `radial-gradient(circle, ${accent}66, transparent 70%)` }}
            animate={{ opacity: [0.35, 0.85, 0.4, 0.9, 0.35], scale: [0.9, 1.1, 0.95, 1.05, 0.9] }}
            transition={{ duration: 2.8, repeat: Infinity, delay, ease: "easeInOut" }}
          />
          <LanternSilhouette className="relative size-8" style={{ color: accent }} />
        </div>
      ))}

      {/* Floral corner sprigs at the arch's two outer top shoulders. */}
      <FloralSprig className="absolute -left-3 top-[6%] size-10 -rotate-45 opacity-80" style={{ color: accent }} />
      <FloralSprig className="absolute -right-3 top-[6%] size-10 rotate-45 opacity-80" style={{ color: accent }} />
    </div>
  );
}
