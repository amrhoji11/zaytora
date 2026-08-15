// Turns an envelope's seal position and however many fold-line endpoints an
// admin drew (FoldLineDrawer.tsx) into the flaps PhotoWaxSealEnvelopeCover
// actually renders. A real envelope's flap layout isn't one fixed shape —
// one flap, two, four, an uneven mix — so this works from whatever fold
// lines exist rather than assuming a specific count or symmetry: each fold
// line is one ray from the seal to the photo's edge; two fold lines next to
// each other (by where they land around the perimeter) bound one flap
// between them, all the way around.

export interface FoldPoint {
  x: number;
  y: number;
}

export type FlapHingeEdge = "top" | "right" | "bottom" | "left";

export interface FlapPolygon {
  // Stable across re-renders (tied to which fold line starts this flap,
  // not to sort position) so React doesn't remount/re-trigger a flap's
  // animation just because another flap's line moved.
  key: string;
  // seal first, then the walk along the photo's own edge from one fold
  // line's endpoint to the next (through any corners in between), in
  // order — this is exactly the CSS clip-path polygon for this flap.
  points: FoldPoint[];
  hingeEdge: FlapHingeEdge;
  // The fold line (by original draw-order index) that starts this flap —
  // used to open flaps in the order the admin actually drew them, letting
  // the admin control priority (e.g. "the one with the seal opens first")
  // just by drawing that line first.
  sourceIndex: number;
}

const EPSILON = 0.01;
const CORNERS: FoldPoint[] = [
  { x: 0, y: 0 },
  { x: 100, y: 0 },
  { x: 100, y: 100 },
  { x: 0, y: 100 },
];

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

// Extends the ray from `from` through `to` until it exits the [0,100]x[0,100]
// percentage rectangle — lets a fold line's second click land anywhere (not
// just precisely on the edge) while still producing a proper boundary point.
export function extendToRectBoundary(from: FoldPoint, to: FoldPoint): FoldPoint {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  if (dx === 0 && dy === 0) return { x: to.x, y: to.y };

  const candidates: number[] = [];
  if (dx > 0) candidates.push((100 - from.x) / dx);
  if (dx < 0) candidates.push((0 - from.x) / dx);
  if (dy > 0) candidates.push((100 - from.y) / dy);
  if (dy < 0) candidates.push((0 - from.y) / dy);

  const validCandidates = candidates.filter((t) => t > 0 && Number.isFinite(t));
  if (validCandidates.length === 0) return { x: clamp(to.x, 0, 100), y: clamp(to.y, 0, 100) };

  const t = Math.min(...validCandidates);
  return { x: clamp(from.x + t * dx, 0, 100), y: clamp(from.y + t * dy, 0, 100) };
}

function edgeOf(p: FoldPoint): FlapHingeEdge {
  if (p.y <= EPSILON) return "top";
  if (p.x >= 100 - EPSILON) return "right";
  if (p.y >= 100 - EPSILON) return "bottom";
  return "left";
}

// Perimeter position as a single number so any two boundary points can be
// compared/sorted consistently: 0–1 across the top (left→right), 1–2 down
// the right edge, 2–3 across the bottom (right→left), 3–4 up the left edge
// — walking clockwise, matching screen coordinates (y grows downward).
function perimeterParam(p: FoldPoint): number {
  const edge = edgeOf(p);
  if (edge === "top") return p.x / 100;
  if (edge === "right") return 1 + p.y / 100;
  if (edge === "bottom") return 2 + (100 - p.x) / 100;
  return 3 + (100 - p.y) / 100;
}

function segmentLength(a: FoldPoint, b: FoldPoint): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

// A corner belongs to two edges at once, so classifying it alone (edgeOf)
// is ambiguous — checking the pair together instead resolves it correctly:
// every segment produced by the perimeter walk below runs along exactly one
// edge, which shows up as both endpoints sharing that edge's fixed
// coordinate (y≈0 for top, x≈100 for right, ...), corner or not.
function segmentEdge(a: FoldPoint, b: FoldPoint): FlapHingeEdge {
  if (a.y <= EPSILON && b.y <= EPSILON) return "top";
  if (a.x >= 100 - EPSILON && b.x >= 100 - EPSILON) return "right";
  if (a.y >= 100 - EPSILON && b.y >= 100 - EPSILON) return "bottom";
  return "left";
}

// Which edge a flap should hinge on — the one carrying the longest stretch
// of its outer boundary. Almost every real flap's boundary sits entirely on
// one edge (this is then trivially that edge); a flap whose boundary
// happens to wrap a corner falls back to whichever side has more of it.
function dominantEdge(boundaryWalk: FoldPoint[]): FlapHingeEdge {
  const lengths: Record<FlapHingeEdge, number> = { top: 0, right: 0, bottom: 0, left: 0 };
  for (let i = 0; i < boundaryWalk.length - 1; i++) {
    const a = boundaryWalk[i];
    const b = boundaryWalk[i + 1];
    lengths[segmentEdge(a, b)] += segmentLength(a, b);
  }
  const [top] = (Object.entries(lengths) as [FlapHingeEdge, number][]).sort((a, b) => b[1] - a[1]);
  return top[0];
}

// The original model: four symmetric flaps peeling back from a shared
// center point — still genuinely correct for a diamond-fold envelope where
// all four flaps really do meet in the middle, and the fallback whenever an
// admin hasn't drawn any fold lines at all.
function buildFourSymmetricFlaps(seal: FoldPoint): FlapPolygon[] {
  return [
    { key: "flap-top", points: [seal, { x: 0, y: 0 }, { x: 100, y: 0 }], hingeEdge: "top", sourceIndex: 0 },
    { key: "flap-right", points: [seal, { x: 100, y: 0 }, { x: 100, y: 100 }], hingeEdge: "right", sourceIndex: 1 },
    { key: "flap-bottom", points: [seal, { x: 100, y: 100 }, { x: 0, y: 100 }], hingeEdge: "bottom", sourceIndex: 2 },
    { key: "flap-left", points: [seal, { x: 0, y: 100 }, { x: 0, y: 0 }], hingeEdge: "left", sourceIndex: 3 },
  ];
}

// `foldPoints` are each one fold line's outer endpoint, in the order the
// admin drew them (see FoldLineDrawer.tsx / Envelope.foldPoints) — the
// inner endpoint of every line is always the seal itself.
export function buildFlaps(seal: FoldPoint, foldPoints: FoldPoint[]): FlapPolygon[] {
  if (foldPoints.length < 2) {
    return buildFourSymmetricFlaps(seal);
  }

  const boundaryPoints = foldPoints.map((p, sourceIndex) => ({
    ...extendToRectBoundary(seal, p),
    sourceIndex,
  }));
  const sorted = [...boundaryPoints].sort((a, b) => perimeterParam(a) - perimeterParam(b));
  const corners = CORNERS.map((c) => ({ ...c, t: perimeterParam(c) }));

  const flaps: FlapPolygon[] = [];
  for (let i = 0; i < sorted.length; i++) {
    const start = sorted[i];
    const end = sorted[(i + 1) % sorted.length];
    const wraps = i === sorted.length - 1;
    const startT = perimeterParam(start);
    const endT = perimeterParam(end);

    const cornersBetween = corners
      .filter((c) => (wraps ? c.t > startT || c.t < endT : c.t > startT && c.t < endT))
      .sort((a, b) => {
        const na = wraps && a.t <= startT ? a.t + 4 : a.t;
        const nb = wraps && b.t <= startT ? b.t + 4 : b.t;
        return na - nb;
      })
      .map(({ x, y }) => ({ x, y }));

    const boundaryWalk = [{ x: start.x, y: start.y }, ...cornersBetween, { x: end.x, y: end.y }];
    flaps.push({
      key: `flap-${start.sourceIndex}`,
      points: [seal, ...boundaryWalk],
      hingeEdge: dominantEdge(boundaryWalk),
      sourceIndex: start.sourceIndex,
    });
  }

  return flaps;
}

export function flapClipPath(points: FoldPoint[]): string {
  return `polygon(${points.map((p) => `${p.x}% ${p.y}%`).join(", ")})`;
}

// rotateX only moves points based on the pivot's Y, rotateY only on the
// pivot's X — so a hinge's transform-origin only needs the coordinate that
// axis actually cares about; the other is arbitrary (center is tidy).
export const HINGE_TRANSFORM_ORIGIN: Record<FlapHingeEdge, string> = {
  top: "top center",
  bottom: "bottom center",
  left: "center left",
  right: "center right",
};

// rotateX for top/bottom (tipping away from the viewer around a horizontal
// axis), rotateY for left/right (around a vertical axis) — signs chosen so
// every hinge tips backward/outward, matching the original four-flap model.
export const HINGE_AXIS: Record<FlapHingeEdge, "rotateX" | "rotateY"> = {
  top: "rotateX",
  bottom: "rotateX",
  left: "rotateY",
  right: "rotateY",
};

export const HINGE_ANGLE: Record<FlapHingeEdge, number> = {
  top: -108,
  bottom: 108,
  left: -108,
  right: 108,
};
