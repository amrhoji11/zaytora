"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { LoaderIcon, StarIcon } from "@/components/icons";
import { getTemplates } from "@/lib/services/templates.service";
import type { TemplateDto } from "@/types/api";
import type { InvitationDetail } from "@/types/studio";

export function Step03Template({
  value,
  onChange,
}: {
  value: InvitationDetail;
  onChange: (patch: Partial<InvitationDetail>) => void;
}) {
  const [templates, setTemplates] = useState<TemplateDto[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const filtered = value.occasionType ? await getTemplates(value.occasionType) : [];
        if (cancelled) return;
        setTemplates(filtered.length > 0 ? filtered : await getTemplates());
      } catch {
        if (!cancelled) setTemplates([]);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [value.occasionType]);

  if (templates === null) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-400">
        <LoaderIcon className="size-5 animate-spin" />
      </div>
    );
  }

  if (templates.length === 0) {
    return <p className="py-8 text-center text-sm text-gray-400">لا توجد قوالب متاحة حالياً لهذه المناسبة.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {templates.map((template) => {
        const selected = template.id === value.templateId;
        return (
          <button
            key={template.id}
            type="button"
            onClick={() => onChange({ templateId: template.id })}
            className={cn(
              "flex flex-col items-center gap-2 rounded-xl border-2 p-2 transition-all",
              selected ? "border-gold bg-gold/5" : "border-gray-200 hover:border-gold/40"
            )}
          >
            <div className="relative w-full">
              {template.isPopular && (
                <span className="absolute -top-1.5 -right-1.5 z-10 flex items-center gap-0.5 rounded-full bg-gradient-to-r from-gold to-gray-900 px-1.5 py-0.5 text-[9px] font-medium text-white">
                  <StarIcon className="size-2.5" />
                  POPULAR
                </span>
              )}
              <div className="relative aspect-[9/16] w-full overflow-hidden rounded-lg bg-gray-100">
                <Image src={template.imageUrl} alt={template.code} fill className="object-cover" sizes="140px" />
              </div>
            </div>
            <span className="text-xs font-medium text-gray-700">{template.code}</span>
          </button>
        );
      })}
    </div>
  );
}
