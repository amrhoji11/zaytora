"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LoaderIcon } from "@/components/icons";
import { getInvitation } from "@/lib/services/invitations.service";
import { getTemplates } from "@/lib/services/templates.service";
import { buildMockInvitation } from "@/lib/mockInvitation";
import type { InvitationDetail } from "@/types/studio";
import { InvitationCanvas } from "@/components/studio/phone-preview/InvitationCanvas";

// The guest-facing, standalone equivalent of numinds.me/invitationpublic — a
// real navigable page: full native page scroll inside a max-w-[393px]
// centered column, with InvitationCanvas's nav/modals anchored to the
// viewport via variant="standalone".
//
// Three distinct callers feed this page real vs. demo data, all via
// window.open(..., "_blank"):
// - Studio Step 18 ("فتح المعاينة الكاملة") and the dashboard's per-booking
//   preview button both pass ?id=<invitationId>&preview=true — the actual
//   entered data for that draft/booking, watermarked as a preview.
// - The Home page / templates grid "Preview" button passes
//   ?template=<templateCode> — no real invitation exists yet, so the canvas
//   renders a fully-populated mock invitation for that template instead,
//   with no preview watermark (matching numinds.me's template-preview flow).
export function PublicInvitationView() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const templateCode = searchParams.get("template");
  const isPreview = searchParams.get("preview") === "true";

  const [invitation, setInvitation] = useState<InvitationDetail | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    getInvitation(id)
      .then((detail) => {
        if (!cancelled) setInvitation(detail);
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (id || !templateCode) return;
    let cancelled = false;
    getTemplates()
      .then((templates) => {
        if (cancelled) return;
        const match = templates.find((tpl) => tpl.code.toLowerCase() === templateCode.toLowerCase());
        setInvitation(buildMockInvitation(match?.id ?? null, match?.category ?? null));
      })
      .catch(() => {
        if (!cancelled) setInvitation(buildMockInvitation(null));
      });
    return () => {
      cancelled = true;
    };
  }, [id, templateCode]);

  if ((!id && !templateCode) || notFound) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-white px-6 text-center" dir="rtl">
        <p className="text-base font-medium text-gray-900">لم يتم العثور على هذه الدعوة</p>
        <p className="text-sm text-gray-500">This invitation could not be found.</p>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-gray-400">
        <LoaderIcon className="size-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="relative mx-auto w-full max-w-[393px] overflow-x-clip">
        {isPreview && (
          <div className="absolute left-1/2 top-6 z-40 -translate-x-1/2 rounded-full border border-gray-200 bg-white/60 px-6 py-2 shadow-sm backdrop-blur-md">
            <span className="text-sm font-medium text-gray-700">Preview Mode</span>
          </div>
        )}

        <InvitationCanvas value={invitation} variant="standalone" readOnly={isPreview || !id} />
      </div>

      {isPreview && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
          <span
            className="select-none whitespace-nowrap rounded bg-black bg-opacity-60 px-3 py-1 uppercase text-white/90"
            style={{
              fontSize: "clamp(30px, 8vw, 120px)",
              fontWeight: 800,
              letterSpacing: "0.25em",
              transform: "scale(0.85)",
            }}
          >
            Preview
          </span>
        </div>
      )}
    </div>
  );
}
