import { ToggleField } from "@/components/studio/fields/ToggleField";
import type { InvitationDetail } from "@/types/studio";

export function Step17Rsvp({
  value,
  onChange,
}: {
  value: InvitationDetail;
  onChange: (patch: Partial<InvitationDetail>) => void;
}) {
  return (
    <div className="space-y-5">
      <ToggleField
        label="تفعيل تأكيد الحضور"
        description="إظهار زر تأكيد الحضور في شريط المهام وقسم الحضور"
        tone="highlight"
        checked={value.enableRsvp}
        onChange={(enableRsvp) => onChange({ enableRsvp })}
      />

      {value.enableRsvp && (
        <>
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">حقول النموذج</p>
            <div className="space-y-2">
              <ToggleField
                label="الحضور (سأحضر / لن أتمكن)"
                checked={value.rsvpShowAttendance}
                onChange={(rsvpShowAttendance) => onChange({ rsvpShowAttendance })}
              />
              <ToggleField
                label="عدد الضيوف"
                checked={value.rsvpShowGuestCount}
                onChange={(rsvpShowGuestCount) => onChange({ rsvpShowGuestCount })}
              />
              <ToggleField
                label="التهاني / الرسالة"
                checked={value.rsvpShowMessage}
                onChange={(rsvpShowMessage) => onChange({ rsvpShowMessage })}
              />
              <ToggleField
                label="عرض عدد الحضور المباشر"
                description="يعرض إجمالي الضيوف المؤكدين للضيوف على الدعوة"
                checked={value.rsvpShowLiveCount}
                onChange={(rsvpShowLiveCount) => onChange({ rsvpShowLiveCount })}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
