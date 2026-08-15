"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

const COPY = {
  ar: {
    of: (from: number, to: number, total: number) => `${from}–${to} من ${total}`,
    prev: "السابق",
    next: "التالي",
  },
  en: {
    of: (from: number, to: number, total: number) => `${from}–${to} of ${total}`,
    prev: "Previous",
    next: "Next",
  },
};

// Shared prev/next pager for admin list pages backed by PagedResult<T> —
// Orders/Partners/Reviews/Users. Deliberately just prev/next + a range
// label rather than numbered page buttons: keeps it simple across pages
// with very different row counts.
export function Pagination({
  page,
  pageSize,
  totalCount,
  onPageChange,
  language,
}: {
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  language: "ar" | "en";
}) {
  const t = COPY[language];
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  if (totalCount === 0) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalCount);
  // In RTL, "previous" (toward page 1) points visually right, "next" left.
  const PrevIcon = language === "ar" ? ChevronRightIcon : ChevronLeftIcon;
  const NextIcon = language === "ar" ? ChevronLeftIcon : ChevronRightIcon;

  return (
    <div className="flex items-center justify-between gap-3 border-t border-border pt-3 text-xs text-muted-foreground">
      <span dir="ltr">{t.of(from, to, totalCount)}</span>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label={t.prev}
          className={cn(
            "flex size-7 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors",
            page <= 1 ? "cursor-not-allowed opacity-40" : "hover:border-white/20 hover:text-foreground"
          )}
        >
          <PrevIcon className="size-3.5" />
        </button>
        <span className="px-1 tabular-nums" dir="ltr">
          {page} / {totalPages}
        </span>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label={t.next}
          className={cn(
            "flex size-7 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors",
            page >= totalPages ? "cursor-not-allowed opacity-40" : "hover:border-white/20 hover:text-foreground"
          )}
        >
          <NextIcon className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
