"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { ApiError } from "@/lib/api/client";
import { CheckIcon, LoaderIcon, MailIcon, PhoneIcon, UserIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

const COPY = {
  ar: {
    title: "إعدادات الحساب",
    subtitle: "إدارة معلومات التواصل الخاصة بحسابك",
    email: "البريد الإلكتروني",
    userId: "المعرّف",
    phone: "رقم الهاتف",
    phonePlaceholder: "أدخل رقم هاتفك",
    save: "حفظ",
    saved: "تم حفظ رقم الهاتف بنجاح.",
    genericError: "حدث خطأ، حاول مرة أخرى.",
  },
  en: {
    title: "Account settings",
    subtitle: "Manage your account's contact information",
    email: "Email",
    userId: "User ID",
    phone: "Phone number",
    phonePlaceholder: "Enter your phone number",
    save: "Save",
    saved: "Phone number saved successfully.",
    genericError: "Something went wrong. Please try again.",
  },
};

const GLASS_CARD =
  "rounded-3xl border border-border bg-card/80 shadow-[0_8px_24px_rgba(0,0,0,0.25)] backdrop-blur-md";

export function AccountSettingsView() {
  const { language } = useLanguage();
  const t = COPY[language];
  const { user, loading: authLoading, updateProfile } = useAuth();
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login?returnUrl=%2Faccount");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    setPhone(user?.phoneNumber ?? "");
  }, [user]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setSaved(false);
    try {
      await updateProfile({ phoneNumber: phone.trim() });
      setSaved(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.genericError);
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoaderIcon className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h1 className="text-2xl font-bold text-foreground">{t.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t.subtitle}</p>

        <div className={cn("mt-6 space-y-5 p-6", GLASS_CARD)}>
          <div className="flex items-center gap-2 text-sm text-body-foreground">
            <MailIcon className="size-4 shrink-0 text-gold" />
            <span className="text-muted-foreground">{t.email}:</span>
            <span dir="ltr">{user.email}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-body-foreground">
            <UserIcon className="size-4 shrink-0 text-gold" />
            <span className="text-muted-foreground">{t.userId}:</span>
            <span dir="ltr">#U-{user.id.slice(0, 6).toUpperCase()}</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 border-t border-border pt-5">
            <label className="block text-sm font-medium text-body-foreground">{t.phone}</label>
            <div className="relative">
              <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="tel"
                autoComplete="tel"
                value={phone}
                placeholder={t.phonePlaceholder}
                onChange={(event) => {
                  setPhone(event.target.value);
                  setSaved(false);
                }}
                dir="ltr"
                className="w-full rounded-xl border border-border bg-background/5 py-2.5 pl-10 pr-3 text-sm text-foreground outline-none transition-colors focus:border-gold"
              />
            </div>

            {error && (
              <p
                className="rounded-lg border border-red-200 dark:border-red-900/40 bg-red-100 dark:bg-red-950/30 px-3 py-2 text-sm text-red-700 dark:text-red-400"
                dir="auto"
              >
                {error}
              </p>
            )}

            {saved && !error && (
              <p className="flex items-center gap-1.5 rounded-lg border border-emerald-200 dark:border-emerald-900/40 bg-emerald-100 dark:bg-emerald-950/30 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-400">
                <CheckIcon className="size-4 shrink-0" />
                {t.saved}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C8A24A] to-[#A68832] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? <LoaderIcon className="size-4 animate-spin" /> : t.save}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
