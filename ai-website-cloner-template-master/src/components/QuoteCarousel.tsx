"use client"

import { useEffect, useState } from "react"
import { StarIcon } from "@/components/icons"

const QUOTES = [
  "اكثر من رائعه خلال فتره بسيطه انتهيت من اعداد دعوة فاخره وبتصميم احترافي وحديث وحصري وعملية جداً",
  "فكرة مميزة جدا اكتر من رائعة رهيبة وفخمة الكل انبهر فيها، شكرا لأنكم كنتو جزء من هادي الفرحة",
  "ممتاز و راقيين فى التعامل",
  "أريد العمل في هذا المجال .لا يوجد إشتراك شهري !",
  "جدا روعة وتعاون المسؤولين",
  "🤍👍🏻👍🏻👍🏻",
  "Thank you to the team for helping me make my invitation wonderful 😍 highly recommend them!",
  "منظم وممتع",
  "دعوة رائعةة جداا جداا وتعامل ولا اروعع بتجننن الدعوةة كتيررر بتستاهل كل ريال وزيادةةة",
] as const

const ROTATE_INTERVAL_MS = 4500

interface QuoteCardProps {
  quote: string
  quoteKey: number
}

function QuoteCard({ quote, quoteKey }: QuoteCardProps) {
  return (
    <div className="relative overflow-hidden rounded-[14px] p-4 md:p-5">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon
            key={i}
            fill="currentColor"
            className="h-4 w-4 text-[#C8A24A]"
          />
        ))}
      </div>
      <p
        key={quoteKey}
        className="mt-3 text-sm text-gray-700 transition-opacity duration-500 animate-in fade-in fill-mode-forwards"
      >
        {'"'}
        {quote}
        {'"'}
      </p>
    </div>
  )
}

export function QuoteCarousel() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % QUOTES.length)
    }, ROTATE_INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  const quoteAt = (offset: number) => QUOTES[(index + offset) % QUOTES.length]

  return (
    <div className="rounded-3xl border-[1.2px] border-[rgba(200,162,74,0.2)] bg-transparent p-6 md:p-8">
      <div className="hidden w-full gap-3 md:grid md:grid-cols-3">
        {[0, 1, 2].map((offset) => (
          <QuoteCard
            key={offset}
            quote={quoteAt(offset)}
            quoteKey={(index + offset) % QUOTES.length}
          />
        ))}
      </div>
      <div className="grid md:hidden">
        <QuoteCard quote={quoteAt(0)} quoteKey={index} />
      </div>
    </div>
  )
}
