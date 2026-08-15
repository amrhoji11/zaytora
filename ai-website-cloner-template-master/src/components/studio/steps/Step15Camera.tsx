"use client";

import { ToggleField } from "@/components/studio/fields/ToggleField";
import { useLanguage } from "@/context/LanguageContext";
import type { InvitationDetail } from "@/types/studio";

const COPY = {
  ar: {
    hideCameraButton: "إخفاء زر الكاميرا",
    hideCameraButtonDescription: "لا يمكن للضيف استخدام الكاميرا أثناء الحدث",
    hideSaveButton: "إخفاء زر الحفظ",
    hideSaveButtonDescription: "لا يمكن للضيف حفظ الصور أو مشاركتها أو تنزيلها",
    hideCapturedGallery: "إخفاء معرض الصور الملتقطة في الدعوة",
    hideCapturedGalleryDescription: "الصور الملتقطة تظهر في لوحة التحكم فقط وليس في الدعوة",
  },
  en: {
    hideCameraButton: "Hide camera button",
    hideCameraButtonDescription: "Guests can't use the camera during the event",
    hideSaveButton: "Hide save button",
    hideSaveButtonDescription: "Guests can't save, share, or download photos",
    hideCapturedGallery: "Hide captured photo gallery in invitation",
    hideCapturedGalleryDescription: "Captured photos only show up in the dashboard, not in the invitation",
  },
};

export function Step15Camera({
  value,
  onChange,
}: {
  value: InvitationDetail;
  onChange: (patch: Partial<InvitationDetail>) => void;
}) {
  const { language } = useLanguage();
  const t = COPY[language];

  return (
    <div className="space-y-3">
      <ToggleField
        label={t.hideCameraButton}
        description={t.hideCameraButtonDescription}
        checked={value.hideCameraButton}
        onChange={(hideCameraButton) => onChange({ hideCameraButton })}
      />
      <ToggleField
        label={t.hideSaveButton}
        description={t.hideSaveButtonDescription}
        checked={value.hideSaveButton}
        onChange={(hideSaveButton) => onChange({ hideSaveButton })}
      />
      <ToggleField
        label={t.hideCapturedGallery}
        description={t.hideCapturedGalleryDescription}
        checked={value.hideCapturedGallery}
        onChange={(hideCapturedGallery) => onChange({ hideCapturedGallery })}
      />
    </div>
  );
}
