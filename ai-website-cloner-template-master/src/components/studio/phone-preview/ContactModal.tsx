"use client";

import { PhoneIcon, WhatsAppIcon } from "@/components/icons";
import type { ContactItem } from "@/types/studio";

function whatsAppHref(phone: string) {
  // wa.me only accepts digits — strip everything else (spaces, +, dashes).
  const digits = phone.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : null;
}

export function ContactModal({ contacts, isRtl }: { contacts: ContactItem[]; isRtl: boolean }) {
  const callLabel = isRtl ? "اتصال" : "Call";
  const whatsAppLabel = "WhatsApp";

  return (
    <div className="space-y-2.5">
      {contacts.map((contact, index) => {
        const waHref = whatsAppHref(contact.whatsapp || contact.phone);
        return (
          <div key={index} className="rounded-xl bg-gray-50 px-3 py-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-gray-800">
                {contact.name}
                {contact.role ? ` (${contact.role})` : ""}
              </span>
              <span dir="ltr" className="text-xs text-gold">
                {contact.phone}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <a
                href={`tel:${contact.phone}`}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white py-1.5 text-[11px] font-medium text-gray-700 transition-colors hover:bg-gray-100"
              >
                <PhoneIcon className="size-3" />
                {callLabel}
              </a>
              {waHref && (
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pulse-glow-whatsapp flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#25D366] py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-[#20BA5A]"
                >
                  <WhatsAppIcon className="size-3" />
                  {whatsAppLabel}
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
