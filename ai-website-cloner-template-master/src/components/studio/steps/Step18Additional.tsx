import { FontSelect } from "@/components/studio/fields/FontSelect";
import { cn } from "@/lib/utils";
import type { InvitationDetail } from "@/types/studio";

export function Step18Additional({
  value,
  onChange,
}: {
  value: InvitationDetail;
  onChange: (patch: Partial<InvitationDetail>) => void;
}) {
  const namesPreview =
    [value.firstName, value.invitationType === "couple" ? value.secondName : null].filter(Boolean).join(" و ") ||
    "أحمد وسارة";

  return (
    <div className="space-y-5">
      <div>
        <FontSelect
          label="خط النص العام"
          value={value.generalTextFont ?? ""}
          onChange={(generalTextFont) => onChange({ generalTextFont })}
        />
        <div className="mt-2 rounded-xl border border-gray-100 bg-gold/5 px-4 py-5 text-center">
          <p className={cn("text-sm text-gray-600", value.generalTextFont || "font-sans")}>أنتم مدعوون</p>
        </div>
      </div>

      <div>
        <FontSelect
          label="خط اسم الظرف"
          value={value.envelopeNameFont ?? ""}
          onChange={(envelopeNameFont) => onChange({ envelopeNameFont })}
        />
        <div className="mt-2 rounded-xl border border-gray-100 bg-gold/5 px-4 py-5 text-center">
          <p className={cn("text-lg text-gold", value.envelopeNameFont || "font-cinzel")}>{namesPreview}</p>
        </div>
      </div>
    </div>
  );
}
