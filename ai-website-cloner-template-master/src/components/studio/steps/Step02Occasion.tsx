"use client";

import { SelectGrid } from "@/components/studio/fields/SelectGrid";
import { useLanguage } from "@/context/LanguageContext";
import type { InvitationDetail } from "@/types/studio";

const OCCASION_META = [
  { value: "wedding", emoji: "🤵", couple: true },
  { value: "engagement", emoji: "💍", couple: true },
  { value: "marriage_contract", emoji: "🕌", couple: true },
  { value: "henna", emoji: "💃🏼", couple: true },
  { value: "bridal_shower", emoji: "🎀", couple: false },
  { value: "gender_reveal", emoji: "🎊", couple: false },
  { value: "aqeeqah", emoji: "🍼", couple: false },
  { value: "graduation", emoji: "🎓", couple: false },
  { value: "birthday", emoji: "🎂", couple: false },
] as const;

const COPY = {
  ar: {
    individual: "فردي",
    labels: {
      wedding: "زفاف",
      engagement: "خطوبة",
      marriage_contract: "عقد قران",
      henna: "حنة",
      bridal_shower: "حفلة العروس",
      gender_reveal: "الكشف عن الجنس",
      aqeeqah: "عقيقه",
      graduation: "تخرج",
      birthday: "عيد ميلاد",
    },
  },
  en: {
    individual: "Individual",
    labels: {
      wedding: "Wedding",
      engagement: "Engagement",
      marriage_contract: "Marriage Contract",
      henna: "Henna",
      bridal_shower: "Bridal Shower",
      gender_reveal: "Gender Reveal",
      aqeeqah: "Aqeeqah",
      graduation: "Graduation",
      birthday: "Birthday",
    },
  },
} as const;

export function Step02Occasion({
  value,
  onChange,
}: {
  value: InvitationDetail;
  onChange: (patch: Partial<InvitationDetail>) => void;
}) {
  const { language } = useLanguage();
  const t = COPY[language];
  const options = OCCASION_META.map((item) => ({
    value: item.value,
    emoji: item.emoji,
    couple: item.couple,
    label: t.labels[item.value],
    sublabel: item.couple ? undefined : t.individual,
  }));

  return (
    <SelectGrid
      columns={2}
      layout="row"
      options={options}
      value={value.occasionType}
      onChange={(occasionType) => {
        const occasion = options.find((item) => item.value === occasionType);
        onChange({ occasionType, isCoupleEvent: occasion?.couple ?? false });
      }}
    />
  );
}
