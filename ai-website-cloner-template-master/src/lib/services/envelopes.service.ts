import { apiClient, ApiError } from "@/lib/api/client";
import { API_BASE_URL } from "@/lib/api/config";
import type { EnvelopeDto, EnvelopeImageUploadResponse, EnvelopeWriteRequest } from "@/types/api";

// Admin-only (see EnvelopesController) — the full library, including
// inactive rows, for both /admin/envelopes' own list and TemplateEditModal's
// picker (so a template already pointing at a since-deactivated envelope
// can still show it selected).
export function listEnvelopes() {
  return apiClient.get<EnvelopeDto[]>("/envelopes?includeInactive=true");
}

// Uploads the envelope photo ahead of createEnvelope()/updateEnvelope() so
// the returned URL can ride along as photoUrl. Bypasses apiClient (always
// JSON-encodes) for a raw multipart fetch, same pattern as
// uploadThankYouSuggestionImage.
export async function uploadEnvelopeImage(file: File): Promise<EnvelopeImageUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/envelopes/image`, {
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
  return payload as EnvelopeImageUploadResponse;
}

export function createEnvelope(payload: EnvelopeWriteRequest) {
  return apiClient.post<EnvelopeDto>("/envelopes", payload);
}

export function updateEnvelope(id: string, payload: EnvelopeWriteRequest) {
  return apiClient.put<EnvelopeDto>(`/envelopes/${id}`, payload);
}

export function deleteEnvelope(id: string) {
  return apiClient.delete<void>(`/envelopes/${id}`);
}
