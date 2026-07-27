import { ToggleField } from "@/components/studio/fields/ToggleField";
import type { InvitationDetail } from "@/types/studio";

export function Step15Camera({
  value,
  onChange,
}: {
  value: InvitationDetail;
  onChange: (patch: Partial<InvitationDetail>) => void;
}) {
  return (
    <div className="space-y-3">
      <ToggleField
        label="إخفاء زر الكاميرا"
        description="لا يمكن للضيف استخدام الكاميرا أثناء الحدث"
        checked={value.hideCameraButton}
        onChange={(hideCameraButton) => onChange({ hideCameraButton })}
      />
      <ToggleField
        label="إخفاء زر الحفظ"
        description="لا يمكن للضيف حفظ الصور أو مشاركتها أو تنزيلها"
        checked={value.hideSaveButton}
        onChange={(hideSaveButton) => onChange({ hideSaveButton })}
      />
      <ToggleField
        label="إخفاء معرض الصور الملتقطة في الدعوة"
        description="الصور الملتقطة تظهر في لوحة التحكم فقط وليس في الدعوة"
        checked={value.hideCapturedGallery}
        onChange={(hideCapturedGallery) => onChange({ hideCapturedGallery })}
      />
    </div>
  );
}
