import type { Metadata } from "next";
import { Suspense } from "react";
import { LoaderIcon } from "@/components/icons";
import { ResetPasswordView } from "./ResetPasswordView";

export const metadata: Metadata = {
  title: "إعادة تعيين كلمة المرور | ZAYTORA",
};

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-32 text-gray-400">
          <LoaderIcon className="size-6 animate-spin" />
        </div>
      }
    >
      <ResetPasswordView />
    </Suspense>
  );
}
