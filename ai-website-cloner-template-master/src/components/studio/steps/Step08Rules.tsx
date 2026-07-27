import { ToggleField } from "@/components/studio/fields/ToggleField";
import { TextareaField } from "@/components/studio/fields/TextareaField";
import type { InvitationDetail } from "@/types/studio";

export function Step08Rules({
  value,
  onChange,
}: {
  value: InvitationDetail;
  onChange: (patch: Partial<InvitationDetail>) => void;
}) {
  return (
    <div className="space-y-5">
      <ToggleField
        label="تفعيل قواعد الحدث"
        description="عرض القواعد في الدعوة"
        checked={value.showEventRules}
        onChange={(showEventRules) => onChange({ showEventRules })}
      />
      {value.showEventRules && (
        <TextareaField
          value={value.eventRulesText ?? ""}
          placeholder="ممنوع الأطفال · ممنوع التصوير · يرجى الحضور في الوقت المحدد"
          onChange={(eventRulesText) => onChange({ eventRulesText })}
        />
      )}
    </div>
  );
}
