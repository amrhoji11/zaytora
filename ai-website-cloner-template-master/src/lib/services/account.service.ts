import { apiClient } from "@/lib/api/client";
import { API_BASE_URL } from "@/lib/api/config";
import type { LoginRequest, RegisterRequest, UpdateProfileRequest, UserDto } from "@/types/api";

export function getCurrentUser() {
  return apiClient.get<UserDto>("/account/me");
}

export function updateProfile(payload: UpdateProfileRequest) {
  return apiClient.patch<UserDto>("/account/me", payload);
}

export function login(payload: LoginRequest) {
  return apiClient.post<UserDto>("/account/login", payload);
}

export function register(payload: RegisterRequest) {
  return apiClient.post<UserDto>("/account/register", payload);
}

export function logout() {
  return apiClient.post<void>("/account/logout");
}

export function deleteAccount() {
  return apiClient.delete<void>("/account");
}

export function forgotPassword(email: string) {
  return apiClient.post<void>("/account/forgot-password", { email });
}

export function resetPassword(payload: { email: string; token: string; newPassword: string }) {
  return apiClient.post<void>("/account/reset-password", payload);
}

// Full browser navigation (not fetch) — the backend challenges Google, then
// redirects back to `returnUrl` on this same frontend once signed in.
export function getGoogleLoginUrl(returnUrl: string) {
  return `${API_BASE_URL}/account/external-login/google?returnUrl=${encodeURIComponent(returnUrl)}`;
}
