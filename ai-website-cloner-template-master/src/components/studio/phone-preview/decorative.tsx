// Shared decorative primitives for the "archIslamic"/"waxseal" template
// scene styles — one small floral sprig, one hanging-lantern silhouette, and
// one cusped-arch path generator, reused across WaxSealEnvelopeCover, the
// hero's arch photo frame, and the arch invitation card rather than each
// hand-drawing its own. All render via currentColor so callers theme them
// with a plain text-color class.

import type { CSSProperties } from "react";

export function FloralSprig({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} style={style} aria-hidden>
      <path
        d="M32 4 C34 14 30 20 32 28 C34 20 38 16 44 14 M32 28 C28 20 20 18 12 20 M32 28 C36 22 42 22 48 26"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <circle cx="32" cy="6" r="3.4" fill="currentColor" opacity="0.85" />
      <circle cx="26" cy="10" r="2.1" fill="currentColor" opacity="0.7" />
      <circle cx="38" cy="10" r="2.1" fill="currentColor" opacity="0.7" />
      <circle cx="44" cy="14" r="1.7" fill="currentColor" opacity="0.6" />
      <circle cx="12" cy="20" r="1.7" fill="currentColor" opacity="0.6" />
      <circle cx="48" cy="26" r="1.6" fill="currentColor" opacity="0.55" />
    </svg>
  );
}

export function LanternSilhouette({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 48" fill="currentColor" className={className} style={style} aria-hidden>
      <path d="M12 0 L12 4" stroke="currentColor" strokeWidth="1" />
      <rect x="8" y="4" width="8" height="2.5" rx="1" />
      <path d="M6 8 Q12 5 18 8 L16 30 Q12 33 8 30 Z" opacity="0.9" />
      <rect x="9" y="12" width="6" height="14" opacity="0.35" />
      <rect x="7" y="30" width="10" height="2.5" rx="1" />
      <path d="M12 32.5 L12 37" stroke="currentColor" strokeWidth="1" />
      <circle cx="12" cy="39" r="2" />
    </svg>
  );
}

// Builds an SVG path for a cusped (scalloped) pointed arch: a rectangular
// base whose top edge is replaced by `lobes` outward bulges swept from the
// left springline, up through the apex, to the right springline — the
// Mughal/mihrab-style arch silhouette used throughout the reference video
// (the hero photo frame, the wax-seal envelope's open-beam gap). Returns a
// path string sized to a 0..width / 0..height viewBox, so callers can drop
// it straight into a `<path d=.../>` and clip/stroke it identically.
export function cuspedArchPath({
  width,
  height,
  springlineRatio = 0.42,
  lobes = 6,
  bulge = 0.09,
}: {
  width: number;
  height: number;
  // How far down the frame the arch's springline (where the curve meets the
  // straight vertical sides) sits, as a fraction of height from the top.
  springlineRatio?: number;
  lobes?: number;
  // Outward bulge of each cusp as a fraction of the arch radius.
  bulge?: number;
}): string {
  const cx = width / 2;
  const R = width / 2;
  const cy = height * springlineRatio;
  const outerR = R * (1 + bulge);

  let d = `M 0 ${height} L 0 ${cy} `;
  for (let i = 0; i < lobes; i++) {
    const angle = Math.PI + (i / lobes) * Math.PI;
    const nextAngle = Math.PI + ((i + 1) / lobes) * Math.PI;
    const midAngle = (angle + nextAngle) / 2;
    const x1 = cx + Math.cos(angle) * R;
    const y1 = cy + Math.sin(angle) * R;
    const xMid = cx + Math.cos(midAngle) * outerR;
    const yMid = cy + Math.sin(midAngle) * outerR;
    const x2 = cx + Math.cos(nextAngle) * R;
    const y2 = cy + Math.sin(nextAngle) * R;
    if (i === 0) d += `M ${x1} ${y1} `;
    d += `Q ${xMid} ${yMid} ${x2} ${y2} `;
  }
  d += `L ${width} ${cy} L ${width} ${height} L 0 ${height} Z`;
  return d;
}

// The pure top-edge stroke (no base rectangle, no closing) — for drawing a
// decorative border line that traces only the cusped curve itself, e.g.
// hugging the outside of a photo frame without a visible bottom edge.
export function cuspedArchOutline({
  width,
  height,
  springlineRatio = 0.42,
  lobes = 6,
  bulge = 0.09,
}: {
  width: number;
  height: number;
  springlineRatio?: number;
  lobes?: number;
  bulge?: number;
}): string {
  const cx = width / 2;
  const R = width / 2;
  const cy = height * springlineRatio;
  const outerR = R * (1 + bulge);

  let d = "";
  for (let i = 0; i < lobes; i++) {
    const angle = Math.PI + (i / lobes) * Math.PI;
    const nextAngle = Math.PI + ((i + 1) / lobes) * Math.PI;
    const midAngle = (angle + nextAngle) / 2;
    const x1 = cx + Math.cos(angle) * R;
    const y1 = cy + Math.sin(angle) * R;
    const xMid = cx + Math.cos(midAngle) * outerR;
    const yMid = cy + Math.sin(midAngle) * outerR;
    const x2 = cx + Math.cos(nextAngle) * R;
    const y2 = cy + Math.sin(nextAngle) * R;
    if (i === 0) d += `M ${x1} ${y1} `;
    d += `Q ${xMid} ${yMid} ${x2} ${y2} `;
  }
  return d;
}
