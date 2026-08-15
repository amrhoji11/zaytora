import type { Metadata } from "next";
import { Suspense } from "react";
import { LoaderIcon } from "@/components/icons";
import { PublicInvitationView } from "./PublicInvitationView";

export const metadata: Metadata = {
  title: "معاينة الدعوة | ZAYTORA",
};

export default function InvitationPublicPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white text-gray-400">
          <LoaderIcon className="size-6 animate-spin" />
        </div>
      }
    >
      <PublicInvitationView />
    </Suspense>
  );
}
