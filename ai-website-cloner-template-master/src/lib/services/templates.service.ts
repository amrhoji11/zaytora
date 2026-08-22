import { apiClient, ApiError } from "@/lib/api/client";
import { API_BASE_URL } from "@/lib/api/config";
import type {
  TemplateDto,
  TemplateImageUploadResponse,
  TemplateVideoUploadResponse,
  TemplateWriteRequest,
} from "@/types/api";

export function getTemplates(category?: string) {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  return apiClient.get<TemplateDto[]>(`/templates${query}`);
}

export function getTemplateById(id: string) {
  return apiClient.get<TemplateDto>(`/templates/${id}`);
}

// Homepage teaser grid (TemplatesGrid.tsx) — always resolves to exactly 4
// templates server-side (admin pins first, auto-filled by real usage), so
// the frontend just renders whatever comes back with no client-side slicing.
export function getHomepageTemplates() {
  return apiClient.get<TemplateDto[]>("/templates/homepage");
}

export function setTemplateHomepageFeatured(id: string, isHomepageFeatured: boolean) {
  return apiClient.patch<void>(`/templates/${id}/homepage-featured`, { isHomepageFeatured });
}

// Admin management (src/app/admin/video-templates) — includeInactive=true so
// a deactivated template still shows up in the admin table even though the
// public catalog/Studio picker hide it.
export function getAdminTemplates() {
  return apiClient.get<TemplateDto[]>("/templates?includeInactive=true");
}

// Uploads a cover/background photo from the admin's own device
// (TemplateEditModal) ahead of createTemplate()/updateTemplate() so the
// returned URL can ride along as imageUrl/backgroundImageUrl. Bypasses
// apiClient (always JSON-encodes) for a raw multipart fetch, same pattern as
// envelopes.service.ts's uploadEnvelopeImage.
export async function uploadTemplateImage(file: File): Promise<TemplateImageUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/templates/image`, {
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
  return payload as TemplateImageUploadResponse;
}

// Uploads the opening/ambient video (TemplateEditModal) ahead of
// createTemplate()/updateTemplate() so the returned URL can ride along as
// openingVideoUrl/ambientVideoUrl — same raw-multipart pattern as
// uploadTemplateImage above.
export async function uploadTemplateVideo(file: File): Promise<TemplateVideoUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/templates/video`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
  } catch (error) {
    throw new ApiError(error instanceof Error ? error.message : "Network error uploading video", 0);
  }

  const payload = await response.json().catch(() => undefined);
  if (!response.ok) {
    throw new ApiError(payload?.message ?? response.statusText, response.status, payload);
  }
  return payload as TemplateVideoUploadResponse;
}

export function createTemplate(payload: TemplateWriteRequest) {
  return apiClient.post<TemplateDto>("/templates", payload);
}

export function updateTemplate(id: string, payload: TemplateWriteRequest) {
  return apiClient.put<TemplateDto>(`/templates/${id}`, payload);
}

export function setTemplateActive(id: string, isActive: boolean) {
  return apiClient.patch<void>(`/templates/${id}/active`, { isActive });
}

export function deleteTemplate(id: string) {
  return apiClient.delete<void>(`/templates/${id}`);
}
