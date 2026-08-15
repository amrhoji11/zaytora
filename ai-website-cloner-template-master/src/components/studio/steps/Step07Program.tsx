"use client";

import { ToggleField } from "@/components/studio/fields/ToggleField";
import { ListEditor } from "@/components/studio/fields/ListEditor";
import { HintBox } from "@/components/studio/fields/HintBox";
import { useLanguage } from "@/context/LanguageContext";
import type { InvitationDetail, ProgramItem } from "@/types/studio";

const COPY = {
  ar: {
    hint: "مثال: استقبال الضيوف 6:00 م ← العشاء 7:30 م ← حفل الزفاف 9:00 م",
    showProgram: "عرض برنامج الحفل",
    showProgramDescription: "عرض البرنامج في الدعوة",
    addItem: "إضافة بند",
    emptyItems: "لم تتم إضافة بنود بعد",
    itemTitlePlaceholder: "عنوان البند",
  },
  en: {
    hint: "Example: Guest arrival 6:00 PM ← Dinner 7:30 PM ← Wedding ceremony 9:00 PM",
    showProgram: "Show event program",
    showProgramDescription: "Show the program in the invitation",
    addItem: "Add item",
    emptyItems: "No items added yet",
    itemTitlePlaceholder: "Item title",
  },
};

export function Step07Program({
  value,
  onChange,
}: {
  value: InvitationDetail;
  onChange: (patch: Partial<InvitationDetail>) => void;
}) {
  const { language } = useLanguage();
  const t = COPY[language];

  return (
    <div className="space-y-5">
      <HintBox>{t.hint}</HintBox>

      <ToggleField
        label={t.showProgram}
        description={t.showProgramDescription}
        checked={value.showEventProgram}
        onChange={(showEventProgram) =>
          onChange(showEventProgram ? { showEventProgram } : { showEventProgram, programItems: [] })
        }
      />

      {value.showEventProgram && (
        <ListEditor<ProgramItem>
          items={value.programItems}
          onChange={(programItems) => onChange({ programItems })}
          createItem={() => ({ time: "", title: "" })}
          addLabel={t.addItem}
          emptyLabel={t.emptyItems}
          renderItem={(item, update) => (
            <div className="flex gap-2">
              <input
                type="time"
                value={item.time ?? ""}
                onChange={(event) => update({ time: event.target.value })}
                className="w-32 rounded-lg border border-border bg-background/5 px-2 py-2 text-sm text-foreground outline-none [color-scheme:dark] focus:border-gold"
              />
              <input
                type="text"
                value={item.title}
                placeholder={t.itemTitlePlaceholder}
                onChange={(event) => update({ title: event.target.value })}
                className="flex-1 rounded-lg border border-border bg-background/5 px-3 py-2 text-sm text-foreground outline-none focus:border-gold"
              />
            </div>
          )}
        />
      )}
    </div>
  );
}
