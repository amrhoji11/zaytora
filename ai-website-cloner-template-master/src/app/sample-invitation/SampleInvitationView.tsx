"use client";

import { useMemo, useSyncExternalStore } from "react";
import { LoaderIcon } from "@/components/icons";
import { buildSampleInvitation, SAMPLE_HERO_IMAGE_URL } from "@/lib/sampleInvitationData";
import { InvitationCanvas } from "@/components/studio/phone-preview/InvitationCanvas";

const emptySubscribe = () => () => {};

// True only once the component has actually hydrated on the client, false
// on the server and on the very first client render — the standard
// useSyncExternalStore trick for content that must never render during SSR,
// without the cascading-render lint issue a `useEffect(() => setState(true))`
// "hasMounted" flag would trigger.
function useHasMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

// A self-contained showcase invitation — no draft id, no backend call — built
// from hand-authored mock data (see src/lib/sampleInvitationData.ts) so it
// renders the exact same guest-facing experience as a real /invitationpublic
// page (countdown, RSVP sheet, gallery, wishes...) without depending on the
// ASP.NET Core API being up.
//
// Gated behind useHasMounted rather than built at module/render time,
// mirroring PublicInvitationView's fetch-in-useEffect pattern — the
// invitation's eventDateTime feeds InvitationCanvas's useCountdown(), whose
// initial tick reads Date.now(). Computing it during a server render (or
// during the initial client render before hydration) bakes in the server's
// "now", which no longer matches the browser's "now" by the time React
// hydrates, and React flags that as a hydration mismatch.
export function SampleInvitationView() {
  const hasMounted = useHasMounted();
  const invitation = useMemo(() => buildSampleInvitation(), []);

  if (!hasMounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-gray-400">
        <LoaderIcon className="size-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="relative mx-auto w-full max-w-[393px] overflow-x-clip">
        <InvitationCanvas value={invitation} variant="standalone" previewImageUrl={SAMPLE_HERO_IMAGE_URL} readOnly />
      </div>
    </div>
  );
}
