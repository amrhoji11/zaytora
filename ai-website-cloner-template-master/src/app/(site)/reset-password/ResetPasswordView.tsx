"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { ApiError } from "@/lib/api/client";
import { resetPassword } from "@/lib/services/account.service";
import { PasswordInput } from "@/components/PasswordInput";
import { OliveMark } from "@/components/OliveMark";
import { LoaderIcon, LockIcon } from "@/components/icons";

const MIN_PASSWORD_LENGTH = 8;

const COPY = {
  ar: {
    heading: "تعيين كلمة مرور جديدة",
    subtitle: "أدخل كلمة المرور الجديدة لحسابك",
    password: "كلمة المرور الجديدة",
    confirmPassword: "تأكيد كلمة المرور",
    submit: "حفظ كلمة المرور",
    success: "تم تغيير كلمة المرور بنجاح.",
    goToLogin: "الذهاب لتسجيل الدخول",
    invalidLink: "رابط إعادة التعيين غير صالح. اطلب رابطاً جديداً من صفحة تسجيل الدخول.",
    passwordTooShort: `يجب أن تتكون كلمة المرور من ${MIN_PASSWORD_LENGTH} أحرف على الأقل`,
    passwordMismatch: "كلمتا المرور غير متطابقتين",
    genericError: "حدث خطأ، حاول مرة أخرى.",
    showPassword: "إظهار كلمة المرور",
    hidePassword: "إخفاء كلمة المرور",
  },
  en: {
    heading: "Set a new password",
    subtitle: "Enter a new password for your account",
    password: "New password",
    confirmPassword: "Confirm password",
    submit: "Save password",
    success: "Your password has been changed.",
    goToLogin: "Go to sign in",
    invalidLink: "This reset link is invalid. Request a new one from the sign-in page.",
    passwordTooShort: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
    passwordMismatch: "Passwords do not match",
    genericError: "Something went wrong. Please try again.",
    showPassword: "Show password",
    hidePassword: "Hide password",
  },
};

export function ResetPasswordView() {
  const { language } = useLanguage();
  const t = COPY[language];
  const searchParams = useSearchParams();

  const email = searchParams.get("email") ?? "";
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(t.passwordTooShort);
      return;
    }
    if (password !== confirmPassword) {
      setError(t.passwordMismatch);
      return;
    }

    setSubmitting(true);
    try {
      await resetPassword({ email, token, newPassword: password });
      setDone(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.genericError);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <div className="relative w-full max-w-sm">
        <div className="absolute left-1/2 top-0 z-10 flex size-20 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-0.5 rounded-full border border-border bg-card shadow-md">
          <OliveMark className="h-4 w-5" />
          <span className="font-cinzel text-[10px] font-semibold tracking-widest text-olive-vivid uppercase">ZAYTORA</span>
        </div>

        <div className="rounded-3xl border border-border bg-card px-8 pb-8 pt-14 shadow-lg">
          {!email || !token ? (
            <p className="rounded-lg border border-red-200 dark:border-red-900/40 bg-red-100 dark:bg-red-950/30 px-3 py-2.5 text-center text-sm text-red-700 dark:text-red-400" dir="auto">
              {t.invalidLink}
            </p>
          ) : done ? (
            <>
              <p
                className="rounded-lg border border-emerald-200 dark:border-emerald-900/40 bg-emerald-100 dark:bg-emerald-950/30 px-3 py-2.5 text-center text-sm text-emerald-700 dark:text-emerald-400"
                dir="auto"
              >
                {t.success}
              </p>
              <Link
                href="/login"
                className="mt-4 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#C8A24A] to-[#A68832] py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                {t.goToLogin}
              </Link>
            </>
          ) : (
            <>
              <h1 className="text-center text-xl font-bold text-foreground">{t.heading}</h1>
              <p className="mt-2 text-center text-sm text-muted-foreground">{t.subtitle}</p>

              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="mb-1.5 block text-sm text-body-foreground">{t.password}</label>
                  <PasswordInput
                    value={password}
                    onChange={setPassword}
                    autoComplete="new-password"
                    showLabel={t.showPassword}
                    hideLabel={t.hidePassword}
                    leadingIcon={<LockIcon className="size-4" />}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm text-body-foreground">{t.confirmPassword}</label>
                  <PasswordInput
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    autoComplete="new-password"
                    showLabel={t.showPassword}
                    hideLabel={t.hidePassword}
                    leadingIcon={<LockIcon className="size-4" />}
                  />
                </div>

                {error && (
                  <p className="rounded-lg border border-red-200 dark:border-red-900/40 bg-red-100 dark:bg-red-950/30 px-3 py-2 text-sm text-red-700 dark:text-red-400" dir="auto">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C8A24A] to-[#A68832] py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {submitting ? <LoaderIcon className="size-4 animate-spin" /> : t.submit}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
