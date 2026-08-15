import { apiClient } from "@/lib/api/client";
import type {
  CreateInvitationRequest,
  InvitationDto,
  InvitationSummaryDto,
  RsvpResponseDto,
  RsvpSubmissionRequest,
} from "@/types/api";
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

// Lists only the caller's own invitations, for the dashboard's bookings
// table — by session if signed in, or by the anonymous GuestId tracking
// cookie otherwise, so guests see their own real invitations too.
export function listInvitations() {
  return apiClient.get<InvitationSummaryDto[]>("/invitations");
}

export function deleteInvitation(id: string) {
  return apiClient.delete<void>(`/invitations/${id}`);
}

// Submitted by a guest viewing the published invitation, not its owner —
// anonymous is fine here the same way it's fine on createInvitation.
export function submitRsvp(id: string, payload: RsvpSubmissionRequest) {
  return apiClient.post<void>(`/invitations/${id}/rsvp`, payload);
}

// The caller's own invitation only (session or GuestId cookie, same as
// listInvitations). Powers the dashboard's "Responses" modal.
export function listRsvpResponses(id: string) {
  return apiClient.get<RsvpResponseDto[]>(`/invitations/${id}/rsvp`);
}

export function deleteRsvpResponse(id: string, responseId: string) {
  return apiClient.delete<void>(`/invitations/${id}/rsvp/${responseId}`);
}
