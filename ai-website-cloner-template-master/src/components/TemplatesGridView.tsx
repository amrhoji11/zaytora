"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { TemplateCard } from "@/components/templates/TemplateCard";
import type { TemplateDto } from "@/types/api";

const COPY = {
  ar: {
    eyebrow: "القوالب",
    heading: "المفضلة لدى عملائنا",
    subheading: "استكشف بعضاً من تصاميم دعواتنا الرقمية الأكثر شعبية.",
    viewAll: "عرض جميع القوالب",
  },
  en: {
    eyebrow: "Templates",
    heading: "Loved by our customers",
    subheading: "Explore some of our most popular digital invitation designs.",
    viewAll: "View all templates",
  },
};

export function TemplatesGridView({ templates }: { templates: TemplateDto[] }) {
  const { language } = useLanguage();
  const t = COPY[language];

  return (
    <section>
      <div className="text-center mb-14">
        <p className="text-sm text-[#C8A24A] font-medium tracking-widest uppercase mb-3">
          {t.eyebrow}
        </p>
        <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-foreground mb-4">
          {t.heading}
        </h2>
        <p className="text-body-foreground">{t.subheading}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
        {templates.map((template) => (
          <TemplateCard key={template.code} template={template} dark />
        ))}
      </div>

      <div className="text-center mt-12">
        <Link
          href="/templates"
          className="inline-block bg-background/10 border border-[#C8A24A]/30 text-foreground rounded-2xl px-6 py-3.5 text-sm font-semibold hover:bg-background/15 transition-colors"
        >
          {t.viewAll}
        </Link>
      </div>
    </section>
  );
}
