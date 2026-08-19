import { apiClient } from "@/lib/api/client";
import type { SupportMessageDto, SupportMessageSubmissionRequest } from "@/types/api";

// Anonymous — ContactUsView's public "Contact Us" form.
export function submitSupportMessage(payload: SupportMessageSubmissionRequest) {
  return apiClient.post<SupportMessageDto>("/support-messages", payload);
}

// Admin — /admin/settings inbox.
export function listSupportMessages() {
  return apiClient.get<SupportMessageDto[]>("/support-messages");
}

export function markSupportMessageRead(id: string) {
  return apiClient.patch<SupportMessageDto>(`/support-messages/${id}/read`);
}

export function deleteSupportMessage(id: string) {
  return apiClient.delete<void>(`/support-messages/${id}`);
}

export function deleteAllSupportMessages() {
  return apiClient.delete<void>("/support-messages");
}
