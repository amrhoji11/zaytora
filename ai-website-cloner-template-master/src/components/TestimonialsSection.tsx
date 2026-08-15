"use client"

import { useEffect, useMemo, useState } from "react"
import { StarIcon } from "@/components/icons"
import { useLanguage } from "@/context/LanguageContext"
import { listApprovedReviews } from "@/lib/services/reviews.service"
import { WriteReviewModal } from "@/components/reviews/WriteReviewModal"
import type { ReviewDto } from "@/types/api"

function formatReviewDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

const AVATAR_PALETTE = ["#C8A24A", "#8DA9C4", "#8FB996", "#D497B0"]

const COPY = {
  ar: {
    eyebrow: "آراء العملاء",
    heading: "ماذا يقول عملاؤنا",
    basedOn: (count: number) => `بناءً على ${count} تقييم`,
    unknownInitial: "؟",
    writeReview: "اكتب تقييماً",
    empty: "كن أول من يشارك تجربته معنا.",
  },
  en: {
    eyebrow: "Customer reviews",
    heading: "What our customers say",
    basedOn: (count: number) => `Based on ${count} reviews`,
    unknownInitial: "?",
    writeReview: "Write a Review",
    empty: "Be the first to share your experience with us.",
  },
}

interface StarRowProps {
  count: number
  className?: string
}

function StarRow({ count, className = "h-4 w-4" }: StarRowProps) {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon
          key={i}
          className={`${className} ${i < count ? "text-[#C8A24A]" : "text-gray-200"}`}
          fill={i < count ? "currentColor" : "none"}
        />
      ))}
    </>
  )
}

interface ReviewCardProps {
  review: ReviewDto
  index: number
  unknownInitial: string
}

function ReviewCard({ review, index, unknownInitial }: ReviewCardProps) {
  const initial = review.name.trim().charAt(0) || unknownInitial
  const avatarColor = AVATAR_PALETTE[index % AVATAR_PALETTE.length]

  return (
    <div className="relative bg-card rounded-2xl p-6 border border-border hover:border-[#C8A24A]/40 transition-colors">
      <div className="flex gap-0.5 mb-3">
        <StarRow count={review.rating} />
      </div>
      {review.title && <p className="mb-1 text-sm font-semibold text-foreground">{review.title}</p>}
      <p className="text-sm text-body-foreground mb-4">{review.body}</p>
      <div className="flex items-center gap-2">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
          style={{ backgroundColor: avatarColor }}
        >
          {initial}
        </span>
        <span className="text-sm font-medium text-foreground">{review.name}</span>
        {review.countryFlag && <span className="text-sm">{review.countryFlag}</span>}
        <span className="text-xs text-muted-foreground ms-auto">{formatReviewDate(review.submittedAt)}</span>
      </div>
    </div>
  )
}

export function TestimonialsSection() {
  const { language } = useLanguage()
  const t = COPY[language]
  const [writeOpen, setWriteOpen] = useState(false)
  const [approvedReviews, setApprovedReviews] = useState<ReviewDto[]>([])

  // Only reviews approved from /admin/reviews ever render here — pending
  // submissions stay invisible to the public site until moderated.
  useEffect(() => {
    let cancelled = false
    listApprovedReviews()
      .then((data) => {
        if (!cancelled) setApprovedReviews(data)
      })
      .catch((error) => console.error("[TestimonialsSection] failed to load reviews:", error))
    return () => {
      cancelled = true
    }
  }, [])

  const reviews = useMemo(
    () => [...approvedReviews].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()),
    [approvedReviews]
  )

  const { averageRating, totalRatings, ratingBreakdown } = useMemo(() => {
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    for (const review of approvedReviews) counts[review.rating] = (counts[review.rating] ?? 0) + 1

    const total = approvedReviews.length
    const weighted = approvedReviews.reduce((sum, review) => sum + review.rating, 0)

    return {
      averageRating: total ? (weighted / total).toFixed(1) : "0.0",
      totalRatings: total,
      ratingBreakdown: [5, 4, 3, 2, 1].map((stars) => ({ stars, count: counts[stars] ?? 0 })),
    }
  }, [approvedReviews])

  return (
    <section className="py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-sm text-[#C8A24A] font-medium tracking-widest uppercase mb-3">
            {t.eyebrow}
          </p>
          <h2 className="font-cinzel text-3xl md:text-4xl font-semibold text-foreground mb-4">
            {t.heading}
          </h2>
          <button
            type="button"
            onClick={() => setWriteOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#C8A24A] px-5 py-2 text-sm font-medium text-[#A68832] transition-colors hover:bg-[#C8A24A]/10"
          >
            <StarIcon className="size-3.5" fill="currentColor" />
            {t.writeReview}
          </button>
        </div>

        {totalRatings > 0 && (
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12">
            <div className="flex flex-col items-center gap-2 bg-card rounded-3xl px-10 py-8 border border-border">
              <span className="font-cinzel text-5xl font-semibold text-foreground">
                {averageRating}
              </span>
              <div className="flex gap-0.5">
                <StarRow count={5} className="h-5 w-5" />
              </div>
              <span className="text-xs text-muted-foreground mt-1">{t.basedOn(totalRatings)}</span>
            </div>

            <div className="w-full max-w-xs space-y-2">
              {ratingBreakdown.map(({ stars, count }) => (
                <div key={stars} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-3">{stars}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-background/10">
                    <div
                      className="h-1.5 rounded-full bg-[#C8A24A]"
                      style={{ width: `${(count / totalRatings) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-6 text-end">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {reviews.length > 0 ? (
          <div className="max-h-[560px] overflow-y-auto pr-1">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 pb-2">
              {reviews.map((review, index) => (
                <ReviewCard key={review.id} review={review} index={index} unknownInitial={t.unknownInitial} />
              ))}
            </div>
          </div>
        ) : (
          <p className="py-10 text-center text-muted-foreground">{t.empty}</p>
        )}
      </div>

      <WriteReviewModal open={writeOpen} onClose={() => setWriteOpen(false)} />
    </section>
  )
}
