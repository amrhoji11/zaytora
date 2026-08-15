"use client";

import Link from "next/link";
import { CATEGORY_META, CATEGORY_LABELS } from "@/lib/categories";
import { useLanguage } from "@/context/LanguageContext";

export function CategoryPills() {
  const { language } = useLanguage();
  const labels = CATEGORY_LABELS[language];

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-12">
      {CATEGORY_META.map(({ id, icon: Icon, color }) => (
        <Link key={id} href={`/templates?category=${id}`} className="flex flex-col items-center gap-2 group">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:scale-110"
            style={{ backgroundColor: "#F5F0E8" }}
          >
            <Icon size={24} style={{ color }} />
          </div>
          <span className="text-sm text-body-foreground text-center">{labels[id]}</span>
        </Link>
      ))}
    </div>
  );
}
