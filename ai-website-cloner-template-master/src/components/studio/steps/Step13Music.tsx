import { TextField } from "@/components/studio/fields/TextField";
import { HintBox } from "@/components/studio/fields/HintBox";
import type { InvitationDetail } from "@/types/studio";

export function Step13Music({
  value,
  onChange,
}: {
  value: InvitationDetail;
  onChange: (patch: Partial<InvitationDetail>) => void;
}) {
  return (
    <div className="space-y-5">
      <HintBox>الصق رابط يوتيوب أو ملف MP3 مباشر — تعزف الموسيقى عند فتح الدعوة.</HintBox>
      <TextField
        label="رابط الموسيقى"
        value={value.musicUrl ?? ""}
        placeholder="https://youtube.com/watch?v=..."
        onChange={(musicUrl) => onChange({ musicUrl })}
      />
      <TextField
        label="عنوان المقطع"
        value={value.musicTitle ?? ""}
        placeholder="Can't Help Falling in Love"
        onChange={(musicTitle) => onChange({ musicTitle })}
      />
    </div>
  );
}
