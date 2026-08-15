"use client";

import { useEffect, useState } from "react";
import { PlusIcon, TrashIcon } from "@/components/icons";
import { ApiError } from "@/lib/api/client";
import { getContactSettings, updateContactSettings } from "@/lib/services/contactSettings.service";
import type { ContactSettingsDto, ContactWhatsAppNumberDto } from "@/types/api";

const COPY = {
  ar: {
    heading: "معلومات التواصل",
    subheading: "هذه القيم هي ما يظهر فعلياً لكل زائر على صفحة /contact-us.",
    email: "البريد الإلكتروني الأساسي",
    secondaryEmail: "بريد إلكتروني إضافي (اختياري)",
    responseTimeText: "نص وقت الاستجابة (مثال: 1H)",
    availabilityText: "نص أوقات التواجد (مثال: 7/24)",
    availableWorldwide: "متوفرون حول العالم",
    instagramUrl: "رابط انستغرام (اختياري)",
    tiktokUrl: "رابط تيك توك (اختياري)",
    whatsAppNumbers: "أرقام واتساب",
    countryCode: "رمز الدولة (SA)",
    phoneNumber: "رقم الهاتف",
    addNumber: "إضافة رقم",
    save: "حفظ التغييرات",
    saving: "جارٍ الحفظ...",
    saved: "تم الحفظ بنجاح.",
    error: "تعذر حفظ التغييرات. حاول مرة أخرى.",
    loadError: "تعذر تحميل معلومات التواصل.",
  },
  en: {
    heading: "Contact Info",
    subheading: "These values are exactly what every visitor sees on the /contact-us page.",
    email: "Primary email",
    secondaryEmail: "Secondary email (optional)",
    responseTimeText: "Response time text (e.g. 1H)",
    availabilityText: "Availability text (e.g. 7/24)",
    availableWorldwide: "Available worldwide",
    instagramUrl: "Instagram URL (optional)",
    tiktokUrl: "TikTok URL (optional)",
    whatsAppNumbers: "WhatsApp numbers",
    countryCode: "Country code (SA)",
    phoneNumber: "Phone number",
    addNumber: "Add number",
    save: "Save changes",
    saving: "Saving...",
    saved: "Saved successfully.",
    error: "Couldn't save changes. Try again.",
    loadError: "Couldn't load contact info.",
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

const EMPTY_SETTINGS: ContactSettingsDto = {
  email: "",
  secondaryEmail: "",
  responseTimeText: "",
  availabilityText: "",
  availableWorldwide: true,
  instagramUrl: "",
  tikTokUrl: "",
  whatsAppNumbers: [],
};

export function ContactSettingsForm({ language }: { language: "ar" | "en" }) {
  const t = COPY[language];
  const [form, setForm] = useState<ContactSettingsDto | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<"idle" | "saved" | "error">("idle");

  useEffect(() => {
    let cancelled = false;
    getContactSettings()
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

  function patch(changes: Partial<ContactSettingsDto>) {
    setForm((current) => (current ? { ...current, ...changes } : current));
  }

  function patchWhatsApp(index: number, changes: Partial<ContactWhatsAppNumberDto>) {
    setForm((current) => {
      if (!current) return current;
      const whatsAppNumbers = current.whatsAppNumbers.map((entry, i) => (i === index ? { ...entry, ...changes } : entry));
      return { ...current, whatsAppNumbers };
    });
  }

  function addWhatsAppNumber() {
    setForm((current) =>
      current
        ? { ...current, whatsAppNumbers: [...current.whatsAppNumbers, { countryCode: "", phoneNumber: "" }] }
        : current
    );
  }

  function removeWhatsAppNumber(index: number) {
    setForm((current) =>
      current ? { ...current, whatsAppNumbers: current.whatsAppNumbers.filter((_, i) => i !== index) } : current
    );
  }

  async function handleSave() {
    if (!form) return;
    setSaving(true);
    setSaveResult("idle");
    try {
      const saved = await updateContactSettings({
        ...form,
        secondaryEmail: form.secondaryEmail?.trim() || null,
        instagramUrl: form.instagramUrl?.trim() || null,
        tikTokUrl: form.tikTokUrl?.trim() || null,
        whatsAppNumbers: form.whatsAppNumbers.filter((entry) => entry.countryCode.trim() && entry.phoneNumber.trim()),
      });
      setForm(saved);
      setSaveResult("saved");
    } catch (err) {
      setSaveResult(err instanceof ApiError ? "error" : "error");
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
        <Field label={t.email}>
          <input
            value={values.email}
            onChange={(event) => patch({ email: event.target.value })}
            className={inputClass}
            dir="ltr"
          />
        </Field>
        <Field label={t.secondaryEmail}>
          <input
            value={values.secondaryEmail ?? ""}
            onChange={(event) => patch({ secondaryEmail: event.target.value })}
            className={inputClass}
            dir="ltr"
          />
        </Field>
        <Field label={t.responseTimeText}>
          <input
            value={values.responseTimeText}
            onChange={(event) => patch({ responseTimeText: event.target.value })}
            className={inputClass}
          />
        </Field>
        <Field label={t.availabilityText}>
          <input
            value={values.availabilityText}
            onChange={(event) => patch({ availabilityText: event.target.value })}
            className={inputClass}
          />
        </Field>
        <Field label={t.instagramUrl}>
          <input
            value={values.instagramUrl ?? ""}
            onChange={(event) => patch({ instagramUrl: event.target.value })}
            className={inputClass}
            dir="ltr"
          />
        </Field>
        <Field label={t.tiktokUrl}>
          <input
            value={values.tikTokUrl ?? ""}
            onChange={(event) => patch({ tikTokUrl: event.target.value })}
            className={inputClass}
            dir="ltr"
          />
        </Field>
      </div>

      <label className="mt-4 flex items-center gap-2">
        <input
          type="checkbox"
          checked={values.availableWorldwide}
          onChange={(event) => patch({ availableWorldwide: event.target.checked })}
          className="size-4 rounded border-border text-[#C8A24A] focus:ring-[#C8A24A]"
        />
        <span className="text-sm text-body-foreground">{t.availableWorldwide}</span>
      </label>

      <div className="mt-6">
        <p className="mb-2 text-xs font-medium text-body-foreground">{t.whatsAppNumbers}</p>
        <div className="space-y-2">
          {values.whatsAppNumbers.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                value={entry.countryCode}
                onChange={(event) => patchWhatsApp(index, { countryCode: event.target.value.toUpperCase() })}
                placeholder={t.countryCode}
                maxLength={2}
                className={`${inputClass} w-24 uppercase`}
                dir="ltr"
              />
              <input
                value={entry.phoneNumber}
                onChange={(event) => patchWhatsApp(index, { phoneNumber: event.target.value })}
                placeholder={t.phoneNumber}
                className={inputClass}
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => removeWhatsAppNumber(index)}
                className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-rose-100 dark:bg-rose-950/50 hover:text-rose-700 dark:text-rose-400"
                aria-label="Remove"
              >
                <TrashIcon className="size-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addWhatsAppNumber}
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[#C8A24A] hover:text-[#A68832]"
        >
          <PlusIcon className="size-3.5" />
          {t.addNumber}
        </button>
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
