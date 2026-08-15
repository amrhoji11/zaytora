"use client";

import { ToggleField } from "@/components/studio/fields/ToggleField";
import { useLanguage } from "@/context/LanguageContext";
import type { InvitationDetail } from "@/types/studio";

const COPY = {
  ar: {
    enableRsvp: "تفعيل تأكيد الحضور",
    enableRsvpDescription: "إظهار زر تأكيد الحضور في شريط المهام وقسم الحضور",
    formFields: "حقول النموذج",
    attendance: "الحضور (سأحضر / لن أتمكن)",
    guestCount: "عدد الضيوف",
    messageField: "التهاني / الرسالة",
    liveCount: "عرض عدد الحضور المباشر",
    liveCountDescription: "يعرض إجمالي الضيوف المؤكدين للضيوف على الدعوة",
  },
  en: {
    enableRsvp: "Enable RSVP",
    enableRsvpDescription: "Show the RSVP button in the nav bar and attendance section",
    formFields: "Form Fields",
    attendance: "Attendance (Going / Not going)",
    guestCount: "Guest count",
    messageField: "Well-wishes / message",
    liveCount: "Show live attendance count",
    liveCountDescription: "Shows the total confirmed guests to guests on the invitation",
  },
};

export function Step17Rsvp({
  value,
  onChange,
}: {
  value: InvitationDetail;
  onChange: (patch: Partial<InvitationDetail>) => void;
}) {
  const { language } = useLanguage();
  const t = COPY[language];

  return (
    <div className="space-y-5">
      <ToggleField
        label={t.enableRsvp}
        description={t.enableRsvpDescription}
        tone="highlight"
        checked={value.enableRsvp}
        onChange={(enableRsvp) => onChange({ enableRsvp })}
      />

      {value.enableRsvp && (
        <>
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">{t.formFields}</p>
            <div className="space-y-2">
              <ToggleField
                label={t.attendance}
                checked={value.rsvpShowAttendance}
                onChange={(rsvpShowAttendance) => onChange({ rsvpShowAttendance })}
              />
              <ToggleField
                label={t.guestCount}
                checked={value.rsvpShowGuestCount}
                onChange={(rsvpShowGuestCount) => onChange({ rsvpShowGuestCount })}
              />
              <ToggleField
                label={t.messageField}
                checked={value.rsvpShowMessage}
                onChange={(rsvpShowMessage) => onChange({ rsvpShowMessage })}
              />
              <ToggleField
                label={t.liveCount}
                description={t.liveCountDescription}
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
