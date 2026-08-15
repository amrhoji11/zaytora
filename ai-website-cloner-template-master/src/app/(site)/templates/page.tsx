import { Suspense } from "react";
import type { Metadata } from "next";
import { TemplatesPageView } from "./TemplatesPageView";

export const metadata: Metadata = {
  title: "القوالب | ZAYTORA",
};

export default function TemplatesPage() {
  return (
    <Suspense>
      <TemplatesPageView />
    </Suspense>
  );
}
