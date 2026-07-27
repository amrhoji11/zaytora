import { ToggleField } from "@/components/studio/fields/ToggleField";
import { TextField } from "@/components/studio/fields/TextField";
import { TextareaField } from "@/components/studio/fields/TextareaField";
import type { InvitationDetail } from "@/types/studio";

export function Step11PersonalMessage({
  value,
  onChange,
}: {
  value: InvitationDetail;
  onChange: (patch: Partial<InvitationDetail>) => void;
}) {
  return (
    <div className="space-y-5">
      <ToggleField
        label="إضافة رسالة شخصية"
        checked={value.showPersonalMessage}
        onChange={(showPersonalMessage) => onChange({ showPersonalMessage })}
      />

      {value.showPersonalMessage && (
        <>
          <TextField
            label="العنوان"
            value={value.personalMessageTitle ?? ""}
            placeholder="رسالة العروسين"
            onChange={(personalMessageTitle) => onChange({ personalMessageTitle })}
          />
          <TextareaField
            label="نص الرسالة"
            value={value.personalMessageText ?? ""}
            placeholder="أعزاءنا الأصدقاء والعائلة..."
            onChange={(personalMessageText) => onChange({ personalMessageText })}
          />
          <TextField
            label="التوقيع"
            value={value.personalMessageSignature ?? ""}
            placeholder="بمحبة، أحمد وسارة"
            onChange={(personalMessageSignature) => onChange({ personalMessageSignature })}
          />
        </>
      )}
    </div>
  );
}
