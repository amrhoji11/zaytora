import { apiClient } from "@/lib/api/client";
import type { TemplateDto } from "@/types/api";

export function getTemplates(category?: string) {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  return apiClient.get<TemplateDto[]>(`/templates${query}`);
}

export function getTemplateById(id: string) {
  return apiClient.get<TemplateDto>(`/templates/${id}`);
}
