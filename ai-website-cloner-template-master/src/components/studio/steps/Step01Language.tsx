import { SelectGrid } from "@/components/studio/fields/SelectGrid";
import type { InvitationDetail } from "@/types/studio";

const LANGUAGES = [
  { value: "en", label: "GB", sublabel: "English", emoji: "🇬🇧" },
  { value: "ar", label: "SA", sublabel: "عربي", emoji: "🇸🇦" },
  { value: "ro", label: "RO", sublabel: "Română", emoji: "🇷🇴" },
  { value: "fr", label: "FR", sublabel: "Français", emoji: "🇫🇷" },
  { value: "es", label: "ES", sublabel: "Español", emoji: "🇪🇸" },
  { value: "hi", label: "IN", sublabel: "हिन्दी", emoji: "🇮🇳" },
  { value: "id", label: "ID", sublabel: "Indonesia", emoji: "🇮🇩" },
  { value: "bilingual", label: "عربي & English", emoji: "🌐" },
];

export function Step01Language({
  value,
  onChange,
}: {
  value: InvitationDetail;
  onChange: (patch: Partial<InvitationDetail>) => void;
}) {
  return (
    <SelectGrid
      columns={4}
      options={LANGUAGES}
      value={value.language}
      onChange={(language) => onChange({ language })}
    />
  );
}
