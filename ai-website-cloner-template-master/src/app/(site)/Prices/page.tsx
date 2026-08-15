import type { Metadata } from "next";
import { Suspense } from "react";
import { LoaderIcon } from "@/components/icons";
import { PricesView } from "./PricesView";

export const metadata: Metadata = {
  title: "الأسعار | ZAYTORA",
};

export default function PricesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-32 text-gray-400">
          <LoaderIcon className="size-6 animate-spin" />
        </div>
      }
    >
      <PricesView />
    </Suspense>
  );
}
