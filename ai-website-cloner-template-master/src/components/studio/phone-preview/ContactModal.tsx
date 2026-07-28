"use client";

import type { ContactItem } from "@/types/studio";

export function ContactModal({ contacts }: { contacts: ContactItem[] }) {
  return (
    <div className="space-y-2.5">
      {contacts.map((contact, index) => (
        <a
          key={index}
          href={`tel:${contact.phone}`}
          className="flex items-center justify-between gap-2 rounded-xl bg-gray-50 px-3 py-2.5 transition-colors hover:bg-gold/5"
        >
          <span className="text-xs font-medium text-gray-800">
            {contact.name}
            {contact.role ? ` (${contact.role})` : ""}
          </span>
          <span dir="ltr" className="text-xs text-gold">
            {contact.phone}
          </span>
        </a>
      ))}
    </div>
  );
}
