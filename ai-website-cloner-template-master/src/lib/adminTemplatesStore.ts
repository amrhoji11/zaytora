"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";
import {
  createTemplate,
  deleteTemplate,
  getAdminTemplates,
  setTemplateActive,
  setTemplateHomepageFeatured,
  updateTemplate,
} from "@/lib/services/templates.service";
import type { TemplateDto, TemplateWriteRequest } from "@/types/api";

// Real backend-backed template management for the admin "AI template
// generator" page (src/app/admin/video-templates). This used to be a
// localStorage-only mock fully decoupled from the actual site — every
// create/edit/deactivate/delete here now hits the same ASP.NET Core
// Templates API the public catalog, homepage grid, and Studio occasion
// picker read from, so a template added here is immediately real.
export function useAdminTemplates() {
  const [templates, setTemplates] = useState<TemplateDto[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const list = await getAdminTemplates();
      setTemplates(list);
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't load templates.");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    getAdminTemplates()
      .then((list) => {
        if (cancelled) return;
        setTemplates(list);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "Couldn't load templates.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function create(payload: TemplateWriteRequest) {
    const created = await createTemplate(payload);
    await refresh();
    return created;
  }

  async function update(id: string, payload: TemplateWriteRequest) {
    const updated = await updateTemplate(id, payload);
    await refresh();
    return updated;
  }

  async function setActive(id: string, isActive: boolean) {
    await setTemplateActive(id, isActive);
    await refresh();
  }

  // Left un-caught (unlike the others above) so the admin table can show the
  // backend's "max 4" conflict message inline instead of a generic failure.
  async function setHomepageFeatured(id: string, isHomepageFeatured: boolean) {
    await setTemplateHomepageFeatured(id, isHomepageFeatured);
    await refresh();
  }

  async function remove(id: string) {
    await deleteTemplate(id);
    await refresh();
  }

  return { templates, error, refresh, create, update, setActive, setHomepageFeatured, remove };
}
