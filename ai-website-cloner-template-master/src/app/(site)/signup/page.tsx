import type { Metadata } from "next";
import { Suspense } from "react";
import { LoaderIcon } from "@/components/icons";
import { SignupForm } from "./SignupForm";

export const metadata: Metadata = {
  title: "إنشاء حساب | ZAYTORA",
};

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-32 text-gray-400">
          <LoaderIcon className="size-6 animate-spin" />
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
