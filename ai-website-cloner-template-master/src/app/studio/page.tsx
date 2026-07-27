import type { Metadata } from "next";
import { Suspense } from "react";
import { LoaderIcon } from "@/components/icons";
import { StudioWizard } from "@/components/studio/StudioWizard";

export const metadata: Metadata = {
  title: "الاستوديو | Numinds",
};

export default function StudioPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-32 text-gray-400">
          <LoaderIcon className="size-6 animate-spin" />
        </div>
      }
    >
      <StudioWizard />
    </Suspense>
  );
}
