"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { LoaderIcon, SearchIcon } from "@/components/icons";
import { useLanguage } from "@/context/LanguageContext";
import { CATEGORY_META, CATEGORY_LABELS, isCategoryId, type CategoryId } from "@/lib/categories";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { getTemplates } from "@/lib/services/templates.service";
import type { TemplateDto } from "@/types/api";

type SortMode = "newest" | "popular";

const COPY = {
  ar: {
    heading: "كتالوج القوالب",
    subheading: "تصفح مجموعتنا من قوالب الدعوات المصممة بعناية، وابحث حسب الفئة عن تصميمك المناسب.",
    all: "الكل",
    searchPlaceholder: "ابحث في القوالب...",
    sortNewest: "الأحدث",
    sortPopular: "الأكثر شيوعاً",
    resultsCount: (count: number) => `تم العثور على ${count} قالب`,
    empty: "لا توجد قوالب مطابقة.",
  },
  en: {
    heading: "Template Catalog",
    subheading: "Browse our collection of carefully crafted invitation templates, and search by category for the right design.",
    all: "All",
    searchPlaceholder: "Search templates...",
    sortNewest: "Newest",
    sortPopular: "Most Popular",
    resultsCount: (count: number) => `${count} templates found`,
    empty: "No matching templates.",
  },
};

export function TemplatesPageView() {
  const { language } = useLanguage();
  const t = COPY[language];
  const router = useRouter();
  const searchParams = useSearchParams();
  const [templates, setTemplates] = useState<TemplateDto[] | null>(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortMode>("newest");

  // The backend Template entity has no active/inactive flag (unlike the old
  // localStorage mock) — every seeded template is implicitly live, so no
  // isActive filtering is needed here.
  useEffect(() => {
    let cancelled = false;
    getTemplates()
      .then((list) => {
        if (!cancelled) setTemplates(list);
      })
      .catch(() => {
        if (!cancelled) setTemplates([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // The URL is the single source of truth for the active category — a pill
  // click just navigates, so back/forward and direct links (e.g. the
  // homepage category icons) all land on the correct tab with no extra
  // state-sync effect needed.
  const rawCategory = searchParams.get("category");
  const activeCategory: CategoryId | "all" = isCategoryId(rawCategory) ? rawCategory : "all";

  function selectCategory(id: CategoryId | "all") {
    router.push(id === "all" ? "/templates" : `/templates?category=${id}`);
  }

  const visibleTemplates = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = (templates ?? []).filter((template) => {
      if (activeCategory !== "all" && template.category !== activeCategory) return false;
      if (query && !template.code.toLowerCase().includes(query) && !template.category.toLowerCase().includes(query)) {
        return false;
      }
      return true;
    });

    // TemplateDto has no createdAt (unlike the old localStorage mock), so
    // "newest" keeps the backend's own seed order. "popular" mirrors the
    // backend's own ranking: manual isPopular pin first, then real usage
    // (invitations actually built on that template).
    if (sort === "popular") {
      return [...filtered].sort(
        (a, b) => Number(b.isPopular) - Number(a.isPopular) || b.usageCount - a.usageCount
      );
    }
    return filtered;
  }, [templates, activeCategory, search, sort]);

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-cinzel text-3xl md:text-4xl font-semibold text-foreground mb-2">{t.heading}</h1>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">{t.subheading}</p>
        </div>

        {/* Search + sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t.searchPlaceholder}
              className="flex w-full border px-3 py-1 shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C8A24A] ps-9 bg-background/5 border-border text-foreground rounded-xl h-11 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSort("newest")}
              className={cn(
                "px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
                sort === "newest" ? "bg-[#C8A24A] text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t.sortNewest}
            </button>
            <button
              type="button"
              onClick={() => setSort("popular")}
              className={cn(
                "px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
                sort === "popular" ? "bg-[#C8A24A] text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t.sortPopular}
            </button>
          </div>
        </div>

        {/* Category filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          <button
            type="button"
            onClick={() => selectCategory("all")}
            className={cn(
              "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all whitespace-nowrap",
              activeCategory === "all"
                ? "bg-[#C8A24A] text-white border-transparent shadow-sm"
                : "bg-background/5 text-muted-foreground border-border hover:border-[#C8A24A]/40 hover:text-foreground"
            )}
          >
            {t.all}
          </button>
          {CATEGORY_META.map(({ id }) => (
            <button
              key={id}
              type="button"
              onClick={() => selectCategory(id)}
              className={cn(
                "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all whitespace-nowrap",
                activeCategory === id
                  ? "bg-[#C8A24A] text-white border-transparent shadow-sm"
                  : "bg-background/5 text-muted-foreground border-border hover:border-[#C8A24A]/40 hover:text-foreground"
              )}
            >
              {CATEGORY_LABELS[language][id]}
            </button>
          ))}
        </div>

        {/* Results count */}
        {templates !== null && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">{t.resultsCount(visibleTemplates.length)}</p>
          </div>
        )}

        {/* Main grid */}
        {templates === null ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <LoaderIcon className="size-6 animate-spin" />
          </div>
        ) : visibleTemplates.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {visibleTemplates.map((template) => (
              <TemplateCard key={template.code} template={template} dark />
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-muted-foreground">{t.empty}</p>
        )}
      </div>
    </div>
  );
}
