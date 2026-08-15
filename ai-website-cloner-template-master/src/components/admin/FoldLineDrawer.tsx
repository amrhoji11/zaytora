"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { extendToRectBoundary, type FoldPoint } from "@/lib/envelopeFlapGeometry";

// One photo, one set of clicks — places the seal AND traces the envelope's
// real fold lines, instead of two separate stacked pickers showing the same
// photo (an earlier version of this did that, and it was exactly the kind
// of setup where clicking the wrong one silently moves the seal underneath
// whatever fold lines were already drawn against it, without any obvious
// sign that happened).
//
// Mode starts on "seal" whenever there isn't one yet, and switches to
// "folds" the instant one is placed — a fold line's inner end is always
// wherever the seal currently is, so there's no reason to ask for both at
// once. "غيّر مكان الختم" switches back to reposition it later; fold lines
// drawn against the old position aren't auto-adjusted (the photo hasn't
// changed, so this is meant for fixing a misclick, not routine editing).
export function FoldLineDrawer({
  imageUrl,
  sealXPercent,
  sealYPercent,
  onSealChange,
  points,
  onChange,
  emptyHint,
  placeSealHint,
  drawHint,
}: {
  imageUrl: string;
  sealXPercent: number | null;
  sealYPercent: number | null;
  onSealChange: (xPercent: number, yPercent: number) => void;
  points: FoldPoint[];
  onChange: (points: FoldPoint[]) => void;
  emptyHint: string;
  placeSealHint: string;
  drawHint: string;
}) {
  const hasSeal = sealXPercent != null && sealYPercent != null;
  const [mode, setMode] = useState<"seal" | "folds">(hasSeal ? "folds" : "seal");
  const [pendingFirstClick, setPendingFirstClick] = useState<FoldPoint | null>(null);

  function eventToPercent(event: React.MouseEvent<HTMLDivElement>): FoldPoint {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: Math.min(100, Math.max(0, ((event.clientX - rect.left) / rect.width) * 100)),
      y: Math.min(100, Math.max(0, ((event.clientY - rect.top) / rect.height) * 100)),
    };
  }

  function handleClick(event: React.MouseEvent<HTMLDivElement>) {
    const clicked = eventToPercent(event);

    if (mode === "seal") {
      onSealChange(Math.round(clicked.x * 10) / 10, Math.round(clicked.y * 10) / 10);
      setMode("folds");
      setPendingFirstClick(null);
      return;
    }

    if (sealXPercent == null || sealYPercent == null) return;

    if (!pendingFirstClick) {
      setPendingFirstClick(clicked);
      return;
    }

    // The line always actually radiates from the real seal position (not
    // the first click, which only confirms "this line starts near there")
    // out through the second click, extended to the photo's own edge.
    const outerPoint = extendToRectBoundary({ x: sealXPercent, y: sealYPercent }, clicked);
    onChange([...points, { x: Math.round(outerPoint.x * 10) / 10, y: Math.round(outerPoint.y * 10) / 10 }]);
    setPendingFirstClick(null);
  }

  function removePoint(index: number) {
    onChange(points.filter((_, i) => i !== index));
  }

  if (!imageUrl.trim()) {
    return (
      <div className="flex aspect-[9/16] max-h-64 items-center justify-center rounded-xl border border-dashed border-border bg-background/40 px-6 text-center text-xs text-muted-foreground">
        {emptyHint}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        onClick={handleClick}
        className={cn(
          "relative mx-auto aspect-[9/16] max-h-64 overflow-hidden rounded-xl border border-border",
          mode === "seal" ? "cursor-crosshair" : "cursor-crosshair"
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" draggable={false} />

        {mode === "folds" && hasSeal && (
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            {points.map((point, i) => (
              <line
                key={i}
                x1={sealXPercent}
                y1={sealYPercent}
                x2={point.x}
                y2={point.y}
                stroke="#ef4444"
                strokeWidth={0.6}
                vectorEffect="non-scaling-stroke"
              />
            ))}
            {pendingFirstClick && (
              <line
                x1={sealXPercent}
                y1={sealYPercent}
                x2={pendingFirstClick.x}
                y2={pendingFirstClick.y}
                stroke="#ef4444"
                strokeWidth={0.6}
                strokeDasharray="3 2"
                vectorEffect="non-scaling-stroke"
              />
            )}
          </svg>
        )}

        {hasSeal && (
          <span
            aria-hidden
            className="pointer-events-none absolute size-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#C8A24A] shadow-[0_0_0_2px_rgba(0,0,0,0.45)]"
            style={{ left: `${sealXPercent}%`, top: `${sealYPercent}%` }}
          />
        )}

        {mode === "folds" &&
          points.map((point, i) => (
            <button
              key={i}
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                removePoint(i);
              }}
              className="absolute flex size-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-red-500 text-[10px] font-bold leading-none text-white shadow-[0_0_0_2px_rgba(0,0,0,0.45)]"
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
            >
              ×
            </button>
          ))}

        {mode === "folds" && pendingFirstClick && (
          <span
            aria-hidden
            className="pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-red-400/80"
            style={{ left: `${pendingFirstClick.x}%`, top: `${pendingFirstClick.y}%` }}
          />
        )}
      </div>

      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] text-muted-foreground">{mode === "seal" ? placeSealHint : drawHint}</p>
        {hasSeal && (
          <button
            type="button"
            onClick={() => {
              setMode((current) => (current === "seal" ? "folds" : "seal"));
              setPendingFirstClick(null);
            }}
            className="shrink-0 rounded-lg border border-border px-2 py-1 text-[10px] font-medium text-body-foreground transition-colors hover:bg-background/10"
          >
            {mode === "seal" ? "↩" : "✎"}
          </button>
        )}
      </div>
    </div>
  );
}
