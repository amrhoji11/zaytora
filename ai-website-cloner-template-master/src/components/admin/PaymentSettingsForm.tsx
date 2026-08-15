"use client";

import { useEffect, useState } from "react";
import { getPaymentSettings, updatePaymentSettings } from "@/lib/services/paymentSettings.service";
import type { PaymentSettingsDto } from "@/types/api";

const COPY = {
  ar: {
    heading: "إعدادات الدفع",
    subheading:
      "لا توجد بوابة دفع إلكترونية — هذه هي بيانات الحساب اللي بتظهر للعميل بعد إتمام الطلب ليحوّل المبلغ إليه يدوياً. لا تُخزَّن هنا أي بيانات CVV أو تاريخ انتهاء البطاقة.",
    recipientName: "اسم المستلم",
    accountNumber: "رقم الحساب / البطاقة",
    bankName: "اسم البنك (اختياري)",
    iban: "الآيبان (اختياري)",
    instructions: "تعليمات إضافية للعميل (اختياري)",
    save: "حفظ التغييرات",
    saving: "جارٍ الحفظ...",
    saved: "تم الحفظ بنجاح.",
    error: "تعذر حفظ التغييرات. حاول مرة أخرى.",
    loadError: "تعذر تحميل إعدادات الدفع.",
  },
  en: {
    heading: "Payment Settings",
    subheading:
      "There's no online payment gateway — this is the receiving-account info shown to a customer after they place an order, so they can transfer the amount manually. Never store a CVV or expiry date here.",
    recipientName: "Recipient name",
    accountNumber: "Account / card number",
    bankName: "Bank name (optional)",
    iban: "IBAN (optional)",
    instructions: "Additional instructions for the customer (optional)",
    save: "Save changes",
    saving: "Saving...",
    saved: "Saved successfully.",
    error: "Couldn't save changes. Try again.",
    loadError: "Couldn't load payment settings.",
  },
};

const inputClass =
  "w-full rounded-xl border border-border px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-[#C8A24A]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-body-foreground">{label}</span>
      {children}
    </label>
  );
}

const EMPTY_SETTINGS: PaymentSettingsDto = {
  recipientName: "",
  accountNumber: "",
  bankName: "",
  iban: "",
  instructions: "",
};

export function PaymentSettingsForm({ language }: { language: "ar" | "en" }) {
  const t = COPY[language];
  const [form, setForm] = useState<PaymentSettingsDto | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<"idle" | "saved" | "error">("idle");

  useEffect(() => {
    let cancelled = false;
    getPaymentSettings()
      .then((data) => {
        if (!cancelled) setForm(data);
      })
      .catch(() => {
        if (!cancelled) setLoadError(t.loadError);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function patch(changes: Partial<PaymentSettingsDto>) {
    setForm((current) => (current ? { ...current, ...changes } : current));
  }

  async function handleSave() {
    if (!form) return;
    setSaving(true);
    setSaveResult("idle");
    try {
      const saved = await updatePaymentSettings({
        ...form,
        bankName: form.bankName?.trim() || null,
        iban: form.iban?.trim() || null,
        instructions: form.instructions?.trim() || null,
      });
      setForm(saved);
      setSaveResult("saved");
    } catch {
      setSaveResult("error");
    } finally {
      setSaving(false);
    }
  }

  if (loadError) {
    return <p className="text-sm text-rose-700 dark:text-rose-400">{loadError}</p>;
  }

  const values = form ?? EMPTY_SETTINGS;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_1px_3px_rgba(16,24,40,0.06)]">
      <p className="text-sm font-semibold text-foreground">{t.heading}</p>
      <p className="mt-1 text-xs text-muted-foreground">{t.subheading}</p>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label={t.recipientName}>
          <input
            value={values.recipientName}
            onChange={(event) => patch({ recipientName: event.target.value })}
            className={inputClass}
          />
        </Field>
        <Field label={t.accountNumber}>
          <input
            value={values.accountNumber}
            onChange={(event) => patch({ accountNumber: event.target.value })}
            className={inputClass}
            dir="ltr"
          />
        </Field>
        <Field label={t.bankName}>
          <input
            value={values.bankName ?? ""}
            onChange={(event) => patch({ bankName: event.target.value })}
            className={inputClass}
          />
        </Field>
        <Field label={t.iban}>
          <input
            value={values.iban ?? ""}
            onChange={(event) => patch({ iban: event.target.value })}
            className={inputClass}
            dir="ltr"
          />
        </Field>
      </div>

      <div className="mt-4">
        <Field label={t.instructions}>
          <textarea
            value={values.instructions ?? ""}
            onChange={(event) => patch({ instructions: event.target.value })}
            rows={2}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !form}
          className="rounded-xl bg-gradient-to-r from-[#C8A24A] to-[#A68832] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? t.saving : t.save}
        </button>
        {saveResult === "saved" && <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">{t.saved}</span>}
        {saveResult === "error" && <span className="text-xs font-medium text-rose-700 dark:text-rose-400">{t.error}</span>}
      </div>
    </div>
  );
}
