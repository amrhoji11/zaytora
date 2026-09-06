import { apiClient, ApiError } from "@/lib/api/client";
import { API_BASE_URL } from "@/lib/api/config";
import type {
  MusicSuggestionAudioUploadResponse,
  MusicSuggestionDto,
  MusicSuggestionWriteRequest,
} from "@/types/api";

// Public — Step13Music's library only ever needs the active list.
export function listActiveMusicSuggestions() {
  return apiClient.get<MusicSuggestionDto[]>("/music-suggestions");
}

// Admin — full list including inactive rows.
export function listMusicSuggestions() {
  return apiClient.get<MusicSuggestionDto[]>("/music-suggestions?includeInactive=true");
}

// Admin — uploads a track file ahead of createMusicSuggestion()/
// updateMusicSuggestion(), or a Template's own DefaultMusicUrl in
// TemplateEditModal (which shares this same endpoint rather than
// duplicating an upload path). Bypasses apiClient (always JSON-encodes) for
// a raw multipart fetch, same pattern as uploadThankYouSuggestionImage.
export async function uploadMusicSuggestionAudio(file: File): Promise<MusicSuggestionAudioUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/music-suggestions/audio`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
  } catch (error) {
    throw new ApiError(error instanceof Error ? error.message : "Network error uploading audio", 0);
  }

  const payload = await response.json().catch(() => undefined);
  if (!response.ok) {
    throw new ApiError(payload?.message ?? response.statusText, response.status, payload);
  }
  return payload as MusicSuggestionAudioUploadResponse;
}

export function createMusicSuggestion(payload: MusicSuggestionWriteRequest) {
  return apiClient.post<MusicSuggestionDto>("/music-suggestions", payload);
}

export function updateMusicSuggestion(id: string, payload: MusicSuggestionWriteRequest) {
  return apiClient.put<MusicSuggestionDto>(`/music-suggestions/${id}`, payload);
}

export function setMusicSuggestionActive(id: string, isActive: boolean) {
  return apiClient.patch<void>(`/music-suggestions/${id}/active`, { isActive });
}

export function deleteMusicSuggestion(id: string) {
  return apiClient.delete<void>(`/music-suggestions/${id}`);
}
