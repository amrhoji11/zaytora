"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronDownIcon, ChevronUpIcon } from "@/components/icons";

// Guest wishes read as a tall list on a full-page invitation, so rather than
// dumping every message into the page's own scroll (easy to lose track of
// while flicking through everything else), they live in their own bounded,
// independently-scrollable carousel with explicit up/down nav — the guest
// can park on the wishes section and page through it deliberately.
export function WishesCarousel({ wishes }: { wishes: string[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollByPage(direction: "up" | "down") {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientHeight * 0.85;
    el.scrollBy({ top: direction === "down" ? amount : -amount, behavior: "smooth" });
  }

  // Reads the --tpl-* custom properties InvitationCanvas's resolveCanvasTheme
  // sets on the canvas root — no hasPhoto/theme prop needed, CSS variables
  // cascade through the DOM tree on their own.
  const arrowClass =
    "flex size-7 shrink-0 items-center justify-center self-center rounded-full border border-[var(--tpl-accent-30)] bg-[var(--tpl-chip-bg)] text-[var(--tpl-emphasis)] backdrop-blur-md transition-transform active:scale-90";

  return (
    <div className="flex flex-col items-center gap-2">
      <button type="button" onClick={() => scrollByPage("up")} aria-label="التهاني السابقة" className={arrowClass}>
        <ChevronUpIcon className="size-4" />
      </button>

      <div
        ref={scrollRef}
        className="scrollbar-hide max-h-[280px] w-full space-y-3 overflow-y-auto scroll-smooth px-1 py-1"
      >
        {wishes.map((wish, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
            className="rounded-3xl border border-[var(--tpl-accent-30)] bg-[var(--tpl-chip-bg)] p-4 text-base text-[var(--tpl-text-body)] shadow-[0_2px_8px_rgba(0,0,0,0.08),inset_0_1px_0_var(--tpl-card-highlight)] backdrop-blur-lg [text-shadow:var(--tpl-text-shadow)]"
          >
            &ldquo;{wish}&rdquo;
          </motion.div>
        ))}
      </div>

      <button type="button" onClick={() => scrollByPage("down")} aria-label="المزيد من التهاني" className={arrowClass}>
        <ChevronDownIcon className="size-4" />
      </button>
    </div>
  );
}
