import { apiClient, ApiError } from "@/lib/api/client";
import { API_BASE_URL } from "@/lib/api/config";
import type {
  ThankYouSuggestionDto,
  ThankYouSuggestionImageUploadResponse,
  ThankYouSuggestionWriteRequest,
} from "@/types/api";

// Public — Step04BasicInfo's "اقتراحات" tab only ever needs the active list.
export function listActiveThankYouSuggestions() {
  return apiClient.get<ThankYouSuggestionDto[]>("/thank-you-suggestions");
}

// Admin — /admin/thank-you-suggestions, full list including inactive rows.
export function listThankYouSuggestions() {
  return apiClient.get<ThankYouSuggestionDto[]>("/thank-you-suggestions?includeInactive=true");
}

// Admin — uploads the card image ahead of createThankYouSuggestion()/
// updateThankYouSuggestion() so the returned URL can ride along as
// imageUrl. Bypasses apiClient (always JSON-encodes) for a raw multipart
// fetch, same pattern as uploadPartnerLogo.
export async function uploadThankYouSuggestionImage(file: File): Promise<ThankYouSuggestionImageUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/thank-you-suggestions/image`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
  } catch (error) {
    throw new ApiError(error instanceof Error ? error.message : "Network error uploading image", 0);
  }

  const payload = await response.json().catch(() => undefined);
  if (!response.ok) {
    throw new ApiError(payload?.message ?? response.statusText, response.status, payload);
  }
  return payload as ThankYouSuggestionImageUploadResponse;
}

export function createThankYouSuggestion(payload: ThankYouSuggestionWriteRequest) {
  return apiClient.post<ThankYouSuggestionDto>("/thank-you-suggestions", payload);
}

export function updateThankYouSuggestion(id: string, payload: ThankYouSuggestionWriteRequest) {
  return apiClient.put<ThankYouSuggestionDto>(`/thank-you-suggestions/${id}`, payload);
}

export function setThankYouSuggestionActive(id: string, isActive: boolean) {
  return apiClient.patch<void>(`/thank-you-suggestions/${id}/active`, { isActive });
}

export function deleteThankYouSuggestion(id: string) {
  return apiClient.delete<void>(`/thank-you-suggestions/${id}`);
}
