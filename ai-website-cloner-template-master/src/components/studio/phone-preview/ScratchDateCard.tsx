"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const BOX_WIDTH = 140;
const BOX_HEIGHT = 104;
const SCRATCH_RADIUS = 16;
// Once this fraction of the foil layer's pixels are erased, the rest fades
// away on its own — matching the reference video, where the guest never has
// to scratch every last corner for the date to fully reveal.
const REVEAL_THRESHOLD = 0.55;

function ScratchBox({ value, accent }: { value: string; accent: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scratchingRef = useRef(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#f7e6ae");
    gradient.addColorStop(0.5, "#cfa544");
    gradient.addColorStop(1, "#f7e6ae");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Diagonal brushed-foil shine stripes.
    ctx.globalAlpha = 0.22;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    for (let x = -canvas.height; x < canvas.width; x += 12) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + canvas.height, canvas.height);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    // "Scratch" hint glyph so a guest who hasn't touched it yet still knows
    // it's interactive.
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.font = "600 11px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✦", canvas.width / 2, canvas.height / 2);
  }, []);

  function scratchAt(x: number, y: number) {
    const ctx = canvasRef.current?.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, SCRATCH_RADIUS, 0, Math.PI * 2);
    ctx.fill();
  }

  function pointFromEvent(event: React.PointerEvent<HTMLCanvasElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const scaleX = BOX_WIDTH / rect.width;
    const scaleY = BOX_HEIGHT / rect.height;
    return { x: (event.clientX - rect.left) * scaleX, y: (event.clientY - rect.top) * scaleY };
  }

  function checkRevealed() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (!canvas || !ctx) return;
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let cleared = 0;
    let sampled = 0;
    for (let i = 3; i < data.length; i += 4 * 6) {
      sampled++;
      if (data[i] === 0) cleared++;
    }
    if (sampled > 0 && cleared / sampled >= REVEAL_THRESHOLD) setRevealed(true);
  }

  function handlePointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    scratchingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    const { x, y } = pointFromEvent(event);
    scratchAt(x, y);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!scratchingRef.current) return;
    const { x, y } = pointFromEvent(event);
    scratchAt(x, y);
  }

  function handlePointerUp() {
    if (!scratchingRef.current) return;
    scratchingRef.current = false;
    checkRevealed();
  }

  return (
    <div
      className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl"
      style={{ boxShadow: "0 6px 16px rgba(120,95,45,0.18), inset 0 0 0 1px rgba(184,146,63,0.25)" }}
    >
      <div
        className="absolute inset-0 flex items-center justify-center bg-white text-2xl font-semibold"
        style={{ color: accent }}
      >
        {value}
      </div>
      <canvas
        ref={canvasRef}
        width={BOX_WIDTH}
        height={BOX_HEIGHT}
        className={cn(
          "absolute inset-0 h-full w-full touch-none transition-opacity duration-500",
          revealed ? "pointer-events-none opacity-0" : "cursor-pointer opacity-100"
        )}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />
    </div>
  );
}

// The "scratch" DateRevealStyle — a "The Date" section rendered right after
// the hero, matching the reference video: three foil boxes (day/month/year)
// the guest drags a finger/pointer across to erase, revealing the real
// EventDateTime underneath rather than a decorative countdown widget.
export function ScratchDateCard({
  eventDateTime,
  locale,
  isRtl,
  accent,
}: {
  eventDateTime?: string | null;
  locale: string;
  isRtl: boolean;
  accent: string;
}) {
  const date = eventDateTime ? new Date(eventDateTime) : null;
  const valid = Boolean(date && !Number.isNaN(date.getTime()));
  const day = valid && date ? String(date.getDate()).padStart(2, "0") : "--";
  const month = valid && date ? new Intl.DateTimeFormat(locale, { month: "short" }).format(date).toUpperCase() : "---";
  const year = valid && date ? String(date.getFullYear()) : "----";

  const copy = isRtl
    ? { title: "التاريخ", subtitle: "اخدشي لكشف التاريخ", day: "اليوم", month: "الشهر", year: "السنة" }
    : { title: "The Date", subtitle: "Scratch to reveal the date", day: "DAY", month: "MONTH", year: "YEAR" };

  if (!valid) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="px-8 text-center"
    >
      <p className={cn("font-cinzel text-2xl italic")} style={{ color: accent }}>
        {copy.title}
      </p>
      <p className="mt-1 text-xs tracking-widest opacity-80" style={{ color: accent }}>
        ✦ {copy.subtitle} ✦
      </p>
      <div className="mt-6 grid grid-cols-3 gap-3">
        <div>
          <ScratchBox value={day} accent={accent} />
          <p className="mt-2 text-[10px] tracking-[0.3em] opacity-75" style={{ color: accent }}>
            {copy.day}
          </p>
        </div>
        <div>
          <ScratchBox value={month} accent={accent} />
          <p className="mt-2 text-[10px] tracking-[0.3em] opacity-75" style={{ color: accent }}>
            {copy.month}
          </p>
        </div>
        <div>
          <ScratchBox value={year} accent={accent} />
          <p className="mt-2 text-[10px] tracking-[0.3em] opacity-75" style={{ color: accent }}>
            {copy.year}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
