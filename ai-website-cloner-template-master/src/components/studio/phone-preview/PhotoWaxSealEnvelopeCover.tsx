"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { STANDALONE_FULLSCREEN_CLASS } from "./standaloneCoverPosition";
import {
  buildFlaps,
  flapClipPath,
  HINGE_ANGLE,
  HINGE_AXIS,
  HINGE_TRANSFORM_ORIGIN,
  type FoldPoint,
} from "@/lib/envelopeFlapGeometry";

// Slower than the single-flap covers on purpose — a deliberate, unhurried
// unfurl reads as more ceremonial than a quick lift. The hold and fade
// phases only begin once the slowest (last) flap has actually finished.
const OPEN_DURATION_MS = 1600;
const HOLD_DURATION_MS = 500;
const FADE_DURATION_MS = 700;
// Four symmetric flaps (no admin-drawn fold lines — see
// envelopeFlapGeometry.ts's fallback) release together in real life, once
// the seal breaks — a tight stagger reads as one shared release, matching a
// reference video of exactly this fold shot for this project.
const SYMMETRIC_STAGGER_MS = 90;
// A real envelope with its own hand-drawn fold lines almost always has an
// uneven flap layout (one flap and "the rest", two unequal halves, ...) —
// those open one after another in the order the admin drew them (the seal's
// own flap first), but the gap between them should read as "immediately
// after", not as a long wait — a small stagger, not a fraction of the whole
// open duration.
const CUSTOM_STAGGER_MS = 120;

// This variant renders an actual reference photograph instead of a
// drawn/gradient envelope — every earlier hand-built recreation (organic
// wax-blob SVGs, procedural leather grain) fell short of matching a real
// photo pixel-for-pixel, so here the photo itself *is* the artwork.
//
// `foldPoints` (Envelope.foldPoints, traced by the admin per envelope in
// FoldLineDrawer.tsx to match whatever their own photo actually shows) are
// turned into however many flaps they describe by
// envelopeFlapGeometry.ts's buildFlaps — each flap the same photo, clipped
// to its own polygon and hinged along whichever edge its outer boundary
// sits on, so however many pieces there are always tile the rectangle
// exactly with no seam while closed, then peel outward on their own edge
// under one shared `perspective`. Fewer than two fold points falls back to
// the classic four-symmetric-flaps model.
//
// Exported directly (not just through named per-color wrappers like
// NavyGoldWaxSealEnvelopeCover below) so the "customPhoto" EnvelopeStyle can
// drive it straight from a Template's own EnvelopePhotoUrl/
// EnvelopeSealXPercent/EnvelopeSealYPercent — an admin adding a new envelope
// photo from the panel doesn't need a new component or a code change.
export function PhotoWaxSealEnvelopeCover({
  onOpen,
  standalone,
  imageSrc,
  imageAlt,
  sealXPercent,
  sealYPercent,
  foldPoints = [],
}: {
  onOpen: () => void;
  standalone: boolean;
  imageSrc: string;
  imageAlt: string;
  sealXPercent: number;
  sealYPercent: number;
  // Each fold line's outer endpoint, in the order the admin drew them —
  // see Envelope.foldPoints. Fewer than two falls back to four symmetric
  // flaps meeting at the seal.
  foldPoints?: FoldPoint[];
}) {
  const [opening, setOpening] = useState(false);
  const [closing, setClosing] = useState(false);
  const [hidden, setHidden] = useState(false);

  const seal = { x: sealXPercent, y: sealYPercent };
  const flaps = buildFlaps(seal, foldPoints)
    // Opened in the order the admin actually drew the fold lines, so
    // drawing "the flap with the seal" first is what gives it priority.
    .sort((a, b) => a.sourceIndex - b.sourceIndex);
  const isCustomLayout = foldPoints.length >= 2;
  const staggerMs = isCustomLayout ? CUSTOM_STAGGER_MS : SYMMETRIC_STAGGER_MS;
  const lastFlapDelayMs = staggerMs * (flaps.length - 1);
  const closingAtMs = OPEN_DURATION_MS + lastFlapDelayMs + HOLD_DURATION_MS;
  const hiddenAtMs = closingAtMs + FADE_DURATION_MS;

  function handleOpenClick() {
    if (opening) return;
    onOpen();
    setOpening(true);
    window.setTimeout(() => setClosing(true), closingAtMs);
    window.setTimeout(() => setHidden(true), hiddenAtMs);
  }

  if (hidden) return null;

  return (
    <button
      type="button"
      onClick={handleOpenClick}
      aria-label="افتح الظرف"
      className={cn(
        "z-[1000] flex appearance-none items-center justify-center overflow-hidden border-0 bg-transparent p-0 transition-opacity ease-in-out",
        closing ? "pointer-events-none opacity-0" : "opacity-100",
        standalone ? STANDALONE_FULLSCREEN_CLASS : "absolute inset-0"
      )}
      // No backdrop color: the flaps already tile the whole rect while
      // closed, so a transparent wrapper means any gap that opens up as they
      // peel back shows the real invitation underneath immediately, instead
      // of a flat color that only clears once the outer crossfade finishes.
      style={{ transitionDuration: `${FADE_DURATION_MS}ms` }}
    >
      <div className="relative mx-auto h-full w-full max-w-[393px]" style={{ perspective: 1400 }}>
        {flaps.map((flap, i) => {
          const axis = HINGE_AXIS[flap.hingeEdge];
          const angle = HINGE_ANGLE[flap.hingeEdge];
          return (
            <motion.div
              key={flap.key}
              className="absolute inset-0"
              style={{
                transformOrigin: HINGE_TRANSFORM_ORIGIN[flap.hingeEdge],
                transformStyle: "preserve-3d",
                clipPath: flapClipPath(flap.points),
              }}
              animate={opening ? { [axis]: angle, opacity: 0.55 } : { [axis]: 0, opacity: 1 }}
              transition={{
                duration: OPEN_DURATION_MS / 1000,
                delay: opening ? (i * staggerMs) / 1000 : 0,
                ease: [0.65, 0, 0.35, 1],
              }}
            >
              <Image src={imageSrc} alt={i === 0 ? imageAlt : ""} aria-hidden={i !== 0} fill sizes="480px" priority className="object-cover" />
            </motion.div>
          );
        })}

        {/* Idle shimmer breathing behind the printed seal, before it's tapped. */}
        <motion.div
          aria-hidden
          className="absolute size-48 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            left: `${sealXPercent}%`,
            top: `${sealYPercent}%`,
            background: "radial-gradient(circle, rgba(255,214,120,0.25), transparent 70%)",
          }}
          animate={opening ? { opacity: 0 } : { opacity: [0.15, 0.4, 0.15], scale: [0.9, 1.05, 0.9] }}
          transition={opening ? { duration: 0.3 } : { duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Soft ambient light blooming from where the flaps meet as they
            peel back — gentle and wide rather than a sharp flash, sized to
            fill the gap the flaps leave rather than a tight seal-sized
            glow, timed to the full open sequence above. */}
        {opening && (
          <motion.div
            aria-hidden
            className="absolute size-96 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
            style={{
              left: `${sealXPercent}%`,
              top: `${sealYPercent}%`,
              background: "radial-gradient(circle, rgba(255,238,205,0.55), rgba(255,225,170,0.2) 55%, transparent 75%)",
            }}
            initial={{ opacity: 0, scale: 0.25 }}
            animate={{ opacity: [0, 0.5, 0.6, 0.4], scale: [0.25, 0.9, 1.15, 1.3] }}
            transition={{
              duration: (OPEN_DURATION_MS + lastFlapDelayMs + HOLD_DURATION_MS) / 1000,
              ease: "easeOut",
              times: [0, 0.5, 0.75, 1],
            }}
          />
        )}

        {/* Purely decorative highlight over the printed seal — the whole
            envelope is the tap target (the wrapping <button> above), not
            just this spot, so a guest can touch it anywhere to open it. */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute flex size-24 items-center justify-center"
          style={{ left: `${sealXPercent}%`, top: `${sealYPercent}%`, x: "-50%", y: "-50%" }}
          animate={opening ? { scale: 1.1, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={{ duration: OPEN_DURATION_MS / 1000, ease: "easeOut" }}
        />
      </div>
    </button>
  );
}

// The "navyGoldSeal" EnvelopeStyle: the exact reference photo (navy linen
// envelope, gold foil-pressed seal) — positions read off that photo
// (1080x1920). The four flaps converge at the seal itself, so the seal reads
// as what's physically holding them shut.
export function NavyGoldWaxSealEnvelopeCover({ onOpen, standalone }: { onOpen: () => void; standalone: boolean }) {
  return (
    <PhotoWaxSealEnvelopeCover
      onOpen={onOpen}
      standalone={standalone}
      imageSrc="/images/envelopes/navy-gold-seal.jpg"
      imageAlt=""
      sealXPercent={35}
      sealYPercent={47}
    />
  );
}
