"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const COPY = {
  ar: {
    heading: "ابدأ الإنشاء اليوم",
    subheading: "انضم إلى آلاف الأزواج الذين يثقون بـ ZAYTORA لمناسباتهم الخاصة.",
    cta: "أنشئ دعوتك",
  },
  en: {
    heading: "Start creating today",
    subheading: "Join thousands of couples who trust ZAYTORA for their special occasions.",
    cta: "Create your invitation",
  },
};

export function FinalCtaSection() {
  const { language } = useLanguage();
  const t = COPY[language];

  return (
    <section className="py-24 bg-black/15">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h2 className="font-cinzel text-3xl md:text-4xl font-semibold text-foreground mb-4">
          {t.heading}
        </h2>
        <p className="text-body-foreground mb-8">{t.subheading}</p>
        <Link
          href="/studio"
          className="inline-block bg-gradient-to-br from-[#C8A24A] to-[#A68832] text-white rounded-2xl px-7 py-3.5 text-sm font-semibold hover:scale-[1.02] hover:shadow-2xl active:scale-[0.97] transition-all duration-200"
        >
          {t.cta}
        </Link>
      </div>
    </section>
  );
}
