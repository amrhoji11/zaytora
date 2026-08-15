"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// A literal pair of double doors: the photo is split straight down the
// middle into two equal panels — not tied to the seal position at all,
// unlike every other envelope-cover variant, because a real door's split is
// dictated by its own frame, not by where a wax seal happens to sit. On tap
// each panel is pulled straight off sideways, own edge leading (left panel
// slides left, right panel slides right) — a flat horizontal slide, no
// rotation, no perspective. See DoorFoldEnvelopeCover for the other door
// variant, which hinges each panel open in 3D instead.
const OPEN_DURATION_MS = 1600;
const HOLD_DURATION_MS = 500;
const FADE_DURATION_MS = 700;
// The two panels are a matched pair — they slide open together, not one
// after the other (a real double door doesn't wait for one leaf before the
// second moves), so the stagger between them is only enough to avoid two
// perfectly identical transitions animating as one flat plane.
const PANEL_STAGGER_MS = 40;
const CLOSING_AT_MS = OPEN_DURATION_MS + PANEL_STAGGER_MS + HOLD_DURATION_MS;
const HIDDEN_AT_MS = CLOSING_AT_MS + FADE_DURATION_MS;

export function DoorSlideEnvelopeCover({
  onOpen,
  standalone,
  imageSrc,
  imageAlt,
}: {
  onOpen: () => void;
  standalone: boolean;
  imageSrc: string;
  imageAlt: string;
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

  return (
    <button
      type="button"
      onClick={handleOpenClick}
      aria-label="افتح الباب"
      className={cn(
        "z-[1000] flex appearance-none items-center justify-center overflow-hidden border-0 bg-transparent p-0 transition-opacity ease-in-out",
        closing ? "pointer-events-none opacity-0" : "opacity-100",
        standalone ? "fixed inset-0" : "absolute inset-0"
      )}
      style={{ transitionDuration: `${FADE_DURATION_MS}ms` }}
    >
      <div className="relative mx-auto h-full w-full max-w-[393px] overflow-hidden">
        {/* Left leaf (left half of the photo) — pulled straight left and
            off-screen, no rotation. */}
        <motion.div
          className="absolute inset-0"
          style={{ clipPath: "inset(0% 50% 0% 0%)" }}
          animate={{ x: opening ? "-100%" : "0%" }}
          transition={{ duration: OPEN_DURATION_MS / 1000, ease: [0.45, 0, 0.2, 1] }}
        >
          <Image src={imageSrc} alt={imageAlt} fill sizes="480px" priority className="object-cover" />
        </motion.div>

        {/* Right leaf (right half of the photo) — pulled straight right and
            off-screen, a beat behind the left one so the pair doesn't read
            as one flat plane splitting in two. */}
        <motion.div
          className="absolute inset-0"
          style={{ clipPath: "inset(0% 0% 0% 50%)" }}
          animate={{ x: opening ? "100%" : "0%" }}
          transition={{
            duration: OPEN_DURATION_MS / 1000,
            delay: opening ? PANEL_STAGGER_MS / 1000 : 0,
            ease: [0.45, 0, 0.2, 1],
          }}
        >
          <Image src={imageSrc} alt="" aria-hidden fill sizes="480px" priority className="object-cover" />
        </motion.div>

        {/* Bright light spilling through the center seam as the two leaves
            slide apart — a vertical bar widening from the middle, standing
            in for whatever's on the other side of the door (in the
            reference, a sunlit curtain; here, the invitation itself). */}
        {opening && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 blur-2xl"
            style={{
              width: "60%",
              background:
                "linear-gradient(to right, transparent, rgba(255,250,240,0.75), rgba(255,238,210,0.35), transparent)",
            }}
            initial={{ opacity: 0, scaleX: 0.05 }}
            animate={{ opacity: [0, 0.65, 0.7, 0.4], scaleX: [0.05, 0.5, 0.85, 1.1] }}
            transition={{
              duration: (OPEN_DURATION_MS + PANEL_STAGGER_MS + HOLD_DURATION_MS) / 1000,
              ease: "easeOut",
              times: [0, 0.4, 0.7, 1],
            }}
          />
        )}

        {/* Idle shimmer breathing along the seam where the two doors meet,
            before it's tapped. */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-1/2 w-10 -translate-x-1/2"
          style={{ background: "linear-gradient(to right, transparent, rgba(255,214,120,0.2), transparent)" }}
          animate={opening ? { opacity: 0 } : { opacity: [0.15, 0.4, 0.15] }}
          transition={opening ? { duration: 0.2 } : { duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </button>
  );
}
