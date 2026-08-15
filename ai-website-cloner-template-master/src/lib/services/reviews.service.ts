import { apiClient } from "@/lib/api/client";
import type { PagedResult, ReviewDto, ReviewStatus, ReviewSubmissionRequest } from "@/types/api";

// Anonymous — WriteReviewModal's public submission.
export function submitReview(payload: ReviewSubmissionRequest) {
  return apiClient.post<ReviewDto>("/reviews", payload);
}

// Public — homepage testimonials.
export function listApprovedReviews() {
  return apiClient.get<ReviewDto[]>("/reviews/approved");
}

// Admin — /admin/reviews. Server-side status filter + search (indexed
// Name/Title/Body/Country) + pagination, since reviews accumulate indefinitely.
export function listReviews(query: { status?: "all" | ReviewStatus; search?: string; page?: number; pageSize?: number } = {}) {
  const params = new URLSearchParams();
  if (query.status && query.status !== "all") params.set("status", query.status);
  if (query.search) params.set("search", query.search);
  if (query.page) params.set("page", String(query.page));
  if (query.pageSize) params.set("pageSize", String(query.pageSize));
  const qs = params.toString();
  return apiClient.get<PagedResult<ReviewDto>>(`/reviews${qs ? `?${qs}` : ""}`);
}

export function approveReview(id: string) {
  return apiClient.patch<ReviewDto>(`/reviews/${id}/approve`);
}

export function rejectReview(id: string) {
  return apiClient.patch<ReviewDto>(`/reviews/${id}/reject`);
}

export function deleteReview(id: string) {
  return apiClient.delete<void>(`/reviews/${id}`);
}
