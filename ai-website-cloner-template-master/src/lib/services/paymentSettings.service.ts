import { apiClient } from "@/lib/api/client";
import type { PaymentSettingsDto, PaymentSettingsWriteRequest } from "@/types/api";

// Admin-only in both directions — see /admin/settings' Payment Settings form.
export function getPaymentSettings() {
  return apiClient.get<PaymentSettingsDto>("/payment-settings");
}

export function updatePaymentSettings(payload: PaymentSettingsWriteRequest) {
  return apiClient.put<PaymentSettingsDto>("/payment-settings", payload);
}
