"use client";

import { SelectGrid } from "@/components/studio/fields/SelectGrid";
import { GlobeIcon } from "@/components/icons";
import { useLanguage, type Language } from "@/context/LanguageContext";
import type { InvitationDetail } from "@/types/studio";

// Country flag emoji render as literal fallback text (e.g. "GB") on Windows,
// which visually duplicates the `label` code next to it — a globe icon
// sidesteps that font gap and renders identically everywhere.
const LANGUAGES: { value: Language; label: string; sublabel: string; icon: typeof GlobeIcon }[] = [
  { value: "en", label: "GB", sublabel: "English", icon: GlobeIcon },
  { value: "ar", label: "SA", sublabel: "العربية", icon: GlobeIcon },
];

// This card selection IS the site's global language switcher (same state the
// Header's toggle reads/writes) — not a separate per-invitation setting. This
// is why it only offers the two languages the rest of the site is actually
// translated into, and why picking one flips the whole app's dir/copy
// immediately, not just this invitation's own saved `language` field.
export function Step01Language({
  // Unused: the active card now reflects the site's global language, not the
  // invitation's own previously-saved `language` field (kept in the shared
  // step prop signature only for consistency with the other 17 steps).
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  value,
  onChange,
}: {
  value: InvitationDetail;
  onChange: (patch: Partial<InvitationDetail>) => void;
}) {
  const { language, setLanguage } = useLanguage();

  function selectLanguage(next: string) {
    setLanguage(next as Language);
    onChange({ language: next });
  }

  return <SelectGrid columns={4} options={LANGUAGES} value={language} onChange={selectLanguage} />;
}
