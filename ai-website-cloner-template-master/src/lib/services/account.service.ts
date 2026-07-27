import { apiClient } from "@/lib/api/client";
import type { UserDto } from "@/types/api";

export function getCurrentUser() {
  return apiClient.get<UserDto>("/account/me");
}

export function logout() {
  return apiClient.post<void>("/account/logout");
}

export function deleteAccount() {
  return apiClient.delete<void>("/account");
}
