import { SelectGrid } from "@/components/studio/fields/SelectGrid";
import type { InvitationDetail } from "@/types/studio";

const OCCASIONS = [
  { value: "engagement", label: "خطوبة", emoji: "💍", couple: true },
  { value: "wedding", label: "زفاف", emoji: "🤵", couple: true },
  { value: "henna", label: "حنة", emoji: "💃🏼", couple: true },
  { value: "marriage_contract", label: "عقد قران", emoji: "🕌", couple: true },
  { value: "gender_reveal", label: "الكشف عن الجنس", emoji: "🎊", couple: false, sublabel: "فردي" },
  { value: "bridal_shower", label: "حفلة العروس", emoji: "🎀", couple: false, sublabel: "فردي" },
  { value: "graduation", label: "تخرج", emoji: "🎓", couple: false, sublabel: "فردي" },
  { value: "aqeeqah", label: "عقيقه", emoji: "🍼", couple: false, sublabel: "فردي" },
  { value: "birthday", label: "عيد ميلاد", emoji: "🎂", couple: false, sublabel: "فردي" },
] as const;

export function Step02Occasion({
  value,
  onChange,
}: {
  value: InvitationDetail;
  onChange: (patch: Partial<InvitationDetail>) => void;
}) {
  return (
    <SelectGrid
      columns={2}
      options={OCCASIONS}
      value={value.occasionType}
      onChange={(occasionType) => {
        const occasion = OCCASIONS.find((item) => item.value === occasionType);
        onChange({ occasionType, isCoupleEvent: occasion?.couple ?? false });
      }}
    />
  );
}
