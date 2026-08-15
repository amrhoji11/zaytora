"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { getInitials } from "@/lib/utils"
import { useLanguage } from "@/context/LanguageContext"
import { listApprovedPartners } from "@/lib/services/partners.service"
import type { ApprovedPartnerDto } from "@/types/api"

const COPY = {
  ar: {
    eyebrow: "شبكة الشركاء",
    heading: "شركاؤنا",
    subheading: "محترفون موثوقون يستخدمون ZAYTORA لإنشاء دعوات رائعة.",
    joinUs: "انضم إلينا",
    empty: "لا يوجد شركاء معتمدون حالياً - انضم إلينا لتكون أول شركائنا!",
  },
  en: {
    eyebrow: "Partner network",
    heading: "Our Partners",
    subheading: "Trusted professionals who use ZAYTORA to create wonderful invitations.",
    joinUs: "Join us",
    empty: "No approved partners yet — join us to be our first partner!",
  },
}

function PartnerChip({ partner }: { partner: ApprovedPartnerDto }) {
  return (
    <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm">
      {partner.logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- cross-origin (API host), not worth next.config remotePatterns for a small avatar
        <img src={partner.logoUrl} alt="" className="size-11 shrink-0 rounded-xl object-cover" />
      ) : (
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#C8A24A] to-[#A68832] text-sm font-semibold text-white">
          {getInitials(partner.name)}
        </span>
      )}
      <div className="min-w-0">
        <p className="max-w-[150px] truncate text-sm font-semibold text-foreground">{partner.name}</p>
        <p className="truncate text-xs text-muted-foreground">
          {partner.countryFlag} {partner.country}
        </p>
      </div>
    </div>
  )
}

// Below this count, an infinite-scroll marquee just loops a couple of
// lonely chips back and forth — a plain centered row reads far cleaner.
const MARQUEE_MIN_COUNT = 8

export function PartnersSection() {
  const { language } = useLanguage()
  const t = COPY[language]
  const [approvedPartners, setApprovedPartners] = useState<ApprovedPartnerDto[]>([])

  useEffect(() => {
    let cancelled = false
    listApprovedPartners()
      .then((data) => {
        if (!cancelled) setApprovedPartners(data)
      })
      .catch((error) => console.error("[PartnersSection] failed to load partners:", error))
    return () => {
      cancelled = true
    }
  }, [])

  // De-duplicate by id first — every render path below assumes each
  // approved partner appears at most once in this list.
  const uniquePartners = useMemo(() => {
    const seen = new Set<string>()
    return approvedPartners.filter((partner) => {
      if (seen.has(partner.id)) return false
      seen.add(partner.id)
      return true
    })
  }, [approvedPartners])

  const useMarquee = uniquePartners.length >= MARQUEE_MIN_COUNT

  // Duplicated once for a seamless marquee loop — only ever done here, for
  // the large-list marquee path, never for the small static grid below.
  const marqueePartners = useMemo(
    () => (useMarquee ? [...uniquePartners, ...uniquePartners] : []),
    [useMarquee, uniquePartners]
  )

  return (
    <section id="partners" className="py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-10 text-center">
        <p className="text-sm text-[#C8A24A] font-medium tracking-widest uppercase mb-3">
          {t.eyebrow}
        </p>
        <h2 className="font-cinzel text-3xl md:text-4xl font-semibold text-foreground mb-4">
          {t.heading}
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto text-sm">
          {t.subheading}
        </p>
      </div>

      {uniquePartners.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4">
          <p className="mx-auto max-w-md rounded-2xl border border-dashed border-border bg-background/5 py-8 text-center text-sm text-muted-foreground">
            {t.empty}
          </p>
        </div>
      ) : useMarquee ? (
        <div className="relative">
          <div className="absolute top-0 bottom-0 left-0 w-20 z-10 pointer-events-none bg-gradient-to-r from-background to-transparent" />
          <div className="absolute top-0 bottom-0 right-0 w-20 z-10 pointer-events-none bg-gradient-to-l from-background to-transparent" />

          <div className="overflow-hidden">
            <div className="flex justify-center gap-4 items-center [animation:partnersScroll_45s_linear_infinite] w-max mx-auto">
              {marqueePartners.map((partner, i) => (
                <PartnerChip key={`${partner.id}-${i}`} partner={partner} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-6">
            {uniquePartners.map((partner) => (
              <PartnerChip key={partner.id} partner={partner} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 flex justify-center">
        <Link
          href="/OurPartners"
          className="bg-background/10 border border-[#C8A24A]/30 text-foreground rounded-2xl px-6 py-3.5 text-sm font-semibold"
        >
          {t.joinUs}
        </Link>
      </div>
    </section>
  )
}
