import { ToggleField } from "@/components/studio/fields/ToggleField";
import { ListEditor } from "@/components/studio/fields/ListEditor";
import { HintBox } from "@/components/studio/fields/HintBox";
import type { InvitationDetail, ProgramItem } from "@/types/studio";

export function Step07Program({
  value,
  onChange,
}: {
  value: InvitationDetail;
  onChange: (patch: Partial<InvitationDetail>) => void;
}) {
  return (
    <div className="space-y-5">
      <HintBox>مثال: استقبال الضيوف 6:00 م ← العشاء 7:30 م ← حفل الزفاف 9:00 م</HintBox>

      <ToggleField
        label="عرض برنامج الحفل"
        description="عرض البرنامج في الدعوة"
        checked={value.showEventProgram}
        onChange={(showEventProgram) => onChange({ showEventProgram })}
      />

      {value.showEventProgram && (
        <ListEditor<ProgramItem>
          items={value.programItems}
          onChange={(programItems) => onChange({ programItems })}
          createItem={() => ({ time: "", title: "" })}
          addLabel="إضافة بند"
          emptyLabel="لم تتم إضافة بنود بعد"
          renderItem={(item, update) => (
            <div className="flex gap-2">
              <input
                type="time"
                value={item.time ?? ""}
                onChange={(event) => update({ time: event.target.value })}
                className="w-32 rounded-lg border border-gray-200 px-2 py-2 text-sm outline-none focus:border-gold"
              />
              <input
                type="text"
                value={item.title}
                placeholder="عنوان البند"
                onChange={(event) => update({ title: event.target.value })}
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gold"
              />
            </div>
          )}
        />
      )}
    </div>
  );
}
