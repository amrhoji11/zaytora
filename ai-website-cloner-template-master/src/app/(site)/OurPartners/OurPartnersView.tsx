"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { CheckIcon, LoaderIcon, SearchIcon } from "@/components/icons";
import { useLanguage } from "@/context/LanguageContext";
import { PARTNER_CATEGORIES } from "@/lib/partnersData";
import { listApprovedPartners } from "@/lib/services/partners.service";
import { PartnerCard } from "@/components/partners/PartnerCard";
import { PartnerApplicationModal } from "@/components/partners/PartnerApplicationModal";
import type { ApprovedPartnerDto, PartnerCategory } from "@/types/api";

type CategoryFilter = "all" | PartnerCategory;

const CATEGORY_LABELS: Record<CategoryFilter, { ar: string; en: string }> = {
  all: { ar: "الكل", en: "All" },
  eventPlanner: { ar: "منظمو المناسبات", en: "Event Planners" },
  photographer: { ar: "المصورون", en: "Photographers" },
  designer: { ar: "المصممون", en: "Designers" },
  other: { ar: "أخرى", en: "Other" },
};

const COPY = {
  ar: {
    eyebrow: "شركاء موثوقون",
    heading: "شركاؤنا",
    subheading: "تعرّف على المحترفين المبدعين الذين يحيون الاحتفالات باستخدام منصتنا.",
    statsPartners: "شريك",
    statsReview: "وقت المراجعة",
    statsCountries: "دولة",
    allCountries: "كل الدول",
    searchPlaceholder: "ابحث عن شريك...",
    emptyState: "لا يوجد شركاء مطابقون لبحثك.",
    becomePartnerHeading: "كن شريكاً",
    becomePartnerSubheading: "انضم إلى شبكتنا المتنامية من المحترفين المبدعين ونمِّ عملك مع ZAYTORA.",
    perk1: "أسعار مخفضة على المشتريات",
    perk2: "بدون رسوم تسجيل أو رسوم سنوية",
    perk3: "علامتك التجارية على موقعنا",
    applyNow: "قدّم الآن",
    reviewNote: "نراجع جميع الطلبات خلال 24 ساعة",
  },
  en: {
    eyebrow: "Trusted partners",
    heading: "Our Partners",
    subheading: "Meet the creative professionals who bring celebrations to life using our platform.",
    statsPartners: "Partners",
    statsReview: "Review Time",
    statsCountries: "Countries",
    allCountries: "All Countries",
    searchPlaceholder: "Search partners...",
    emptyState: "No partners match your search.",
    becomePartnerHeading: "Become a Partner",
    becomePartnerSubheading: "Join our growing network of creative professionals and grow your business with ZAYTORA.",
    perk1: "Discounted prices on purchases",
    perk2: "No registration or annual fees",
    perk3: "Your brand featured on our website",
    applyNow: "Apply Now",
    reviewNote: "We review all applications within 24 hours",
  },
};

export function OurPartnersView() {
  const { language } = useLanguage();
  const t = COPY[language];
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [country, setCountry] = useState("all");
  const [applyOpen, setApplyOpen] = useState(false);
  const [partners, setPartners] = useState<ApprovedPartnerDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    listApprovedPartners()
      .then((data) => {
        if (!cancelled) setPartners(data);
      })
      .catch((error) => console.error("[OurPartners] failed to load partners:", error))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const partnerCountries = useMemo(
    () => Array.from(new Set(partners.map((partner) => partner.country))).sort(),
    [partners]
  );

  const filteredPartners = useMemo(() => {
    const query = search.trim().toLowerCase();
    return partners.filter((partner) => {
      if (category !== "all" && partner.category !== category) return false;
      if (country !== "all" && partner.country !== country) return false;
      if (query && !partner.name.toLowerCase().includes(query)) return false;
      return true;
    });
  }, [partners, search, category, country]);

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero */}
        <div className="text-center mb-10">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-[#C8A24A]/30 bg-[#C8A24A]/5 px-3 py-1 text-xs font-medium uppercase tracking-widest text-[#C8A24A] mb-4">
            🤝 {t.eyebrow}
          </p>
          <h1 className="font-cinzel text-4xl md:text-5xl font-bold text-foreground mb-4">{t.heading}</h1>
          <p className="text-body-foreground max-w-xl mx-auto">{t.subheading}</p>

          <div className="mt-8 inline-flex items-center gap-6 rounded-2xl border border-border bg-card px-8 py-4 shadow-sm">
            <div className="text-center">
              <p className="text-xl font-bold text-foreground" dir="ltr">
                {partners.length}
              </p>
              <p className="text-xs text-muted-foreground">{t.statsPartners}</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <p className="text-xl font-bold text-foreground" dir="ltr">
                24h
              </p>
              <p className="text-xs text-muted-foreground">{t.statsReview}</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <p className="text-xl font-bold text-foreground" dir="ltr">
                {partnerCountries.length}
              </p>
              <p className="text-xs text-muted-foreground">{t.statsCountries}</p>
            </div>
          </div>
        </div>

        {/* Search & filters */}
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {(["all", ...PARTNER_CATEGORIES] as CategoryFilter[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setCategory(key)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200",
                  category === key
                    ? "border-transparent bg-[#C8A24A] text-white"
                    : "border-border bg-background/5 text-muted-foreground hover:border-[#C8A24A]/40 hover:text-foreground"
                )}
              >
                {CATEGORY_LABELS[key][language]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              className="rounded-full border border-border bg-background/5 px-4 py-2 text-sm text-body-foreground outline-none transition-colors focus:border-[#C8A24A]"
            >
              <option value="all">{t.allCountries}</option>
              {partnerCountries.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>

            <div className="relative">
              <SearchIcon className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-44 rounded-full border border-border bg-background/5 py-2 ps-9 pe-4 text-sm text-foreground outline-none transition-colors focus:border-[#C8A24A] sm:w-56"
              />
            </div>
          </div>
        </div>

        {/* Grid — a plain CSS grid stretches a lone item into the first
            column and leaves the rest of the row empty (collapsing it
            toward one edge in RTL). Below a full row's worth of partners,
            a centered flex-wrap keeps the cards visually centered instead. */}
        {loading ? (
          <div className="mb-16 flex justify-center py-16">
            <LoaderIcon className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : filteredPartners.length > 0 ? (
          filteredPartners.length < 4 ? (
            <div className="mb-16 flex flex-wrap justify-center gap-5">
              {filteredPartners.map((partner) => (
                <div key={partner.id} className="w-full max-w-sm sm:w-72">
                  <PartnerCard partner={partner} />
                </div>
              ))}
            </div>
          ) : (
            <div className="mb-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredPartners.map((partner) => (
                <PartnerCard key={partner.id} partner={partner} />
              ))}
            </div>
          )
        ) : (
          <p className="mb-16 py-16 text-center text-muted-foreground">{t.emptyState}</p>
        )}

        {/* Become a partner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#C8A24A] to-[#A68832] px-6 py-14 text-center text-white md:px-16">
          <div className="absolute -top-10 -start-10 size-72 rounded-full bg-background opacity-20 blur-3xl" />
          <div className="absolute -bottom-10 -end-10 size-72 rounded-full bg-background opacity-20 blur-3xl" />

          <div className="relative">
            <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-background/20 text-2xl">
              🤝
            </span>
            <h2 className="font-cinzel text-3xl font-bold mb-3 md:text-4xl">{t.becomePartnerHeading}</h2>
            <p className="mx-auto mb-6 max-w-lg text-white/85">{t.becomePartnerSubheading}</p>

            <div className="mb-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
              {[t.perk1, t.perk2, t.perk3].map((perk) => (
                <span key={perk} className="flex items-center gap-1.5">
                  <span className="flex size-4 items-center justify-center rounded-full bg-background/25">
                    <CheckIcon className="size-2.5" />
                  </span>
                  {perk}
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setApplyOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-background px-8 py-3 text-sm font-semibold text-[#A68832] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            >
              🤝 {t.applyNow}
            </button>

            <p className="mt-4 text-xs text-white/70">{t.reviewNote}</p>
          </div>
        </div>
      </div>

      <PartnerApplicationModal open={applyOpen} onClose={() => setApplyOpen(false)} />
    </div>
  );
}
