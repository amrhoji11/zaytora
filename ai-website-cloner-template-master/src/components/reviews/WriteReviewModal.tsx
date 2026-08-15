"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { CheckIcon, StarIcon, XIcon } from "@/components/icons";
import { useLanguage } from "@/context/LanguageContext";
import { PHONE_CODES } from "@/lib/partnersData";
import { submitReview } from "@/lib/services/reviews.service";
import { ApiError } from "@/lib/api/client";

const CLOSE_ANIMATION_MS = 180;

const QUICK_TITLES_AR = ["دعوة رائعة جداً!", "تجربة ممتازة", "أنصح بشدة", "خدمة احترافية", "أكثر من رائع"];
const QUICK_TITLES_EN = ["Absolutely amazing invitation!", "Excellent experience", "Highly recommend", "Professional service", "More than wonderful"];

const COUNTRIES = PHONE_CODES.map((entry) => entry.country);

const COPY = {
  ar: {
    title: "اكتب تقييماً",
    subtitle: "شاركنا تجربتك مع ZAYTORA",
    close: "إغلاق",
    rating: "التقييم *",
    fullName: "الاسم الكامل *",
    fullNamePlaceholder: "اسمك الكامل",
    reviewTitle: "عنوان التقييم *",
    reviewTitlePlaceholder: "لخّص تجربتك بجملة قصيرة",
    quickTitlesHint: "أو اختر من الاقتراحات",
    country: "الدولة *",
    selectCountry: "اختر الدولة",
    reviewText: "نص التقييم *",
    reviewTextPlaceholder: "أخبرنا المزيد عن تجربتك...",
    submit: "إرسال التقييم",
    submitting: "جارٍ الإرسال...",
    submitError: "تعذّر إرسال التقييم. حاول مرة أخرى.",
    reviewNote: "سيتم مراجعة تقييمك قبل نشره على الموقع",
    successTitle: "شكراً لتقييمك!",
    successBody: "استلمنا تقييمك وسيتم نشره بعد المراجعة.",
    successClose: "إغلاق",
  },
  en: {
    title: "Write a Review",
    subtitle: "Share your experience with ZAYTORA",
    close: "Close",
    rating: "Rating *",
    fullName: "Full Name *",
    fullNamePlaceholder: "Your full name",
    reviewTitle: "Review Title *",
    reviewTitlePlaceholder: "Sum up your experience in a short line",
    quickTitlesHint: "Or pick a suggestion",
    country: "Country *",
    selectCountry: "Select Country",
    reviewText: "Review Text *",
    reviewTextPlaceholder: "Tell us more about your experience...",
    submit: "Submit Review",
    submitting: "Submitting...",
    submitError: "Couldn't submit your review. Please try again.",
    reviewNote: "Your review will be reviewed before it appears on the site",
    successTitle: "Thanks for your review!",
    successBody: "We received your review — it'll go live once approved.",
    successClose: "Close",
  },
};

function fieldClass(extra?: string) {
  return cn(
    "w-full rounded-xl border border-border px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-[#C8A24A]",
    extra
  );
}

export function WriteReviewModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { language, dir } = useLanguage();
  const t = COPY[language];
  const quickTitles = language === "ar" ? QUICK_TITLES_AR : QUICK_TITLES_EN;

  const [mounted, setMounted] = useState(open);
  const [closing, setClosing] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [country, setCountry] = useState("");
  const [body, setBody] = useState("");

  function resetForm() {
    setRating(0);
    setHoverRating(0);
    setName("");
    setTitle("");
    setCountry("");
    setBody("");
    setSubmitted(false);
  }

  function requestClose() {
    setClosing(true);
    window.setTimeout(() => {
      setMounted(false);
      setClosing(false);
      resetForm();
    }, CLOSE_ANIMATION_MS);
  }

  useEffect(() => {
    if (open) {
      setMounted(true);
      setClosing(false);
    } else if (mounted) {
      requestClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!mounted) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [mounted, onClose]);

  if (!mounted) return null;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!rating || !name.trim() || !title.trim() || !country || !body.trim()) return;
    const countryFlag = PHONE_CODES.find((entry) => entry.country === country)?.flag ?? "🌐";

    setSubmitting(true);
    setSubmitError(null);
    try {
      await submitReview({ rating, name: name.trim(), title: title.trim(), body: body.trim(), country, countryFlag });
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof ApiError ? error.message : t.submitError);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.title}
      dir={dir}
      className={cn(
        "fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4",
        closing ? "animate-out fade-out duration-150" : "animate-in fade-in duration-200"
      )}
      onClick={onClose}
    >
      <div
        className={cn(
          "relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-y-auto rounded-2xl bg-background shadow-2xl",
          closing ? "animate-out fade-out zoom-out-95 duration-150" : "animate-in fade-in zoom-in-95 duration-200"
        )}
        onClick={(event) => event.stopPropagation()}
      >
        {submitted ? (
          <div className="flex flex-col items-center gap-4 px-8 py-14 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckIcon className="size-7" />
            </span>
            <h2 className="font-cinzel text-2xl font-bold text-foreground">{t.successTitle}</h2>
            <p className="max-w-sm text-sm text-body-foreground">{t.successBody}</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 rounded-xl bg-gradient-to-r from-[#C8A24A] to-[#A68832] px-8 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:shadow-lg"
            >
              {t.successClose}
            </button>
          </div>
        ) : (
          <>
            <div className="sticky top-0 z-10 flex shrink-0 items-start justify-between gap-3 rounded-t-2xl border-b border-border bg-background px-6 pb-5 pt-6">
              <div>
                <h2 className="font-cinzel text-xl font-bold text-foreground">{t.title}</h2>
                <p className="text-sm text-muted-foreground">{t.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={t.close}
                className="flex size-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-muted hover:text-body-foreground"
              >
                <XIcon className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
              <div>
                <label className="mb-2 block text-sm text-body-foreground">{t.rating}</label>
                <div className="flex items-center gap-1" dir="ltr" onMouseLeave={() => setHoverRating(0)}>
                  {Array.from({ length: 5 }).map((_, index) => {
                    const starValue = index + 1;
                    const filled = starValue <= (hoverRating || rating);
                    return (
                      <button
                        key={starValue}
                        type="button"
                        onClick={() => setRating(starValue)}
                        onMouseEnter={() => setHoverRating(starValue)}
                        aria-label={String(starValue)}
                        className="p-0.5"
                      >
                        <StarIcon
                          className={cn("size-7 transition-colors", filled ? "text-[#C8A24A]" : "text-gray-200")}
                          fill={filled ? "currentColor" : "none"}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-body-foreground">{t.fullName}</label>
                <input
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder={t.fullNamePlaceholder}
                  className={fieldClass()}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-body-foreground">{t.reviewTitle}</label>
                <input
                  required
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder={t.reviewTitlePlaceholder}
                  className={fieldClass()}
                />
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="self-center text-xs text-gray-400">{t.quickTitlesHint}:</span>
                  {quickTitles.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setTitle(suggestion)}
                      className={cn(
                        "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                        title === suggestion
                          ? "border-[#C8A24A] bg-[#C8A24A]/10 text-[#A68832]"
                          : "border-border text-body-foreground hover:border-border"
                      )}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-body-foreground">{t.country}</label>
                <select required value={country} onChange={(event) => setCountry(event.target.value)} className={fieldClass()}>
                  <option value="" disabled>
                    {t.selectCountry}
                  </option>
                  {COUNTRIES.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-body-foreground">{t.reviewText}</label>
                <textarea
                  required
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  placeholder={t.reviewTextPlaceholder}
                  rows={4}
                  className={fieldClass("resize-none")}
                />
              </div>

              {submitError && <p className="text-center text-sm text-rose-500">{submitError}</p>}

              <button
                type="submit"
                disabled={!rating || submitting}
                className="w-full rounded-xl bg-gradient-to-r from-[#C8A24A] to-[#A68832] py-3 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
              >
                {submitting ? t.submitting : t.submit}
              </button>
              <p className="text-center text-xs text-gray-400">{t.reviewNote}</p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
