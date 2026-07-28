import { SelectGrid } from "@/components/studio/fields/SelectGrid";
import { GlobeIcon } from "@/components/icons";
import type { InvitationDetail } from "@/types/studio";

// Country flag emoji render as literal fallback text (e.g. "GB") on Windows,
// which visually duplicates the `label` code next to it — a globe icon
// sidesteps that font gap and renders identically everywhere.
const LANGUAGES = [
  { value: "en", label: "GB", sublabel: "English", icon: GlobeIcon },
  { value: "ar", label: "SA", sublabel: "عربي", icon: GlobeIcon },
  { value: "ro", label: "RO", sublabel: "Română", icon: GlobeIcon },
  { value: "fr", label: "FR", sublabel: "Français", icon: GlobeIcon },
  { value: "es", label: "ES", sublabel: "Español", icon: GlobeIcon },
  { value: "hi", label: "IN", sublabel: "हिन्दी", icon: GlobeIcon },
  { value: "id", label: "ID", sublabel: "Indonesia", icon: GlobeIcon },
  { value: "bilingual", label: "عربي & English", icon: GlobeIcon },
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
