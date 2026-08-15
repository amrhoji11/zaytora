"use client";

import { ToggleField } from "@/components/studio/fields/ToggleField";
import { ListEditor } from "@/components/studio/fields/ListEditor";
import { TextField } from "@/components/studio/fields/TextField";
import { HintBox } from "@/components/studio/fields/HintBox";
import { useLanguage } from "@/context/LanguageContext";
import type { InvitationDetail, VenueItem } from "@/types/studio";

const COPY = {
  ar: {
    hint: 'مثال: "فندق جراند" · العنوان · رابط خرائط جوجل — يمكن إضافة حتى 4 فنادق',
    showAccommodation: "أين تقيمون",
    showAccommodationDescription: "اعرض الفنادق وأماكن الإقامة في دعوتك",
    addHotel: "إضافة فندق",
    emptyHotels: "لم تتم إضافة فنادق بعد",
    hotelLabel: "فندق",
    hotelName: "اسم الفندق",
    hotelNamePlaceholder: "الفندق الكبير",
    mapUrl: "رابط خرائط جوجل",
  },
  en: {
    hint: 'Example: "Grand Hotel" · address · Google Maps link — up to 4 hotels can be added',
    showAccommodation: "Where to stay",
    showAccommodationDescription: "Show hotels and places to stay in your invitation",
    addHotel: "Add hotel",
    emptyHotels: "No hotels added yet",
    hotelLabel: "Hotel",
    hotelName: "Hotel name",
    hotelNamePlaceholder: "Grand Hotel",
    mapUrl: "Google Maps link",
  },
};

export function Step09Accommodation({
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
      <HintBox>{t.hint}</HintBox>

      <ToggleField
        label={t.showAccommodation}
        description={t.showAccommodationDescription}
        checked={value.showAccommodation}
        onChange={(showAccommodation) =>
          onChange(showAccommodation ? { showAccommodation } : { showAccommodation, accommodations: [] })
        }
      />

      {value.showAccommodation && (
        <ListEditor<VenueItem>
          items={value.accommodations}
          onChange={(accommodations) => onChange({ accommodations })}
          createItem={() => ({ name: "", address: "", mapUrl: "" })}
          addLabel={t.addHotel}
          emptyLabel={t.emptyHotels}
          itemLabel={t.hotelLabel}
          max={4}
          renderItem={(item, update) => (
            <>
              <TextField
                label={t.hotelName}
                value={item.name}
                placeholder={t.hotelNamePlaceholder}
                onChange={(name) => update({ name })}
              />
              <TextField
                label={t.mapUrl}
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
