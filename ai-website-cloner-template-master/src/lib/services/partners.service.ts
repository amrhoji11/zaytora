import { apiClient, ApiError } from "@/lib/api/client";
import { API_BASE_URL } from "@/lib/api/config";
import type {
  ApprovedPartnerDto,
  PagedResult,
  PartnerApplicationRequest,
  PartnerDto,
  PartnerLogoUploadResponse,
  PartnerStatus,
  UpdateMyPartnerProfileRequest,
  UpdatePartnerDiscountRequest,
} from "@/types/api";

// Requires login — PartnerApplicationModal.tsx gates the form on useAuth()
// before showing it, so the applying account becomes the partner's login.
export function submitPartnerApplication(payload: PartnerApplicationRequest) {
  return apiClient.post<PartnerDto>("/partners", payload);
}

// Requires login — the logged-in partner's own profile, for
// /dashboard/partner. Throws ApiError with status 404 if this account never
// applied.
export function getMyPartnerProfile() {
  return apiClient.get<PartnerDto>("/partners/me");
}

// Requires login — self-service edit, only works once the account's
// application has been approved (backend returns 403 otherwise).
export function updateMyPartnerProfile(payload: UpdateMyPartnerProfileRequest) {
  return apiClient.put<PartnerDto>("/partners/me", payload);
}

// Requires login — uploads the logo file ahead of submitPartnerApplication()
// or updateMyPartnerProfile() so the returned URL can ride along as
// logoUrl. Bypasses apiClient because it always JSON-encodes the body;
// multipart uploads need a raw fetch with a FormData body instead.
export async function uploadPartnerLogo(file: File): Promise<PartnerLogoUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/partners/logo`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
  } catch (error) {
    throw new ApiError(error instanceof Error ? error.message : "Network error uploading logo", 0);
  }

  const payload = await response.json().catch(() => undefined);
  if (!response.ok) {
    throw new ApiError(payload?.message ?? response.statusText, response.status, payload);
  }
  return payload as PartnerLogoUploadResponse;
}

// Public — /OurPartners.
export function listApprovedPartners() {
  return apiClient.get<ApprovedPartnerDto[]>("/partners/approved");
}

// Admin — /admin/partners. `status` narrows to one lifecycle stage; the page
// fetches "pending" unpaginated (small, needs full visibility) and
// "approved" with search+pagination (the section that grows unbounded).
export function listPartners(query: { status?: PartnerStatus; search?: string; page?: number; pageSize?: number } = {}) {
  const params = new URLSearchParams();
  if (query.status) params.set("status", query.status);
  if (query.search) params.set("search", query.search);
  if (query.page) params.set("page", String(query.page));
  if (query.pageSize) params.set("pageSize", String(query.pageSize));
  const qs = params.toString();
  return apiClient.get<PagedResult<PartnerDto>>(`/partners${qs ? `?${qs}` : ""}`);
}

export function approvePartner(id: string) {
  return apiClient.patch<PartnerDto>(`/partners/${id}/approve`);
}

export function rejectPartner(id: string) {
  return apiClient.patch<PartnerDto>(`/partners/${id}/reject`);
}

export function setPartnerActive(id: string, active: boolean) {
  return apiClient.patch<PartnerDto>(`/partners/${id}/active`, { active });
}

// Used from /admin/pricing's per-partner discount override.
export function updatePartnerDiscount(id: string, payload: UpdatePartnerDiscountRequest) {
  return apiClient.put<PartnerDto>(`/partners/${id}/discount`, payload);
}

export function deletePartner(id: string) {
  return apiClient.delete<void>(`/partners/${id}`);
}
