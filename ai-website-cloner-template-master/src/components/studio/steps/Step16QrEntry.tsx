import { ToggleField } from "@/components/studio/fields/ToggleField";
import type { InvitationDetail } from "@/types/studio";

export function Step16QrEntry({
  value,
  onChange,
}: {
  value: InvitationDetail;
  onChange: (patch: Partial<InvitationDetail>) => void;
}) {
  return (
    <ToggleField
      label="دخول الضيوف عبر رمز QR"
      description="نظام تسجيل دخول ذكي لحدثك"
      checked={value.enableQrEntry}
      onChange={(enableQrEntry) => onChange({ enableQrEntry })}
    />
  );
}
