import type { Metadata } from "next";
import { Suspense } from "react";
import { LoaderIcon } from "@/components/icons";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "تسجيل الدخول | ZAYTORA",
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-32 text-gray-400">
          <LoaderIcon className="size-6 animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
