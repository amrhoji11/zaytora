"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { CheckIcon, LoaderIcon, StarIcon } from "@/components/icons";
import { getTemplates } from "@/lib/services/templates.service";
import type { TemplateDto } from "@/types/api";
import type { InvitationDetail } from "@/types/studio";

const CATEGORY_LABELS: Record<string, string> = {
  wedding: "زفاف",
  engagement: "خطوبة",
  henna: "حنة",
  marriage_contract: "عقد قران",
};

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
    <div className="flex flex-col gap-2">
      {templates.map((template) => {
        const selected = template.id === value.templateId;
        return (
          <button
            key={template.id}
            type="button"
            onClick={() => onChange({ templateId: template.id })}
            className={cn(
              "flex items-center gap-3 rounded-xl border-2 p-2 text-start transition-all",
              selected ? "border-gold bg-gold/5" : "border-gray-200 hover:border-gold/40"
            )}
          >
            <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
              <Image src={template.imageUrl} alt={template.code} fill className="object-cover" sizes="56px" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium text-gray-900">{template.code}</span>
                {template.isPopular && (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-gradient-to-r from-gold to-gray-900 px-1.5 py-0.5 text-[9px] font-medium text-white">
                    <StarIcon className="size-2.5" />
                    POPULAR
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-400">{CATEGORY_LABELS[template.category] ?? template.category}</span>
            </div>
            {selected && (
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-gold text-white">
                <CheckIcon className="size-3" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
