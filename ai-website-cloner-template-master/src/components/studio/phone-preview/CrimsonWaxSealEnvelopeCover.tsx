"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { STANDALONE_FULLSCREEN_CLASS } from "./standaloneCoverPosition";

// Pacing: the flap lifts open with real depth (~700ms), the gap holds at
// full brightness for a beat (~300ms), then the whole cover dissolves into
// the hero (~550ms) — same three-phase shape as WaxSealEnvelopeCover, just
// tuned faster since this is a single flap lift rather than a two-half split.
const OPEN_DURATION_MS = 700;
const HOLD_DURATION_MS = 300;
const FADE_DURATION_MS = 550;
const CLOSING_AT_MS = OPEN_DURATION_MS + HOLD_DURATION_MS;
const HIDDEN_AT_MS = CLOSING_AT_MS + FADE_DURATION_MS;

// Where the flap's triangular point sits, as a percentage of the envelope's
// height — a structural constant (it defines the flap's own clip-path and
// hinge), independent of where the decorative wax seal is placed on top of
// it. Matches the reference photos' proportions, where the two top-corner
// creases meet a little below the vertical midpoint rather than exactly at it.
const APEX_Y_PERCENT = 42;

type Palette = {
  backdrop: string;
  pouchGradient: string;
  pouchMottle: [string, string, string];
  flapGradient: string;
  flapMottle: [string, string];
  seamHighlight: string;
  // Crimson's reference photo reads as a soft, shallow-depth-of-field shot
  // (smooth cloudy blotches, no visible paper fiber) rather than Olive's
  // crisp close-up cardstock texture — these let a palette dial the shared
  // grain/crease rendering down to that softer look instead of forking it.
  grainOpacity?: number;
  mottleOpacity?: number;
  creaseOpacity?: number;
  softFocus?: boolean;
  sealShape?: "blob" | "diamond";
  // Olive's reference photo isn't the classic symmetric envelope-flap
  // silhouette (two equal creases meeting dead-center) — it's a single fold
  // running from the top-left corner, bending near the seal, and continuing
  // down toward the bottom-right corner, with the mirror crease on the
  // right barely visible. These let one flap shape's apex/creases go
  // asymmetric for a palette without forking the whole structure.
  flapApexXPercent?: number;
  creaseLeftOpacity?: number;
  creaseRightOpacity?: number;
  lowerSeamEndXPercent?: number;
};

const CRIMSON_PALETTE: Palette = {
  backdrop: "#3a0f28",
  pouchGradient: "linear-gradient(165deg, #4a1533 0%, #340e24 55%, #3f122c 100%)",
  pouchMottle: ["rgba(120,50,80,0.38)", "rgba(90,30,55,0.4)", "rgba(105,42,68,0.3)"],
  flapGradient: "linear-gradient(200deg, #4e1732 0%, #34102a 100%)",
  flapMottle: ["rgba(130,58,88,0.32)", "rgba(95,36,58,0.32)"],
  seamHighlight: "rgba(255,224,232,0.22)",
  grainOpacity: 0,
  mottleOpacity: 0.3,
  creaseOpacity: 0.4,
  softFocus: true,
  sealShape: "diamond",
};

const OLIVE_PALETTE: Palette = {
  backdrop: "#24261a",
  pouchGradient: "linear-gradient(165deg, #2e3020 0%, #24261a 55%, #282a1c 100%)",
  pouchMottle: ["rgba(50,55,35,0.4)", "rgba(42,46,30,0.35)", "rgba(46,50,32,0.3)"],
  flapGradient: "linear-gradient(200deg, #363824 0%, #292b1c 100%)",
  flapMottle: ["rgba(56,60,38,0.35)", "rgba(46,50,32,0.3)"],
  seamHighlight: "rgba(230,240,200,0.16)",
  mottleOpacity: 0.62,
  grainOpacity: 0.5,
  flapApexXPercent: 38,
  creaseLeftOpacity: 0.55,
  creaseRightOpacity: 0.08,
  lowerSeamEndXPercent: 82,
};

// The flap triangle's two edges, as SVG lines from each top corner down to
// the apex. A real paper fold catches light unevenly on either side of the
// crease rather than reading as one flat line, so this draws three
// coincident strokes: a soft dark shadow (the crease's own recess), the
// crisp groove itself, and a faint highlight — the same shadow+highlight
// duo WaxSealEnvelopeCover's embossed florals use, just far more subtle
// since this is a photographed paper fold, not engraved metal.
function FlapSeamLines({
  className,
  highlightColor,
  apexXPercent = 50,
  leftOpacity = 1,
  rightOpacity = 1,
}: {
  className?: string;
  highlightColor: string;
  apexXPercent?: number;
  leftOpacity?: number;
  rightOpacity?: number;
}) {
  const leftPath = `M0 0 L${apexXPercent} ${APEX_Y_PERCENT}`;
  const rightPath = `M${apexXPercent} ${APEX_Y_PERCENT} L100 0`;
  return (
    <svg
      className={className}
      viewBox={`0 0 100 ${APEX_Y_PERCENT}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      {[leftPath, rightPath].map((path, i) => {
        const opacity = i === 0 ? leftOpacity : rightOpacity;
        return (
          <g key={path} style={{ opacity }}>
            <path d={path} fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth="1.1" />
            <path d={path} fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="0.35" />
            <path d={path} fill="none" stroke={highlightColor} strokeWidth="0.3" transform="translate(0, -0.35)" />
          </g>
        );
      })}
    </svg>
  );
}

// Two stacked fractal-noise layers rather than one: a coarse, low-frequency
// turbulence for the mottled, cloudy tonal patches real leather/heavy
// cardstock shows under raking light, plus a fine grain on top for close-up
// fiber texture. A flat gradient alone reads as a vector illustration no
// matter how good its colors are — this mottling is what actually sells
// "photographed material".
function PaperGrain({
  className,
  filterIdPrefix,
  mottleOpacity = 0.55,
  grainOpacity = 0.45,
  softFocus = false,
}: {
  className?: string;
  filterIdPrefix: string;
  mottleOpacity?: number;
  grainOpacity?: number;
  softFocus?: boolean;
}) {
  const mottleId = `${filterIdPrefix}Mottle`;
  const grainId = `${filterIdPrefix}FineGrain`;
  return (
    <svg className={className} aria-hidden>
      <filter id={mottleId}>
        {/* Softer, larger-scale blotches for a shallow-depth-of-field photo
            look (Crimson) vs the tighter close-up cardstock mottle
            (Olive) — lower baseFrequency reads as bigger, blurrier
            patches instead of fine fiber clumps. */}
        <feTurbulence
          type="fractalNoise"
          baseFrequency={softFocus ? "0.006 0.009" : "0.012 0.018"}
          numOctaves="3"
          seed="7"
        />
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.9 0" />
        {softFocus && <feGaussianBlur stdDeviation="3" />}
      </filter>
      {grainOpacity > 0 && (
        <filter id={grainId}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0" />
        </filter>
      )}
      <rect width="100%" height="100%" filter={`url(#${mottleId})`} style={{ mixBlendMode: "overlay", opacity: mottleOpacity }} />
      {grainOpacity > 0 && (
        <rect width="100%" height="100%" filter={`url(#${grainId})`} style={{ mixBlendMode: "soft-light", opacity: grainOpacity }} />
      )}
    </svg>
  );
}

// The per-lobe vertices a blob's radii describe, before they're joined into
// a spline — kept separate from the path string below so callers can also
// place per-lobe highlight/shadow dots exactly on each bump.
function blobPoints(radii: number[], cx: number, cy: number) {
  return radii.map((r, i) => {
    const angle = (i / radii.length) * Math.PI * 2;
    return [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r] as const;
  });
}

// Traces a closed, smooth blob through the given points using a
// Catmull-Rom spline (converted to cubic Beziers) — guarantees no cusps
// regardless of how unevenly the radii vary, unlike a naive quadratic
// through each vertex.
function pathFromPoints(points: readonly (readonly [number, number])[]) {
  const n = points.length;
  const at = (i: number) => points[((i % n) + n) % n];
  let d = `M ${points[0][0]} ${points[0][1]} `;
  for (let i = 0; i < n; i++) {
    const [p0x, p0y] = at(i - 1);
    const [p1x, p1y] = at(i);
    const [p2x, p2y] = at(i + 1);
    const [p3x, p3y] = at(i + 2);
    const cp1x = p1x + (p2x - p0x) / 6;
    const cp1y = p1y + (p2y - p0y) / 6;
    const cp2x = p2x - (p3x - p1x) / 6;
    const cp2y = p2y - (p3y - p1y) / 6;
    d += `C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p2x} ${p2y} `;
  }
  return d + "Z";
}

function smoothBlobPath(radii: number[], cx: number, cy: number) {
  return pathFromPoints(blobPoints(radii, cx, cy));
}

// A real pressed wax seal reads as two distinct zones, not one uniform
// blob: an irregular, thick outer rim where excess wax squeezed out and
// pooled as the stamp came down (a handful of pronounced rounded bumps,
// each catching its own bit of highlight/shadow), and a much smoother,
// near-circular flat disc in the center where the stamp's face actually
// flattened the wax — separated by a thin pressed-in groove. Rendering
// both, instead of one flat-shaded blob, is what makes this look like a
// photographed object instead of a drawn icon. Creamy ivory regardless of
// envelope color — real sealing wax doesn't change with the paper.
// Light comes from the upper-left, same direction the outer/inner gradients'
// own cx/cy already imply — used below to shade each outer lobe
// individually rather than relying on one averaged gradient across the
// whole rim.
const LIGHT_DIR = { x: -0.68, y: -0.73 };

function WaxBlobSeal({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const cx = 50;
  const cy = 50;
  // Index 2 sits straight down (angle 90°) and 3 down-left (135°) — pushed
  // out further than the rest so the rim reads as a real pooled-wax drip
  // hanging off the bottom-left, matching the reference's asymmetric bulge,
  // rather than a uniformly-lobed rosette.
  const outerRadii = [43, 39, 54, 47, 44, 39, 46, 38];
  const outerPoints = blobPoints(outerRadii, cx, cy);
  const outerD = pathFromPoints(outerPoints);
  const innerD = smoothBlobPath([29, 28.5, 30, 28, 29.5, 28.5, 29.2, 28.8], cx, cy);

  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden>
      <defs>
        <radialGradient id="creamWaxOuterGradient" cx="32%" cy="26%" r="85%">
          <stop offset="0%" stopColor="#fdf9ee" />
          <stop offset="45%" stopColor="#eee2c4" />
          <stop offset="80%" stopColor="#d3c096" />
          <stop offset="100%" stopColor="#b8a377" />
        </radialGradient>
        <radialGradient id="creamWaxInnerGradient" cx="38%" cy="32%" r="80%">
          <stop offset="0%" stopColor="#f7f1e0" />
          <stop offset="60%" stopColor="#ede0c2" />
          <stop offset="100%" stopColor="#ddcca3" />
        </radialGradient>
        <radialGradient id="creamWaxSpecular" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="creamWaxBump" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="creamWaxDent" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3a2a10" stopOpacity="1" />
          <stop offset="100%" stopColor="#3a2a10" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Outer rim — the raised, irregular pooled wax. */}
      <path d={outerD} fill="url(#creamWaxOuterGradient)" />

      {/* Per-lobe bump shading — each rounded bump on the rim gets its own
          small highlight (if it faces the light) or soft shadow (if it
          faces away), so the rim reads as a cluster of individually raised
          lumps rather than one smoothly-lit blob. */}
      <g style={{ mixBlendMode: "overlay" }}>
        {outerPoints.map(([px, py], i) => {
          const vx = px - cx;
          const vy = py - cy;
          const len = Math.hypot(vx, vy) || 1;
          const dot = (vx / len) * LIGHT_DIR.x + (vy / len) * LIGHT_DIR.y;
          const lit = Math.max(dot, 0);
          const shaded = Math.max(-dot, 0);
          return (
            <g key={i}>
              {lit > 0 && (
                <circle cx={px} cy={py} r="9" fill="url(#creamWaxBump)" opacity={lit * 0.55} />
              )}
              {shaded > 0 && (
                <circle cx={px} cy={py} r="9" fill="url(#creamWaxDent)" opacity={shaded * 0.4} />
              )}
            </g>
          );
        })}
      </g>

      <path
        d={outerD}
        fill="none"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1"
        transform="scale(0.97)"
        style={{ transformOrigin: "50px 50px" }}
      />

      {/* The groove where the stamp's flat face met the rim — a soft dark
          ring just outside the inner disc, then the disc itself. */}
      <path d={innerD} fill="none" stroke="rgba(90,68,32,0.35)" strokeWidth="2.4" />
      <path d={innerD} fill="url(#creamWaxInnerGradient)" />
      {/* Faint sheen across the upper-left of the flat disc. */}
      <path
        d={innerD}
        fill="none"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="0.6"
        transform="scale(0.93)"
        style={{ transformOrigin: "50px 50px" }}
      />
      {/* A small, tight specular hotspot — the actual glossy glint a real
          wax surface catches under a studio light, distinct from the
          broader ambient sheen above. */}
      <ellipse cx="34" cy="28" rx="7" ry="5" fill="url(#creamWaxSpecular)" />
    </svg>
  );
}

// Crimson's reference photo uses a distinct medallion, not the organic
// pooled-wax blob above: a smooth rounded-square pressed to a 45° diamond,
// warmer and more golden than the plain-cream blob, with a crisp bevel ring
// separating a raised outer face from a slightly recessed inner one — reads
// as a cast/pressed ceramic-gold seal rather than dripped wax. Built from
// two concentric rotated `<rect>`s (not the blob's spline) since the
// reference's edges are clean and regular, with no lobed rim.
function DiamondWaxSeal({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden>
      <defs>
        <radialGradient id="diamondWaxOuterGradient" cx="34%" cy="26%" r="90%">
          <stop offset="0%" stopColor="#fbf3da" />
          <stop offset="45%" stopColor="#eddba3" />
          <stop offset="78%" stopColor="#d3b578" />
          <stop offset="100%" stopColor="#b3924f" />
        </radialGradient>
        <radialGradient id="diamondWaxInnerGradient" cx="38%" cy="30%" r="85%">
          <stop offset="0%" stopColor="#faf3e0" />
          <stop offset="55%" stopColor="#efe0b8" />
          <stop offset="100%" stopColor="#dcc28c" />
        </radialGradient>
        <radialGradient id="diamondWaxSpecular" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Outer raised face — a rounded square rotated to a diamond. */}
      <rect
        x="18" y="18" width="64" height="64" rx="15"
        fill="url(#diamondWaxOuterGradient)"
        transform="rotate(45 50 50)"
      />
      <rect
        x="18" y="18" width="64" height="64" rx="15"
        fill="none"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="1"
        transform="rotate(45 50 50) scale(0.96)"
        style={{ transformOrigin: "50px 50px" }}
      />

      {/* Bevel groove separating the raised outer face from the recessed
          inner one, then the inner face itself. */}
      <rect
        x="27" y="27" width="46" height="46" rx="11"
        fill="none"
        stroke="rgba(110,80,35,0.4)"
        strokeWidth="2.2"
        transform="rotate(45 50 50)"
      />
      <rect
        x="27" y="27" width="46" height="46" rx="11"
        fill="url(#diamondWaxInnerGradient)"
        transform="rotate(45 50 50)"
      />
      <rect
        x="27" y="27" width="46" height="46" rx="11"
        fill="none"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="0.6"
        transform="rotate(45 50 50) scale(0.92)"
        style={{ transformOrigin: "50px 50px" }}
      />

      {/* Glossy hotspot, upper-left, same light direction as the blob seal. */}
      <ellipse cx="35" cy="30" rx="8" ry="6" fill="url(#diamondWaxSpecular)" />
    </svg>
  );
}

// Shared implementation behind every "paper + wax seal" EnvelopeStyle: a
// textured envelope back rendered as two static layers — a plain pouch, and
// a triangular flap clipped to the classic top-corners-to-center-apex
// shape — with a plain cream wax-blob seal (no engraving/initials) resting
// on the flap. Tapping the seal lifts the flap open (rotateX around its top
// hinge, under a shared perspective) while the seal fades into a soft warm
// glow, then the whole cover crossfades away to reveal the hero underneath.
// Only the color palette and the seal's own position vary between variants
// — the geometry, texture, and animation are identical. Crossfade/unmount
// is plain CSS transition + setTimeout, matching every other envelope cover
// in this codebase (see EnvelopeCover.tsx's comment on why AnimatePresence
// exit callbacks aren't used here).
function WaxSealEnvelopeCoverBase({
  onOpen,
  standalone,
  palette,
  filterIdPrefix,
  sealXPercent,
  sealYPercent,
}: {
  onOpen: () => void;
  standalone: boolean;
  palette: Palette;
  filterIdPrefix: string;
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

  const [pm1, pm2, pm3] = palette.pouchMottle;
  const [fm1, fm2] = palette.flapMottle;
  const apexX = palette.flapApexXPercent ?? 50;
  const lowerSeamEndX = palette.lowerSeamEndXPercent ?? apexX;

  return (
    <div
      className={cn(
        "z-[1000] flex items-center justify-center overflow-hidden transition-opacity ease-in-out",
        closing ? "pointer-events-none opacity-0" : "opacity-100",
        standalone ? STANDALONE_FULLSCREEN_CLASS : "absolute inset-0"
      )}
      style={{ transitionDuration: `${FADE_DURATION_MS}ms`, background: palette.backdrop }}
    >
      <div className="relative mx-auto h-full w-full max-w-[393px]" style={{ perspective: 1200 }}>
        {/* Static pouch back — the vertical seam continuing down from the
            flap's apex is drawn here since it never moves. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              `radial-gradient(ellipse 55% 30% at 18% 72%, ${pm1}, transparent 70%),` +
              `radial-gradient(ellipse 60% 35% at 82% 28%, ${pm2}, transparent 70%),` +
              `radial-gradient(ellipse 45% 40% at 65% 88%, ${pm3}, transparent 70%),` +
              palette.pouchGradient,
          }}
        />
        <PaperGrain
          className="absolute inset-0 h-full w-full"
          filterIdPrefix={`${filterIdPrefix}Pouch`}
          mottleOpacity={palette.mottleOpacity}
          grainOpacity={palette.grainOpacity}
          softFocus={palette.softFocus}
        />
        {/* Soft vignette — edges/corners read a touch darker than the
            center, matching how a photographed envelope's lighting falls off. */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(0,0,0,0.22) 100%)",
          }}
        />
        {/* Directional soft-box light — brighter toward the upper-left,
            same light direction the seal's own highlights use, so the
            whole composition reads as one deliberately lit studio shot
            rather than a flat, evenly-exposed illustration. */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, rgba(255,250,235,0.05) 0%, transparent 40%, rgba(0,0,0,0.1) 100%)",
          }}
        />
        {/* Lower seam continuing from the flap's apex down to the pouch's
            own bottom corner — a straight vertical line for the symmetric
            flap shapes, but bent toward lowerSeamEndX when the flap apex
            itself is off-center (Olive), matching a fold photographed at a
            slight angle rather than dead-on. */}
        <svg
          className="absolute inset-x-0"
          style={{ top: `${APEX_Y_PERCENT}%`, bottom: 0, opacity: palette.creaseOpacity ?? 1 }}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <linearGradient id={`${filterIdPrefix}LowerSeam`} x1={apexX} y1="0" x2={lowerSeamEndX} y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="rgba(0,0,0,0.32)" />
              <stop offset="60%" stopColor="rgba(0,0,0,0.16)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </linearGradient>
          </defs>
          <line
            x1={apexX} y1="0" x2={lowerSeamEndX} y2="100"
            stroke={`url(#${filterIdPrefix}LowerSeam)`}
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* The triangular flap — clipped, given real depth, and hinged at
            the top edge so it lifts up and back on open. */}
        <motion.div
          className="absolute inset-x-0 top-0"
          style={{
            height: `${APEX_Y_PERCENT}%`,
            transformOrigin: "top center",
            transformStyle: "preserve-3d",
            clipPath: `polygon(0% 0%, 100% 0%, ${apexX}% 100%)`,
            background:
              `radial-gradient(ellipse 50% 40% at 25% 20%, ${fm1}, transparent 70%),` +
              `radial-gradient(ellipse 55% 35% at 75% 15%, ${fm2}, transparent 70%),` +
              palette.flapGradient,
          }}
          animate={opening ? { rotateX: -115, opacity: 0.4 } : { rotateX: 0, opacity: 1 }}
          transition={{ duration: OPEN_DURATION_MS / 1000, ease: [0.65, 0, 0.35, 1] }}
        >
          <PaperGrain
            className="absolute inset-0 h-full w-full"
            filterIdPrefix={`${filterIdPrefix}Flap`}
            mottleOpacity={palette.mottleOpacity}
            grainOpacity={palette.grainOpacity}
            softFocus={palette.softFocus}
          />
          <FlapSeamLines
            className="absolute inset-0 h-full w-full"
            highlightColor={palette.seamHighlight}
            apexXPercent={apexX}
            leftOpacity={palette.creaseLeftOpacity ?? palette.creaseOpacity ?? 1}
            rightOpacity={palette.creaseRightOpacity ?? palette.creaseOpacity ?? 1}
          />
        </motion.div>

        {/* Idle shimmer breathing behind the seal. */}
        <motion.div
          aria-hidden
          className="absolute size-56 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            left: `${sealXPercent}%`,
            top: `${sealYPercent}%`,
            background: "radial-gradient(circle, rgba(232,190,110,0.28), transparent 70%)",
          }}
          animate={opening ? { opacity: 0 } : { opacity: [0.15, 0.4, 0.15], scale: [0.9, 1.05, 0.9] }}
          transition={opening ? { duration: 0.3 } : { duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Warm light-beam that blooms from the seal's position as the flap
            lifts, reading as the seal breaking and light spilling out. */}
        {opening && (
          <motion.div
            aria-hidden
            className="absolute size-24 -translate-x-1/2 -translate-y-1/2 rounded-full blur-md"
            style={{
              left: `${sealXPercent}%`,
              top: `${sealYPercent}%`,
              background: "radial-gradient(circle, rgba(255,240,210,0.9), transparent 70%)",
            }}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: [0, 1, 1, 0.8], scale: [0.3, 1.2, 1.4, 1.2] }}
            transition={{ duration: (OPEN_DURATION_MS + HOLD_DURATION_MS) / 1000, ease: "easeOut", times: [0, 0.55, 0.75, 1] }}
          />
        )}

        {/* Cast contact shadow — a soft, blurred dark patch on the paper
            underneath and slightly down-right of the seal, separate from
            the tighter drop-shadow on the seal itself below. This is what
            actually grounds the seal as a real object resting on the
            envelope rather than a sticker floating over it. */}
        <motion.div
          aria-hidden
          className="absolute size-24 -translate-x-1/2 -translate-y-1/2 rounded-full blur-lg"
          style={{
            left: `calc(${sealXPercent}% + 3px)`,
            top: `calc(${sealYPercent}% + 5px)`,
            background: "radial-gradient(ellipse, rgba(0,0,0,0.45), transparent 72%)",
          }}
          animate={opening ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: OPEN_DURATION_MS / 1000 }}
        />

        <motion.button
          type="button"
          onClick={handleOpenClick}
          aria-label="OPEN"
          className="absolute flex size-24 items-center justify-center"
          style={{ left: `${sealXPercent}%`, top: `${sealYPercent}%`, x: "-50%", y: "-50%" }}
          animate={opening ? { scale: 1.1, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={{ duration: OPEN_DURATION_MS / 1000, ease: "easeOut" }}
          whileTap={{ scale: 0.95 }}
        >
          {palette.sealShape === "diamond" ? (
            <DiamondWaxSeal
              className="absolute inset-0 h-full w-full"
              style={{ filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.5)) drop-shadow(0 1px 1px rgba(255,255,255,0.3))" }}
            />
          ) : (
            <WaxBlobSeal
              className="absolute inset-0 h-full w-full"
              style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.45)) drop-shadow(0 1px 1px rgba(255,255,255,0.35))" }}
            />
          )}
        </motion.button>
      </div>
    </div>
  );
}

// The "crimsonSeal" EnvelopeStyle: deep oxblood/maroon paper, seal centered
// on the flap's apex.
export function CrimsonWaxSealEnvelopeCover({ onOpen, standalone }: { onOpen: () => void; standalone: boolean }) {
  return (
    <WaxSealEnvelopeCoverBase
      onOpen={onOpen}
      standalone={standalone}
      palette={CRIMSON_PALETTE}
      filterIdPrefix="crimson"
      sealXPercent={50}
      sealYPercent={APEX_Y_PERCENT}
    />
  );
}

// The "oliveSeal" EnvelopeStyle: near-black olive, crumpled-leather paper
// with a single fold running from the top-left corner through the seal and
// on to the bottom-right — the seal sits off-center at that fold's bend
// (OLIVE_PALETTE.flapApexXPercent), not dead-center like the other variants.
export function OliveWaxSealEnvelopeCover({ onOpen, standalone }: { onOpen: () => void; standalone: boolean }) {
  return (
    <WaxSealEnvelopeCoverBase
      onOpen={onOpen}
      standalone={standalone}
      palette={OLIVE_PALETTE}
      filterIdPrefix="olive"
      sealXPercent={OLIVE_PALETTE.flapApexXPercent ?? 50}
      sealYPercent={APEX_Y_PERCENT}
    />
  );
}
