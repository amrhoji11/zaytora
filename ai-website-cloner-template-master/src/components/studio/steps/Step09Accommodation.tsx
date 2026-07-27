import { ToggleField } from "@/components/studio/fields/ToggleField";
import { ListEditor } from "@/components/studio/fields/ListEditor";
import { TextField } from "@/components/studio/fields/TextField";
import type { InvitationDetail, VenueItem } from "@/types/studio";

export function Step09Accommodation({
  value,
  onChange,
}: {
  value: InvitationDetail;
  onChange: (patch: Partial<InvitationDetail>) => void;
}) {
  return (
    <div className="space-y-5">
      <ToggleField
        label="أين تقيمون"
        description="اعرض الفنادق وأماكن الإقامة في دعوتك"
        checked={value.showAccommodation}
        onChange={(showAccommodation) => onChange({ showAccommodation })}
      />

      {value.showAccommodation && (
        <ListEditor<VenueItem>
          items={value.accommodations}
          onChange={(accommodations) => onChange({ accommodations })}
          createItem={() => ({ name: "", address: "", mapUrl: "" })}
          addLabel="إضافة فندق"
          emptyLabel="لم تتم إضافة فنادق بعد"
          max={4}
          renderItem={(item, update) => (
            <>
              <TextField
                label="اسم الفندق"
                value={item.name}
                placeholder="الفندق الكبير"
                onChange={(name) => update({ name })}
              />
              <TextField
                label="رابط خرائط جوجل"
                value={item.mapUrl ?? ""}
                placeholder="https://maps.google.com/..."
                onChange={(mapUrl) => update({ mapUrl })}
              />
            </>
          )}
        />
      )}
    </div>
  );
}
