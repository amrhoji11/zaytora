import { ListEditor } from "@/components/studio/fields/ListEditor";
import { TextField } from "@/components/studio/fields/TextField";
import { TextareaField } from "@/components/studio/fields/TextareaField";
import { HintBox } from "@/components/studio/fields/HintBox";
import { MapPinIcon } from "@/components/icons";
import type { InvitationDetail, VenueItem } from "@/types/studio";

function resolveMapsHref(venue: VenueItem) {
  if (venue.mapUrl) return venue.mapUrl;
  const query = [venue.name, venue.address].filter(Boolean).join(", ");
  return query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` : null;
}

export function Step06Location({
  value,
  onChange,
}: {
  value: InvitationDetail;
  onChange: (patch: Partial<InvitationDetail>) => void;
}) {
  return (
    <div className="space-y-4">
      <HintBox>مثال: اسم القاعة: &quot;قاعة النخيل&quot; · العنوان: &quot;طريق الملك فهد، الرياض&quot;</HintBox>
      <ListEditor<VenueItem>
        items={value.venues}
        onChange={(venues) => onChange({ venues })}
        createItem={() => ({ name: "", address: "", mapUrl: "" })}
        addLabel="إضافة قاعة أخرى"
        emptyLabel="لم تتم إضافة قاعة بعد"
        itemLabel="قاعة"
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
            {(() => {
              const href = resolveMapsHref(venue);
              return (
                <a
                  href={href ?? undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-disabled={!href}
                  onClick={(event) => {
                    if (!href) event.preventDefault();
                  }}
                  className={
                    href
                      ? "flex w-full items-center justify-center gap-1.5 rounded-xl border border-gold/40 py-2.5 text-sm font-medium text-gold transition-colors hover:bg-gold/5"
                      : "flex w-full cursor-not-allowed items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-300"
                  }
                >
                  <MapPinIcon className="size-4" />
                  افتح خرائط جوجل
                </a>
              );
            })()}
          </>
        )}
      />
    </div>
  );
}
