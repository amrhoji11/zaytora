"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { STANDALONE_FULLSCREEN_CLASS } from "./standaloneCoverPosition";

// Straight open, top-and-bottom, like double doors — not a rotated peel
// (two earlier versions of this file tried 3D rotation and both produced a
// visible dark seam/wedge where the pieces met, which read as a mechanical
// flap rather than a scroll opening) and not a whole-piece slide-away or a
// shrink-to-nothing (both tried too, neither actually looked like "the
// paper opens"). This is the literal version: tap anywhere → the seal
// flashes and breaks → the top half of the photo slides straight up and
// off, the bottom half slides straight down and off, at the same time,
// clearing a widening gap starting at the seal — no rotation, no
// perspective, so there's nothing that can foreshorten into a wedge.
const UNTIE_DURATION_MS = 300;
const OPEN_DELAY_MS = 200;
const OPEN_DURATION_MS = 1400;
const HOLD_DURATION_MS = 500;
const FADE_DURATION_MS = 700;
const CLOSING_AT_MS = OPEN_DELAY_MS + OPEN_DURATION_MS + HOLD_DURATION_MS;
const HIDDEN_AT_MS = CLOSING_AT_MS + FADE_DURATION_MS;

export function ScrollUnrollEnvelopeCover({
  onOpen,
  standalone,
  imageSrc,
  imageAlt,
  sealXPercent,
  sealYPercent,
}: {
  onOpen: () => void;
  standalone: boolean;
  imageSrc: string;
  imageAlt: string;
  sealXPercent: number;
  sealYPercent: number;
}) {
  const [opening, setOpening] = useState(false);
  const [closing, setClosing] = useState(false);
  const [hidden, setHidden] = useState(false);

  function handleOpenClick() {
    if (opening) return;
    onOpen();
    setOpening(true);
    window.setTimeout(() => setClosing(true), CLOSING_AT_MS);
    window.setTimeout(() => setHidden(true), HIDDEN_AT_MS);
  }

  if (hidden) return null;

  const openTransition = {
    duration: OPEN_DURATION_MS / 1000,
    delay: opening ? OPEN_DELAY_MS / 1000 : 0,
    ease: [0.45, 0, 0.2, 1] as const,
  };

  return (
    <button
      type="button"
      onClick={handleOpenClick}
      aria-label="افتح اللفافة"
      className={cn(
        "z-[1000] flex appearance-none items-center justify-center overflow-hidden border-0 bg-transparent p-0 transition-opacity ease-in-out",
        closing ? "pointer-events-none opacity-0" : "opacity-100",
        standalone ? STANDALONE_FULLSCREEN_CLASS : "absolute inset-0"
      )}
      style={{ transitionDuration: `${FADE_DURATION_MS}ms` }}
    >
      <div className="relative mx-auto h-full w-full max-w-[393px]">
        {/* Top half of the photo (from the top edge down to the seal) —
            slides straight up and off-screen. */}
        <motion.div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0% 0% ${100 - sealYPercent}% 0%)` }}
          animate={{ y: opening ? "-100%" : "0%" }}
          transition={openTransition}
        >
          <Image src={imageSrc} alt={imageAlt} fill sizes="480px" priority className="object-cover" />
        </motion.div>

        {/* Bottom half of the photo (from the seal down to the bottom edge)
            — slides straight down and off-screen. */}
        <motion.div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(${sealYPercent}% 0% 0% 0%)` }}
          animate={{ y: opening ? "100%" : "0%" }}
          transition={openTransition}
        >
          <Image src={imageSrc} alt="" aria-hidden fill sizes="480px" priority className="object-cover" />
        </motion.div>

        {/* Warm light widening from the seal as the gap between the two
            halves opens up. */}
        {opening && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 blur-2xl"
            style={{
              top: `${sealYPercent}%`,
              height: "40%",
              transform: "translateY(-50%)",
              background: "linear-gradient(to bottom, transparent, rgba(255,238,205,0.5), rgba(255,225,170,0.2), transparent)",
            }}
            initial={{ opacity: 0, scaleY: 0.1 }}
            animate={{ opacity: [0, 0.5, 0.6, 0.35], scaleY: [0.1, 0.6, 1, 1.3] }}
            transition={{
              duration: (OPEN_DELAY_MS + OPEN_DURATION_MS + HOLD_DURATION_MS) / 1000,
              ease: "easeOut",
              times: [0, 0.4, 0.7, 1],
            }}
          />
        )}

        {/* A quick bright flash right at the seal the instant it's tapped —
            the tie/seal breaking, a beat before the two halves actually
            start moving (OPEN_DELAY_MS later). */}
        {opening && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute size-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,244,214,0.9),transparent_70%)]"
            style={{ left: `${sealXPercent}%`, top: `${sealYPercent}%` }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0, 1, 0], scale: [0.6, 1.6, 1.9] }}
            transition={{ duration: UNTIE_DURATION_MS / 1000, ease: "easeOut" }}
          />
        )}

        {/* Idle shimmer breathing over the seal, before it's tapped. */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute size-24 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            left: `${sealXPercent}%`,
            top: `${sealYPercent}%`,
            background: "radial-gradient(circle, rgba(255,214,120,0.25), transparent 70%)",
          }}
          animate={opening ? { opacity: 0 } : { opacity: [0.15, 0.4, 0.15], scale: [0.9, 1.05, 0.9] }}
          transition={opening ? { duration: 0.2 } : { duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </button>
  );
}
