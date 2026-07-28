import { ToggleField } from "@/components/studio/fields/ToggleField";
import { TextField } from "@/components/studio/fields/TextField";
import { TextareaField } from "@/components/studio/fields/TextareaField";
import { FontSelect } from "@/components/studio/fields/FontSelect";
import { HintBox } from "@/components/studio/fields/HintBox";
import { cn } from "@/lib/utils";
import type { InvitationDetail } from "@/types/studio";

export function Step05InvitationText({
  value,
  onChange,
}: {
  value: InvitationDetail;
  onChange: (patch: Partial<InvitationDetail>) => void;
}) {
  return (
    <div className="space-y-5">
      <HintBox>مثال: اسم العائلة: آل الراشد · نص الدعوة: &quot;يتشرفون بدعوتكم لحضور حفل زفافهم...&quot;</HintBox>

      <ToggleField
        label="إخفاء أسماء العائلات"
        description="لن تظهر أسماء العائلات في الدعوة والمشاركة"
        checked={value.hideFamilyNames}
        onChange={(hideFamilyNames) => onChange({ hideFamilyNames })}
      />

      {!value.hideFamilyNames && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <TextField
              label="اسم العائلة (الأول)"
              value={value.familyName1 ?? ""}
              placeholder="آل الراشد"
              onChange={(familyName1) => onChange({ familyName1 })}
            />
            <TextField
              label="اسم العائلة (الثاني)"
              value={value.familyName2 ?? ""}
              placeholder="آل المهنا"
              onChange={(familyName2) => onChange({ familyName2 })}
            />
          </div>
          <FontSelect
            label="خط أسماء العائلات"
            value={value.familyNamesFont ?? ""}
            onChange={(familyNamesFont) => onChange({ familyNamesFont })}
          />
          {(value.familyName1 || value.familyName2) && (
            <p className={cn("text-center text-base text-gold", value.familyNamesFont || "font-cinzel")}>
              {[value.familyName1, value.familyName2].filter(Boolean).join(" & ")}
            </p>
          )}
        </>
      )}

      <TextareaField
        label="نص الدعوة"
        value={value.invitationText ?? ""}
        placeholder="يتشرفون بدعوتكم..."
        onChange={(invitationText) => onChange({ invitationText })}
      />
    </div>
  );
}
