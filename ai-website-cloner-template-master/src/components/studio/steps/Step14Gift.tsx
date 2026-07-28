import { ToggleField } from "@/components/studio/fields/ToggleField";
import { TextField } from "@/components/studio/fields/TextField";
import { HintBox } from "@/components/studio/fields/HintBox";
import type { InvitationDetail } from "@/types/studio";

export function Step14Gift({
  value,
  onChange,
}: {
  value: InvitationDetail;
  onChange: (patch: Partial<InvitationDetail>) => void;
}) {
  return (
    <div className="space-y-5">
      <HintBox>
        فعّل هذا حتى يتمكن الضيوف من إرسال هدية عبر التحويل البنكي. يمكنك مشاركة رقم IBAN ورمز QR.
      </HintBox>
      <ToggleField
        label="تفعيل الهدايا"
        description="يمكن للضيوف إرسال هدية عبر التحويل البنكي"
        checked={value.enableGifts}
        onChange={(enableGifts) => onChange({ enableGifts })}
      />
      {value.enableGifts && (
        <TextField
          label="رقم الآيبان (IBAN)"
          value={value.giftIban ?? ""}
          placeholder="SA00 0000 0000 0000 0000 0000"
          onChange={(giftIban) => onChange({ giftIban })}
        />
      )}
    </div>
  );
}
