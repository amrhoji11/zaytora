import { ListEditor } from "@/components/studio/fields/ListEditor";
import { TextField } from "@/components/studio/fields/TextField";
import { TextareaField } from "@/components/studio/fields/TextareaField";
import type { InvitationDetail, VenueItem } from "@/types/studio";

export function Step06Location({
  value,
  onChange,
}: {
  value: InvitationDetail;
  onChange: (patch: Partial<InvitationDetail>) => void;
}) {
  return (
    <ListEditor<VenueItem>
      items={value.venues}
      onChange={(venues) => onChange({ venues })}
      createItem={() => ({ name: "", address: "", mapUrl: "" })}
      addLabel="إضافة قاعة أخرى"
      emptyLabel="لم تتم إضافة قاعة بعد"
      renderItem={(venue, update) => (
        <>
          <TextField
            label="اسم القاعة"
            required
            value={venue.name}
            placeholder="قاعة الأفراح الكبرى"
            onChange={(name) => update({ name })}
          />
          <TextareaField
            label="عنوان القاعة"
            value={venue.address ?? ""}
            placeholder="شارع الزفاف، المدينة"
            rows={2}
            onChange={(address) => update({ address })}
          />
          <TextField
            label="رابط الخريطة"
            value={venue.mapUrl ?? ""}
            placeholder="https://maps.google.com/..."
            onChange={(mapUrl) => update({ mapUrl })}
          />
        </>
      )}
    />
  );
}
