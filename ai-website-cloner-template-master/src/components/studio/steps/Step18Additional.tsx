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
        <p className={cn("mt-2 text-center text-sm text-gray-600", value.generalTextFont || "font-sans")}>
          أنتم مدعوون
        </p>
      </div>

      <div>
        <FontSelect
          label="خط اسم الظرف"
          value={value.envelopeNameFont ?? ""}
          onChange={(envelopeNameFont) => onChange({ envelopeNameFont })}
        />
        <p className={cn("mt-2 text-center text-lg text-gold", value.envelopeNameFont || "font-cinzel")}>
          {namesPreview}
        </p>
      </div>
    </div>
  );
}
