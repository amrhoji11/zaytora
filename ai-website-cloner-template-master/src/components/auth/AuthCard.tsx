"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { ApiError } from "@/lib/api/client";
import { forgotPassword, getGoogleLoginUrl } from "@/lib/services/account.service";
import { PasswordInput } from "@/components/PasswordInput";
import { OliveMark } from "@/components/OliveMark";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  GoogleIcon,
  LoaderIcon,
  LockIcon,
  MailIcon,
  PhoneIcon,
} from "@/components/icons";

const MIN_PASSWORD_LENGTH = 8;

// Meta's Pixel script sets these itself once fbevents.js loads (see
// MetaPixel.tsx) -- reading them here lets the server-side Conversions API
// event carry the same Click ID/Browser ID as the client Pixel, which Meta
// uses for event match quality. Undefined (not empty string) when absent,
// so the backend's own "was this actually provided" check works.
function readMetaCookie(name: "_fbc" | "_fbp"): string | undefined {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

type View = "signin" | "signup" | "forgot";

const COPY = {
  ar: {
    welcome: "مرحباً بك في ZAYTORA",
    signInSubtitle: "سجّل الدخول للمتابعة",
    continueWithGoogle: "المتابعة عبر Google",
    or: "أو",
    email: "البريد الإلكتروني",
    phone: "رقم الهاتف (اختياري)",
    password: "كلمة المرور",
    signIn: "تسجيل الدخول",
    forgotPassword: "نسيت كلمة المرور؟",
    needAccount: "ليس لديك حساب؟",
    signUpLink: "إنشاء حساب",
    backToSignIn: "العودة لتسجيل الدخول",
    resetHeading: "إعادة تعيين كلمة المرور",
    resetSubtitle: "أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور",
    sendResetLink: "إرسال رابط إعادة التعيين",
    resetSent: "إذا كان هذا البريد مسجلاً لدينا، تم إرسال رابط إعادة التعيين إليه.",
    createHeading: "إنشاء حسابك",
    confirmPassword: "تأكيد كلمة المرور",
    createAccount: "إنشاء حساب",
    passwordTooShort: `يجب أن تتكون كلمة المرور من ${MIN_PASSWORD_LENGTH} أحرف على الأقل`,
    passwordMismatch: "كلمتا المرور غير متطابقتين",
    genericError: "حدث خطأ، حاول مرة أخرى.",
    showPassword: "إظهار كلمة المرور",
    hidePassword: "إخفاء كلمة المرور",
    googleNotConfigured: "تسجيل الدخول عبر Google غير متاح حالياً. الرجاء استخدام البريد الإلكتروني.",
    externalLoginFailed: "تعذّر تسجيل الدخول، حاول مرة أخرى.",
  },
  en: {
    welcome: "Welcome to ZAYTORA",
    signInSubtitle: "Sign in to continue",
    continueWithGoogle: "Continue with Google",
    or: "OR",
    email: "Email",
    phone: "Phone number (optional)",
    password: "Password",
    signIn: "Sign in",
    forgotPassword: "Forgot password?",
    needAccount: "Need an account?",
    signUpLink: "Sign up",
    backToSignIn: "Back to sign in",
    resetHeading: "Reset your password",
    resetSubtitle: "Enter your email and we'll send you a link to reset your password",
    sendResetLink: "Send reset link",
    resetSent: "If that email is registered, we've sent a reset link to it.",
    createHeading: "Create your account",
    confirmPassword: "Confirm password",
    createAccount: "Create account",
    passwordTooShort: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
    passwordMismatch: "Passwords do not match",
    genericError: "Something went wrong. Please try again.",
    showPassword: "Show password",
    hidePassword: "Hide password",
    googleNotConfigured: "Google sign-in isn't available right now. Please use email instead.",
    externalLoginFailed: "Sign-in failed, please try again.",
  },
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="mb-1.5 block text-sm text-body-foreground">{children}</label>;
}

function EmailField({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="relative">
        <MailIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="email"
          required
          autoComplete="email"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          dir="ltr"
          className="w-full rounded-xl border border-border bg-background/5 py-2.5 pl-10 pr-3 text-sm text-foreground outline-none transition-colors focus:border-gold"
        />
      </div>
    </div>
  );
}

function PhoneField({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="relative">
        <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="tel"
          autoComplete="tel"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          dir="ltr"
          className="w-full rounded-xl border border-border bg-background/5 py-2.5 pl-10 pr-3 text-sm text-foreground outline-none transition-colors focus:border-gold"
        />
      </div>
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <p className="rounded-lg border border-red-200 dark:border-red-900/40 bg-red-100 dark:bg-red-950/30 px-3 py-2 text-sm text-red-700 dark:text-red-400" dir="auto">
      {message}
    </p>
  );
}

export function AuthCard({ initialView }: { initialView: "signin" | "signup" }) {
  const { language } = useLanguage();
  const t = COPY[language];
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/dashboard";
  const { login, register } = useAuth();

  const [view, setView] = useState<View>(initialView);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // Surfaces the backend's redirect-back error codes (from the Google
  // external-login flow) as a one-time banner instead of silently dropping
  // the user back on a blank login form with no explanation.
  const externalLoginError = searchParams.get("error");
  const [error, setError] = useState<string | null>(
    externalLoginError === "google-not-configured"
      ? t.googleNotConfigured
      : externalLoginError === "external-login-failed"
        ? t.externalLoginFailed
        : null
  );

  const BackChevron = language === "ar" ? ChevronRightIcon : ChevronLeftIcon;

  function switchView(next: View) {
    setView(next);
    setError(null);
    setResetSent(false);
    setPassword("");
    setConfirmPassword("");
    setPhone("");
  }

  function handleSocialClick() {
    window.location.href = getGoogleLoginUrl(returnUrl);
  }

  async function handleSignIn(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login({ email, password });
      router.push(returnUrl);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.genericError);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSignUp(event: React.FormEvent) {
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
      // No name field in this design — derive a display name from the email
      // local-part so the header still has something to show post-signup.
      await register({
        displayName: email.split("@")[0],
        email,
        password,
        phoneNumber: phone.trim() || undefined,
        fbc: readMetaCookie("_fbc"),
        fbp: readMetaCookie("_fbp"),
      });
      router.push(returnUrl);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.genericError);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleForgotPassword(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await forgotPassword(email);
      setResetSent(true);
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
          {view !== "signin" && (
            <button
              type="button"
              onClick={() => switchView("signin")}
              className="mb-4 flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <BackChevron className="size-4" />
              {t.backToSignIn}
            </button>
          )}

          {view === "signin" && (
            <>
              <h1 className="text-center text-2xl font-bold text-foreground">{t.welcome}</h1>
              <p className="mt-1 text-center text-sm text-muted-foreground">{t.signInSubtitle}</p>

              <button
                type="button"
                onClick={handleSocialClick}
                className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-border py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-background/5"
              >
                <GoogleIcon className="size-[18px]" />
                {t.continueWithGoogle}
              </button>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs font-medium tracking-wide text-muted-foreground">{t.or}</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <form className="space-y-4" onSubmit={handleSignIn}>
                <EmailField value={email} onChange={setEmail} label={t.email} />

                <div>
                  <FieldLabel>{t.password}</FieldLabel>
                  <PasswordInput
                    value={password}
                    onChange={setPassword}
                    autoComplete="current-password"
                    showLabel={t.showPassword}
                    hideLabel={t.hidePassword}
                    leadingIcon={<LockIcon className="size-4" />}
                  />
                </div>

                {error && <ErrorBanner message={error} />}

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C8A24A] to-[#A68832] py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {submitting ? <LoaderIcon className="size-4 animate-spin" /> : t.signIn}
                </button>

                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <button
                    type="button"
                    onClick={() => switchView("forgot")}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {t.forgotPassword}
                  </button>
                  <span className="text-muted-foreground">
                    {t.needAccount}{" "}
                    <button
                      type="button"
                      onClick={() => switchView("signup")}
                      className="font-semibold text-gold hover:underline"
                    >
                      {t.signUpLink}
                    </button>
                  </span>
                </div>
              </form>
            </>
          )}

          {view === "forgot" && (
            <>
              <h1 className="text-center text-xl font-bold text-foreground">{t.resetHeading}</h1>
              <p className="mt-2 text-center text-sm text-muted-foreground">{t.resetSubtitle}</p>

              {resetSent ? (
                <p className="mt-6 rounded-lg border border-emerald-200 dark:border-emerald-900/40 bg-emerald-100 dark:bg-emerald-950/30 px-3 py-2.5 text-center text-sm text-emerald-700 dark:text-emerald-400">
                  {t.resetSent}
                </p>
              ) : (
                <form className="mt-6 space-y-4" onSubmit={handleForgotPassword}>
                  <EmailField value={email} onChange={setEmail} label={t.email} />

                  {error && <ErrorBanner message={error} />}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C8A24A] to-[#A68832] py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                  >
                    {submitting ? <LoaderIcon className="size-4 animate-spin" /> : t.sendResetLink}
                  </button>
                </form>
              )}
            </>
          )}

          {view === "signup" && (
            <>
              <h1 className="text-center text-xl font-bold text-foreground">{t.createHeading}</h1>

              <form className="mt-6 space-y-4" onSubmit={handleSignUp}>
                <EmailField value={email} onChange={setEmail} label={t.email} />

                <PhoneField value={phone} onChange={setPhone} label={t.phone} />

                <div>
                  <FieldLabel>{t.password}</FieldLabel>
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
                  <FieldLabel>{t.confirmPassword}</FieldLabel>
                  <PasswordInput
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    autoComplete="new-password"
                    showLabel={t.showPassword}
                    hideLabel={t.hidePassword}
                    leadingIcon={<LockIcon className="size-4" />}
                  />
                </div>

                {error && <ErrorBanner message={error} />}

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C8A24A] to-[#A68832] py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {submitting ? <LoaderIcon className="size-4 animate-spin" /> : t.createAccount}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
