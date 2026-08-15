"use client"

import { useEffect, useState } from "react"
import { StarIcon } from "@/components/icons"
import { listApprovedReviews } from "@/lib/services/reviews.service"

const ROTATE_INTERVAL_MS = 4500

interface QuoteCardProps {
  quote: string
  rating: number
  quoteKey: string
}

function QuoteCard({ quote, rating, quoteKey }: QuoteCardProps) {
  return (
    <div className="relative overflow-hidden rounded-[14px] p-4 md:p-5">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon
            key={i}
            fill={i < rating ? "currentColor" : "none"}
            className={`h-4 w-4 ${i < rating ? "text-[#C8A24A]" : "text-gray-200"}`}
          />
        ))}
      </div>
      <p
        key={quoteKey}
        className="mt-3 text-sm text-body-foreground transition-opacity duration-500 animate-in fade-in fill-mode-forwards"
      >
        {'"'}
        {quote}
        {'"'}
      </p>
    </div>
  )
}

// Rotates through real approved reviews (same source as TestimonialsSection
// further down the page) — renders nothing until at least one exists,
// rather than filling the gap with fabricated quotes.
export function QuoteCarousel() {
  const [quotes, setQuotes] = useState<{ id: string; text: string; rating: number }[]>([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    let cancelled = false
    listApprovedReviews()
      .then((reviews) => {
        if (cancelled) return
        setQuotes(reviews.map((r) => ({ id: r.id, text: r.title ? `${r.title} — ${r.body}` : r.body, rating: r.rating })))
      })
      .catch((error) => console.error("[QuoteCarousel] failed to load reviews:", error))
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (quotes.length === 0) return
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length)
    }, ROTATE_INTERVAL_MS)
    return () => clearInterval(id)
  }, [quotes.length])

  if (quotes.length === 0) return null

  const quoteAt = (offset: number) => quotes[(index + offset) % quotes.length]

  return (
    <div className="rounded-3xl border-[1.2px] border-[rgba(200,162,74,0.2)] bg-transparent p-6 md:p-8">
      <div className="hidden w-full gap-3 md:grid md:grid-cols-3">
        {[0, 1, 2].map((offset) => {
          const q = quoteAt(offset)
          return <QuoteCard key={offset} quote={q.text} rating={q.rating} quoteKey={`${q.id}-${offset}`} />
        })}
      </div>
      <div className="grid md:hidden">
        <QuoteCard quote={quoteAt(0).text} rating={quoteAt(0).rating} quoteKey={quoteAt(0).id} />
      </div>
    </div>
  )
}
