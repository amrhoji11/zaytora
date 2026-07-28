"use client";

import type { LucideIcon } from "lucide-react";
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
}: {
  items: BottomBarItem[];
  activeKey: string | null;
  onSelect: (key: string) => void;
}) {
  const visible = items.filter((item) => item.show);
  if (visible.length === 0) return null;

  return (
    <div
      className="absolute inset-x-3 bottom-3 z-30 grid items-center rounded-2xl border border-black/10 bg-white/60 px-1 py-2 shadow-sm backdrop-blur-md"
      style={{ gridTemplateColumns: `repeat(${visible.length}, minmax(0, 1fr))` }}
    >
      {visible.map((item) =>
        item.isAction ? (
          <button
            key={item.key}
            type="button"
            onClick={() => onSelect(item.key)}
            className="flex min-w-0 flex-col items-center gap-0.5"
          >
            <span
              className="-mt-6 flex size-[52px] shrink-0 items-center justify-center rounded-full shadow-[0_6px_24px_rgba(200,162,74,0.5),0_0_0_2px_rgba(200,162,74,0.2)]"
              style={{ backgroundImage: "linear-gradient(135deg, #C8A24A 0%, #F0D98A 50%, #C8A24A 100%)" }}
            >
              <item.icon className="size-6 text-white drop-shadow-sm" />
            </span>
          </button>
        ) : (
          <button
            key={item.key}
            type="button"
            onClick={() => onSelect(item.key)}
            className={cn(
              "flex min-w-0 flex-col items-center gap-1 transition-colors",
              activeKey === item.key ? "text-gold" : "text-gray-800 hover:text-gold"
            )}
          >
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full transition-colors",
                activeKey === item.key ? "bg-gold/15" : "bg-black/[0.06]"
              )}
            >
              <item.icon className="size-4" />
            </span>
            <span className="w-full truncate text-center text-[7px] font-medium uppercase leading-none">
              {item.label}
            </span>
          </button>
        )
      )}
    </div>
  );
}
