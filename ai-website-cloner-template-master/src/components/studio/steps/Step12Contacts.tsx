import { ListEditor } from "@/components/studio/fields/ListEditor";
import { TextField } from "@/components/studio/fields/TextField";
import type { ContactItem, InvitationDetail } from "@/types/studio";

export function Step12Contacts({
  value,
  onChange,
}: {
  value: InvitationDetail;
  onChange: (patch: Partial<InvitationDetail>) => void;
}) {
  return (
    <ListEditor<ContactItem>
      items={value.contacts}
      onChange={(contacts) => onChange({ contacts })}
      createItem={() => ({ name: "", role: "", phone: "" })}
      addLabel={value.contacts.length === 0 ? "أضف جهة الاتصال الأولى" : "إضافة جهة اتصال"}
      emptyLabel="لم تتم إضافة جهات اتصال"
      max={5}
      renderItem={(contact, update) => (
        <div className="grid grid-cols-2 gap-2">
          <TextField label="الاسم" value={contact.name} placeholder="أحمد" onChange={(name) => update({ name })} />
          <TextField
            label="الصفة"
            value={contact.role ?? ""}
            placeholder="العريس"
            onChange={(role) => update({ role })}
          />
          <div className="col-span-2">
            <TextField
              label="رقم الهاتف"
              value={contact.phone}
              placeholder="+966 XXX XXXX X5"
              onChange={(phone) => update({ phone })}
            />
          </div>
        </div>
      )}
    />
  );
}
