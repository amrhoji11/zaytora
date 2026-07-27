import { TextField } from "@/components/studio/fields/TextField";
import { DateTimeField } from "@/components/studio/fields/DateTimeField";
import { ColorField } from "@/components/studio/fields/ColorField";
import { FontSelect } from "@/components/studio/fields/FontSelect";
import { cn } from "@/lib/utils";
import type { InvitationDetail } from "@/types/studio";

function toDateTimeLocal(value?: string | null) {
  if (!value) return "";
  return value.slice(0, 16);
}

export function Step04BasicInfo({
  value,
  onChange,
}: {
  value: InvitationDetail;
  onChange: (patch: Partial<InvitationDetail>) => void;
}) {
  return (
    <div className="space-y-5">
      <TextField
        label="عنوان الحدث"
        required
        value={value.eventTitle ?? ""}
        placeholder="حفل الزفاف"
        onChange={(eventTitle) => onChange({ eventTitle })}
      />
      <FontSelect
        label="خط عنوان الحدث"
        value={value.eventTitleFont ?? ""}
        onChange={(eventTitleFont) => onChange({ eventTitleFont })}
      />
      {value.eventTitle && (
        <p className={cn("text-center text-lg text-gray-800", value.eventTitleFont || "font-cinzel")}>
          {value.eventTitle}
        </p>
      )}

      <div>
        <p className="mb-1.5 text-sm text-gray-700">نوع الدعوة</p>
        <div className="grid grid-cols-2 gap-3">
          {(["individual", "couple"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => onChange({ invitationType: type })}
              className={cn(
                "rounded-xl border-2 py-2.5 text-sm font-medium transition-all",
                value.invitationType === type
                  ? "border-gold bg-gold/10 text-gray-900"
                  : "border-gray-200 text-gray-600 hover:border-gold/40"
              )}
            >
              {type === "individual" ? "🧍 فردي" : "💑 زوجين"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <TextField
          label="الاسم الأول"
          required
          value={value.firstName ?? ""}
          placeholder="أحمد"
          onChange={(firstName) => onChange({ firstName })}
        />
        {value.invitationType === "couple" && (
          <TextField
            label="الاسم الثاني"
            required
            value={value.secondName ?? ""}
            placeholder="سارة"
            onChange={(secondName) => onChange({ secondName })}
          />
        )}
      </div>
      <FontSelect
        label="خط الأسماء"
        value={value.namesFont ?? ""}
        onChange={(namesFont) => onChange({ namesFont })}
      />
      {value.firstName && (
        <p className={cn("text-center text-lg text-gold", value.namesFont || "font-cinzel")}>
          {value.firstName}
          {value.invitationType === "couple" && value.secondName ? ` & ${value.secondName}` : ""}
        </p>
      )}

      <DateTimeField
        label="تاريخ ووقت الحدث"
        required
        value={toDateTimeLocal(value.eventDateTime)}
        onChange={(eventDateTime) => onChange({ eventDateTime })}
      />

      <TextField
        label="نص الشكر"
        value={value.thankYouText ?? ""}
        placeholder="WITH LOVE AND GRATITUDE"
        onChange={(thankYouText) => onChange({ thankYouText })}
      />
      <ColorField
        label="لون النص"
        value={value.thankYouTextColor ?? "#111111"}
        onChange={(thankYouTextColor) => onChange({ thankYouTextColor })}
      />
    </div>
  );
}
