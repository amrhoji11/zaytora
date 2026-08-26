"use client";

import { FontSelect } from "@/components/studio/fields/FontSelect";
import { ColorField } from "@/components/studio/fields/ColorField";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import type { InvitationDetail } from "@/types/studio";

const COPY = {
  ar: {
    generalTextFont: "خط بطاقة الدعوة",
    generalTextFontDescription:
      "بيغيّر خط كل كلمات بطاقة الدعوة الرئيسية دفعة وحدة (العنوان، نص الدعوة، التاريخ، وجملة \"بانتظار تشريفكم\") — اختر خطاً كلاسيكياً مثلاً فتتحول كل هذه الكلمات لنفس الطابع الكلاسيكي.",
    generalTextPreview: "أنتم مدعوون",
    envelopeNameFont: "خط اسم الظرف",
    namesFallback: "أحمد وسارة",
    namesJoiner: " و ",
    textColor: "لون نص الدعوة",
    textColorDescription:
      "بيغيّر لون كل عناوين ونصوص الدعوة دفعة وحدة — استخدمه إذا كان لون النص التلقائي للقالب صعب القراءة فوق الصورة اللي اخترتها.",
    textColorPreview: "دعوة زفاف",
  },
  en: {
    generalTextFont: "Invitation card font",
    generalTextFontDescription:
      "Changes the font of every word on the main invitation card at once (title, invitation text, date, and the \"we look forward to hosting you\" note) — pick Classic, for example, and all of it switches to that same classic style.",
    generalTextPreview: "You are invited",
    envelopeNameFont: "Envelope name font",
    namesFallback: "Ahmed and Sarah",
    namesJoiner: " & ",
    textColor: "Invitation text color",
    textColorDescription:
      "Changes every heading and body text color at once — use this if the template's automatic text color is hard to read over the photo you picked.",
    textColorPreview: "Wedding Invitation",
  },
};

export function Step18Additional({
  value,
  onChange,
}: {
  value: InvitationDetail;
  onChange: (patch: Partial<InvitationDetail>) => void;
}) {
  const { language } = useLanguage();
  const t = COPY[language];
  const namesPreview =
    [value.firstName, value.invitationType === "couple" ? value.secondName : null].filter(Boolean).join(t.namesJoiner) ||
    t.namesFallback;

  return (
    <div className="space-y-5">
      <div>
        <FontSelect
          label={t.generalTextFont}
          value={value.generalTextFont ?? ""}
          onChange={(generalTextFont) => onChange({ generalTextFont })}
        />
        <p className="mt-1.5 text-xs text-muted-foreground">{t.generalTextFontDescription}</p>
        <div className="mt-2 rounded-xl border border-border bg-gold/5 px-4 py-5 text-center">
          <p className={cn("text-sm text-body-foreground", value.generalTextFont || "font-sans")}>{t.generalTextPreview}</p>
        </div>
      </div>

      <div>
        <FontSelect
          label={t.envelopeNameFont}
          value={value.envelopeNameFont ?? ""}
          onChange={(envelopeNameFont) => onChange({ envelopeNameFont })}
        />
        <div className="mt-2 rounded-xl border border-border bg-gold/5 px-4 py-5 text-center">
          <p className={cn("text-lg text-gold", value.envelopeNameFont || "font-cinzel")}>{namesPreview}</p>
        </div>
      </div>

      <div>
        <ColorField
          label={t.textColor}
          value={value.textColor ?? "#292524"}
          onChange={(textColor) => onChange({ textColor })}
        />
        <p className="mt-1.5 text-xs text-muted-foreground">{t.textColorDescription}</p>
        {value.textColor && (
          <div className="mt-2 rounded-xl border border-border bg-gray-800 px-4 py-5 text-center">
            <p className="text-lg font-cinzel" style={{ color: value.textColor }}>
              {t.textColorPreview}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
