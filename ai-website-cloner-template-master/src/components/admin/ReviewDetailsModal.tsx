"use client";

import { cn } from "@/lib/utils";
import { CheckCircleIcon, EyeOffIcon, StarIcon, TrashIcon, XIcon } from "@/components/icons";
import { StatusBadge, type StatusTone } from "@/components/admin/StatusBadge";
import type { ReviewDto, ReviewStatus } from "@/types/api";

const STATUS_TONE: Record<ReviewStatus, StatusTone> = {
  pending: "warning",
  approved: "success",
  rejected: "danger",
};

const COPY = {
  ar: {
    title: "تفاصيل التقييم",
    close: "إغلاق",
    customer: "اسم العميل",
    country: "الدولة",
    date: "تاريخ الإرسال",
    rating: "التقييم",
    status: "الحالة",
    statusLabels: { pending: "قيد المراجعة", approved: "معتمد", rejected: "مرفوض" } as Record<ReviewStatus, string>,
    reviewTitle: "عنوان التقييم",
    reviewBody: "نص التقييم",
    noTitle: "بدون عنوان",
    approve: "اعتماد",
    reject: "حظر/إخفاء",
    delete: "حذف",
  },
  en: {
    title: "Review Details",
    close: "Close",
    customer: "Customer Name",
    country: "Country",
    date: "Submission Date",
    rating: "Rating",
    status: "Status",
    statusLabels: { pending: "Pending", approved: "Approved", rejected: "Rejected" } as Record<ReviewStatus, string>,
    reviewTitle: "Review Title",
    reviewBody: "Review Text",
    noTitle: "No title",
    approve: "Approve",
    reject: "Reject/Hide",
    delete: "Delete",
  },
};

function formatDate(iso: string, language: "ar" | "en") {
  return new Date(iso).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function StarRow({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" dir="ltr">
      {Array.from({ length: 5 }).map((_, index) => (
        <StarIcon
          key={index}
          className={cn("size-4", index < count ? "text-[#C8A24A]" : "text-muted-foreground")}
          fill={index < count ? "currentColor" : "none"}
        />
      ))}
    </span>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-background px-3.5 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 truncate text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

export function ReviewDetailsModal({
  review,
  language,
  onClose,
  onApprove,
  onReject,
  onDelete,
}: {
  review: ReviewDto | null;
  language: "ar" | "en";
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const t = COPY[language];
  if (!review) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.title}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[85vh] w-full max-w-md flex-col overflow-y-auto rounded-2xl bg-card shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-border bg-card px-6 pb-4 pt-6">
          <div className="min-w-0">
            <p className="text-lg font-bold text-foreground">{t.title}</p>
            <div className="mt-1">
              <StatusBadge tone={STATUS_TONE[review.status]}>{t.statusLabels[review.status]}</StatusBadge>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-background/10 hover:text-foreground"
          >
            <XIcon className="size-4" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div className="grid grid-cols-2 gap-2.5">
            <InfoRow label={t.customer} value={review.name} />
            <InfoRow
              label={t.country}
              value={
                <span>
                  {review.countryFlag} {review.country || "—"}
                </span>
              }
            />
            <InfoRow label={t.date} value={formatDate(review.submittedAt, language)} />
            <InfoRow label={t.rating} value={<StarRow count={review.rating} />} />
          </div>

          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.reviewTitle}</p>
            <p className={cn("text-sm font-semibold", review.title ? "text-foreground" : "text-muted-foreground italic")}>
              {review.title || t.noTitle}
            </p>
          </div>

          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.reviewBody}</p>
            <p className="whitespace-pre-line rounded-xl border border-border bg-background p-3.5 text-sm leading-relaxed text-body-foreground">
              {review.body}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
            <button
              type="button"
              disabled={review.status === "approved"}
              onClick={() => onApprove(review.id)}
              className="flex shrink-0 items-center gap-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 px-3 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 transition-colors hover:bg-emerald-100 dark:bg-emerald-900/50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <CheckCircleIcon className="size-3.5" />
              {t.approve}
            </button>
            <button
              type="button"
              disabled={review.status === "rejected"}
              onClick={() => onReject(review.id)}
              className="flex shrink-0 items-center gap-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/50 px-3 py-2 text-xs font-semibold text-amber-700 dark:text-amber-400 transition-colors hover:bg-amber-100 dark:bg-amber-900/50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <EyeOffIcon className="size-3.5" />
              {t.reject}
            </button>
            <button
              type="button"
              onClick={() => onDelete(review.id)}
              className="flex shrink-0 items-center gap-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/50 px-3 py-2 text-xs font-semibold text-rose-700 dark:text-rose-400 transition-colors hover:bg-rose-100 dark:bg-rose-900/50"
            >
              <TrashIcon className="size-3.5" />
              {t.delete}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
