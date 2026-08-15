"use client";

import { ListEditor } from "@/components/studio/fields/ListEditor";
import { TextField } from "@/components/studio/fields/TextField";
import { HintBox } from "@/components/studio/fields/HintBox";
import { useLanguage } from "@/context/LanguageContext";
import type { ContactItem, InvitationDetail } from "@/types/studio";

const COPY = {
  ar: {
    hint: "مثال: أحمد (العريس) +966 5X XXX XXXX · سارة (العروس) +966 5X XXX XXXX",
    addFirst: "أضف جهة الاتصال الأولى",
    addAnother: "إضافة جهة اتصال",
    empty: "لم تتم إضافة جهات اتصال",
    itemLabel: "جهة اتصال",
    name: "الاسم",
    namePlaceholder: "أحمد",
    role: "الصفة",
    rolePlaceholder: "العريس",
    phone: "رقم الهاتف",
    whatsapp: "واتسآب (اختياري)",
  },
  en: {
    hint: "Example: Ahmed (Groom) +966 5X XXX XXXX · Sarah (Bride) +966 5X XXX XXXX",
    addFirst: "Add your first contact",
    addAnother: "Add contact",
    empty: "No contacts added",
    itemLabel: "Contact",
    name: "Name",
    namePlaceholder: "Ahmed",
    role: "Role",
    rolePlaceholder: "Groom",
    phone: "Phone number",
    whatsapp: "WhatsApp (Optional)",
  },
};

export function Step12Contacts({
  value,
  onChange,
}: {
  value: InvitationDetail;
  onChange: (patch: Partial<InvitationDetail>) => void;
}) {
  const { language } = useLanguage();
  const t = COPY[language];

  return (
    <div className="space-y-4">
      <HintBox>{t.hint}</HintBox>
      <ListEditor<ContactItem>
        items={value.contacts}
        onChange={(contacts) => onChange({ contacts })}
        createItem={() => ({ name: "", role: "", phone: "", whatsapp: "" })}
        addLabel={value.contacts.length === 0 ? t.addFirst : t.addAnother}
        emptyLabel={t.empty}
        itemLabel={t.itemLabel}
        max={5}
        renderItem={(contact, update) => (
          <div className="grid grid-cols-2 gap-2">
            <TextField label={t.name} value={contact.name} placeholder={t.namePlaceholder} onChange={(name) => update({ name })} />
            <TextField
              label={t.role}
              value={contact.role ?? ""}
              placeholder={t.rolePlaceholder}
              onChange={(role) => update({ role })}
            />
            <div className="col-span-2">
              <TextField
                label={t.phone}
                value={contact.phone}
                placeholder="+966 XXX XXXX X5"
                onChange={(phone) => update({ phone })}
              />
            </div>
            <div className="col-span-2">
              <TextField
                label={t.whatsapp}
                value={contact.whatsapp ?? ""}
                placeholder="+966 XXX XXXX X5"
                onChange={(whatsapp) => update({ whatsapp })}
              />
            </div>
          </div>
        )}
      />
    </div>
  );
}
