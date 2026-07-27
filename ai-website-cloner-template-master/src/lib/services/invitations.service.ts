import { apiClient } from "@/lib/api/client";
import type { CreateInvitationRequest, InvitationDto } from "@/types/api";
import type { InvitationDetail, UpdateInvitationPatch } from "@/types/studio";

export function createInvitation(payload: CreateInvitationRequest = {}) {
  return apiClient.post<InvitationDto>("/invitations", payload);
}

export function getInvitation(id: string) {
  return apiClient.get<InvitationDetail>(`/invitations/${id}`);
}

export function updateInvitation(id: string, patch: UpdateInvitationPatch) {
  return apiClient.put<InvitationDetail>(`/invitations/${id}`, patch);
}
