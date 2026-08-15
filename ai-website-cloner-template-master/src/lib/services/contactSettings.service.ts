import { apiClient } from "@/lib/api/client";
import type { ContactSettingsDto, ContactSettingsWriteRequest } from "@/types/api";

export function getContactSettings() {
  return apiClient.get<ContactSettingsDto>("/contact-settings");
}

// Admin "Contact Info" form (src/app/admin/settings) — replaces the whole
// singleton record, including the WhatsApp number list, in one submit.
export function updateContactSettings(payload: ContactSettingsWriteRequest) {
  return apiClient.put<ContactSettingsDto>("/contact-settings", payload);
}
