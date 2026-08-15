"use client";

import { useId, useRef, useState } from "react";

interface GrowthChartPoint {
  label: string;
  value: number;
}

interface GrowthChartProps {
  title: string;
  data: GrowthChartPoint[];
  color: string;
  formatValue: (value: number) => string;
}

const WIDTH = 520;
const HEIGHT = 200;
const PADDING_X = 12;
const PADDING_TOP = 16;
const PADDING_BOTTOM = 28;

export function GrowthChart({ title, data, color, formatValue }: GrowthChartProps) {
  const gradientId = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const values = data.map((point) => point.value);
  const maxValue = Math.max(...values, 1);
  const minValue = Math.min(0, ...values);
  const plotHeight = HEIGHT - PADDING_TOP - PADDING_BOTTOM;
  const plotWidth = WIDTH - PADDING_X * 2;
  const stepX = data.length > 1 ? plotWidth / (data.length - 1) : 0;

  function xFor(index: number) {
    return PADDING_X + index * stepX;
  }
  function yFor(value: number) {
    const ratio = (value - minValue) / (maxValue - minValue || 1);
    return PADDING_TOP + (1 - ratio) * plotHeight;
  }

  const linePoints = data.map((point, index) => `${xFor(index)},${yFor(point.value)}`).join(" ");
  const areaPoints = `${PADDING_X},${PADDING_TOP + plotHeight} ${linePoints} ${xFor(data.length - 1)},${PADDING_TOP + plotHeight}`;

  function handlePointerMove(event: React.PointerEvent<SVGSVGElement>) {
    const svg = svgRef.current;
    if (!svg || data.length === 0) return;
    const rect = svg.getBoundingClientRect();
    const relativeX = ((event.clientX - rect.left) / rect.width) * WIDTH;
    const index = Math.round((relativeX - PADDING_X) / (stepX || 1));
    setHoverIndex(Math.min(Math.max(index, 0), data.length - 1));
  }

  const hovered = hoverIndex !== null ? data[hoverIndex] : null;
  const tooltipX = hoverIndex !== null ? xFor(hoverIndex) : 0;
  const tooltipAlignEnd = hoverIndex !== null && hoverIndex > data.length - 3;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_1px_3px_rgba(16,24,40,0.06)]">
      <p className="mb-3 text-sm font-semibold text-foreground">{title}</p>
      <div className="relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full touch-none"
          style={{ direction: "ltr" }}
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.22} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Recessive baseline */}
          <line
            x1={PADDING_X}
            y1={PADDING_TOP + plotHeight}
            x2={WIDTH - PADDING_X}
            y2={PADDING_TOP + plotHeight}
            stroke="var(--border)"
            strokeWidth={1}
          />

          <polygon points={areaPoints} fill={`url(#${gradientId})`} />
          <polyline
            points={linePoints}
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {data.map((point, index) => (
            <circle
              key={point.label}
              cx={xFor(index)}
              cy={yFor(point.value)}
              r={hoverIndex === index ? 4 : 0}
              fill={color}
              stroke="var(--card)"
              strokeWidth={1.5}
            />
          ))}

          {hoverIndex !== null && (
            <line
              x1={tooltipX}
              y1={PADDING_TOP}
              x2={tooltipX}
              y2={PADDING_TOP + plotHeight}
              stroke={color}
              strokeOpacity={0.25}
              strokeWidth={1}
              strokeDasharray="3 3"
            />
          )}

          {data.map((point, index) => {
            if (data.length > 8 && index % 2 !== 0 && index !== data.length - 1) return null;
            return (
              <text
                key={point.label}
                x={xFor(index)}
                y={HEIGHT - 8}
                fontSize={10}
                fill="var(--muted-foreground)"
                textAnchor={index === 0 ? "start" : index === data.length - 1 ? "end" : "middle"}
              >
                {point.label}
              </text>
            );
          })}
        </svg>

        {hovered && hoverIndex !== null && (
          <div
            className="pointer-events-none absolute top-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs shadow-lg"
            style={{
              left: `${(tooltipX / WIDTH) * 100}%`,
              transform: tooltipAlignEnd ? "translateX(-100%)" : "translateX(0)",
            }}
          >
            <p className="font-semibold text-foreground" dir="ltr">
              {formatValue(hovered.value)}
            </p>
            <p className="text-muted-foreground">{hovered.label}</p>
          </div>
        )}
      </div>
    </div>
  );
}
