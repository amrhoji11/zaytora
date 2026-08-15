"use client";

import { useEffect, useState } from "react";
import { getHomepageTemplates } from "@/lib/services/templates.service";
import type { TemplateDto } from "@/types/api";
import { TemplatesGridView } from "./TemplatesGridView";

// Homepage teaser — GET /api/templates/homepage always resolves to exactly
// 4 templates server-side: admin-pinned ones (isHomepageFeatured, set from
// /admin/video-templates) first, auto-filled by real usage (invitations
// actually built on that template) for any remaining slots. No client-side
// slicing/sorting needed here.
export function TemplatesGrid() {
  const [templates, setTemplates] = useState<TemplateDto[]>([]);

  useEffect(() => {
    let cancelled = false;
    getHomepageTemplates()
      .then((list) => {
        if (!cancelled) setTemplates(list);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return <TemplatesGridView templates={templates} />;
}
