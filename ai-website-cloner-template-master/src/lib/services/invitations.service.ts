import { apiClient } from "@/lib/api/client";
import type { CreateInvitationRequest, InvitationDto } from "@/types/api";

export function createInvitation(payload: CreateInvitationRequest = {}) {
  return apiClient.post<InvitationDto>("/invitations", payload);
}
