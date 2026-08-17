"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface BottomBarItem {
  key: string;
  icon: LucideIcon;
  label: string;
  show: boolean;
  isAction?: boolean;
}

export function BottomBar({
  items,
  activeKey,
  onSelect,
  standalone = false,
}: {
  items: BottomBarItem[];
  activeKey: string | null;
  onSelect: (key: string) => void;
  // true on the public, full-page guest view (InvitationCanvas rendered with
  // native page scroll instead of a bounded phone-bezel frame) — the bar
  // then anchors to the viewport itself, matching numinds.me's floating
  // pill nav, instead of the bezel-relative edge-to-edge bar used elsewhere.
  standalone?: boolean;
}) {
  const visible = items.filter((item) => item.show);
  if (visible.length === 0) return null;

  return (
    <div
      className={cn(
        // tpl-bottom-bar: lets globals.css drop this bar's blur specifically
        // while an auto-scroll ride is underway (see [data-riding="true"]
        // .tpl-bottom-bar) — unlike every card, which only pays the blur
        // repaint cost while it's near the viewport, this bar is fixed on
        // screen for the ride's entire duration, continuously re-blurring
        // whatever scrolls behind it. That made it the one part of the page
        // still able to stall the main thread at an arbitrary point mid-ride
        // even after every other repaint-cost source was addressed.
        "tpl-bottom-bar z-30 grid items-center px-1 py-2",
        standalone
          ? "fixed bottom-4 left-1/2 z-[999] h-16 w-[383px] max-w-[calc(100%-2rem)] -translate-x-1/2 rounded-xl border-t-[0.8px] border-[rgba(244,244,244,0.28)] bg-[rgba(217,217,217,0.19)] shadow-[0_0_2px_rgba(0,0,0,0.25)] backdrop-blur-[14px]"
          : "absolute inset-x-3 bottom-3 rounded-2xl border border-black/10 bg-white/60 shadow-sm backdrop-blur-md"
      )}
      style={{ gridTemplateColumns: `repeat(${visible.length}, minmax(0, 1fr))` }}
    >
      {visible.map((item) =>
        item.isAction ? (
          <motion.button
            key={item.key}
            type="button"
            onClick={() => onSelect(item.key)}
            whileTap={{ scale: 0.92 }}
            className="flex min-w-0 flex-col items-center gap-0.5"
          >
            <span
              className="pulse-glow-gold -mt-6 flex size-[52px] shrink-0 items-center justify-center rounded-full shadow-[0_6px_24px_var(--tpl-accent-40),0_0_0_2px_var(--tpl-accent-15)]"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, var(--tpl-accent) 0%, var(--tpl-accent-light) 50%, var(--tpl-accent) 100%)",
              }}
            >
              <item.icon className="size-6 text-white drop-shadow-sm" />
            </span>
          </motion.button>
        ) : (
          <motion.button
            key={item.key}
            type="button"
            onClick={() => onSelect(item.key)}
            whileTap={{ scale: 0.9 }}
            className={cn(
              "flex min-w-0 flex-col items-center gap-1 transition-colors",
              activeKey === item.key ? "text-[var(--tpl-accent)]" : "text-[var(--tpl-text-muted)] hover:text-[var(--tpl-accent)]"
            )}
          >
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full transition-colors",
                activeKey === item.key ? "bg-[var(--tpl-chip-bg)]" : "bg-black/[0.06]"
              )}
            >
              <item.icon className="size-4" />
            </span>
            <span className="w-full truncate text-center text-[7px] font-medium uppercase leading-none">
              {item.label}
            </span>
          </motion.button>
        )
      )}
    </div>
  );
}
