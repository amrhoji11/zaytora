"use client";

import { useEffect, useState } from "react";
import { LoaderIcon, UploadIcon, XIcon } from "@/components/icons";
import { CATEGORY_IDS, CATEGORY_LABELS, type CategoryId } from "@/lib/categories";
import { listEnvelopes } from "@/lib/services/envelopes.service";
import { uploadTemplateImage } from "@/lib/services/templates.service";
import type { EnvelopeDto, TemplateDto, TemplateWriteRequest } from "@/types/api";

const LAYOUTS = ["full-bleed", "boxed-hero", "overlay", "none"] as const;
const AMBIENT_EFFECTS = ["", "smoke", "petals", "sparkle", "snow", "none"] as const;
const NAME_FONTS = ["", "font-cinzel", "font-serif", "font-sans", "italic font-serif"] as const;
const HERO_FRAME_STYLES = ["", "archIslamic"] as const;
const DATE_REVEAL_STYLES = ["", "scratch"] as const;
const INVITATION_CARD_STYLES = ["", "archIslamic"] as const;

const COPY = {
  ar: {
    title: "تعديل القالب",
    close: "إغلاق",
    category: "التصنيف",
    imageUrl: "رابط صورة الغلاف الرئيسية (مطلوب)",
    backgroundImageUrl: "رابط صورة الخلفية الحية (اختياري — نفس الصورة أعلاه إن تُركت فارغة)",
    uploadFromDevice: "أو ارفع صورة من جهازك",
    uploading: "جارٍ الرفع...",
    uploadError: "تعذّر رفع الصورة. تأكد إنها JPG أو PNG أو WebP بحجم أقل من 8 ميغابايت.",
    layout: "طريقة عرض الصورة",
    layoutHint: {
      "full-bleed": "خلفية كاملة خلف الصفحة",
      "boxed-hero": "صورة محصورة داخل بطاقة في الأعلى فقط",
      overlay: "زخرفة فوق الثيم بلا صورة خلفية",
      none: "بدون صورة — ثيم لوني فقط",
    },
    pageBg: "لون خلفية الصفحة (hex أو تدرّج hex,hex)",
    cardBg: "لون خلفية البطاقات",
    textColor: "لون النص",
    primaryAccent: "اللون المميز",
    defaultNamesFont: "خط الأسماء الافتراضي (اختياري)",
    ambientEffect: "تأثير الجسيمات (اختياري)",
    heroFrameStyle: "إطار صورة المقدمة (اختياري)",
    dateRevealStyle: "طريقة كشف التاريخ (اختياري)",
    invitationCardStyle: "شكل بطاقة الدعوة الرئيسية (اختياري)",
    sceneStyleValues: {
      "": "افتراضي",
      archIslamic: "قوس إسلامي",
      scratch: "بطاقة خدش",
    } as Record<string, string>,
    envelopeLibrary: "ظرف الفتح (اختياري)",
    envelopeLibraryNone: "بدون",
    envelopeLibraryHint: "زوّد ظروف جديدة من صفحة \"الظروف\" بلوحة التحكم.",
    envelopeLibraryLoadError: "تعذّر تحميل قائمة الظروف.",
    isPopular: "قالب شائع (يظهر أولاً في الترتيب)",
    save: "حفظ التعديلات",
    cancel: "إلغاء",
    required: "رابط صورة الغلاف مطلوب.",
    saving: "جارٍ الحفظ...",
  },
  en: {
    title: "Edit Template",
    close: "Close",
    category: "Category",
    imageUrl: "Cover image URL (required)",
    backgroundImageUrl: "Live background image URL (optional — same as above if left blank)",
    uploadFromDevice: "Or upload a photo from your device",
    uploading: "Uploading...",
    uploadError: "Couldn't upload the image. Make sure it's a JPG, PNG, or WebP under 8MB.",
    layout: "Photo layout",
    layoutHint: {
      "full-bleed": "Full-bleed photo behind the whole page",
      "boxed-hero": "Photo boxed into a card, hero only",
      overlay: "Decorative overlay on the theme, no background photo",
      none: "No photo — color theme only",
    },
    pageBg: "Page background (hex, or hex,hex gradient)",
    cardBg: "Card background color",
    textColor: "Text color",
    primaryAccent: "Accent color",
    defaultNamesFont: "Default names font (optional)",
    ambientEffect: "Ambient particle effect (optional)",
    heroFrameStyle: "Hero photo frame style (optional)",
    dateRevealStyle: "Date reveal style (optional)",
    invitationCardStyle: "Main invitation card style (optional)",
    sceneStyleValues: {
      "": "Default",
      archIslamic: "Islamic arch",
      scratch: "Scratch card",
    } as Record<string, string>,
    envelopeLibrary: "Opening envelope (optional)",
    envelopeLibraryNone: "None",
    envelopeLibraryHint: "Add new envelopes from the \"Envelopes\" admin page.",
    envelopeLibraryLoadError: "Couldn't load the envelope list.",
    isPopular: "Popular template (sorts first)",
    save: "Save changes",
    cancel: "Cancel",
    required: "Cover image URL is required.",
    saving: "Saving...",
  },
};

// [color-scheme:...] tells the browser which palette to render this
// control's own native chrome in (a <select>'s dropdown popup, in
// particular) — without it, the popup defaults to a light background while
// still inheriting this class's light --foreground text in dark mode,
// making every non-selected option nearly invisible. Same fix already used
// for native inputs elsewhere in the studio (e.g. DateTimeField.tsx).
const inputClass =
  "w-full rounded-xl border border-border px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors [color-scheme:light] dark:[color-scheme:dark] focus:border-[#C8A24A]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-body-foreground">{label}</span>
      {children}
    </label>
  );
}

export function TemplateEditModal({
  record,
  language,
  onClose,
  onSave,
}: {
  record: TemplateDto | null;
  language: "ar" | "en";
  onClose: () => void;
  onSave: (id: string, payload: TemplateWriteRequest) => Promise<unknown>;
}) {
  if (!record) return null;

  return (
    <TemplateEditModalContent key={record.id} record={record} language={language} onClose={onClose} onSave={onSave} />
  );
}

function TemplateEditModalContent({
  record,
  language,
  onClose,
  onSave,
}: {
  record: TemplateDto;
  language: "ar" | "en";
  onClose: () => void;
  onSave: (id: string, payload: TemplateWriteRequest) => Promise<unknown>;
}) {
  const t = COPY[language];
  const [form, setForm] = useState<TemplateWriteRequest>({
    category: record.category,
    imageUrl: record.imageUrl,
    backgroundImageUrl: record.backgroundImageUrl ?? "",
    layout: record.layout ?? "none",
    pageBg: record.pageBg ?? "",
    cardBg: record.cardBg ?? "",
    textColor: record.textColor ?? "",
    primaryAccent: record.primaryAccent ?? "",
    defaultNamesFont: record.defaultNamesFont ?? "",
    heroIllustrationUrl: record.heroIllustrationUrl ?? "",
    decorationImageUrl: record.decorationImageUrl ?? "",
    ambientEffect: record.ambientEffect ?? "",
    heroFrameStyle: record.heroFrameStyle ?? "",
    dateRevealStyle: record.dateRevealStyle ?? "",
    invitationCardStyle: record.invitationCardStyle ?? "",
    envelopeId: record.envelopeId ?? "",
    isPopular: record.isPopular,
    isActive: record.isActive,
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [envelopes, setEnvelopes] = useState<EnvelopeDto[]>([]);
  const [envelopesError, setEnvelopesError] = useState(false);

  // Which of the two image fields is mid-upload, if any — lets the two
  // "upload from device" buttons below share one handler while each shows
  // its own loading state independently.
  const [uploadingField, setUploadingField] = useState<"imageUrl" | "backgroundImageUrl" | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    listEnvelopes()
      .then((data) => {
        if (!cancelled) setEnvelopes(data);
      })
      .catch(() => {
        if (!cancelled) setEnvelopesError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function patch(next: Partial<TemplateWriteRequest>) {
    setForm((current) => ({ ...current, ...next }));
  }

  async function handleUpload(field: "imageUrl" | "backgroundImageUrl", file: File) {
    setUploadError(null);
    setUploadingField(field);
    try {
      const { url } = await uploadTemplateImage(file);
      patch({ [field]: url });
    } catch {
      setUploadError(t.uploadError);
    } finally {
      setUploadingField(null);
    }
  }

  async function handleSave() {
    if (!form.imageUrl.trim()) {
      setError(t.required);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave(record.id, {
        ...form,
        backgroundImageUrl: form.backgroundImageUrl?.trim() || null,
        pageBg: form.pageBg?.trim() || null,
        cardBg: form.cardBg?.trim() || null,
        textColor: form.textColor?.trim() || null,
        primaryAccent: form.primaryAccent?.trim() || null,
        defaultNamesFont: form.defaultNamesFont?.trim() || null,
        heroIllustrationUrl: form.heroIllustrationUrl?.trim() || null,
        decorationImageUrl: form.decorationImageUrl?.trim() || null,
        ambientEffect: form.ambientEffect?.trim() || null,
        // Legacy hardcoded envelope styles (waxseal/crimsonSeal/oliveSeal/
        // navyGoldSeal) are no longer editable here — force-cleared on every
        // save so a template can only show an envelope from the admin's own
        // /admin/envelopes library (envelopeId below).
        envelopeStyle: null,
        heroFrameStyle: form.heroFrameStyle?.trim() || null,
        dateRevealStyle: form.dateRevealStyle?.trim() || null,
        invitationCardStyle: form.invitationCardStyle?.trim() || null,
        envelopeId: form.envelopeId?.trim() || null,
      });
      onClose();
    } catch {
      setError(t.required);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.title}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[85vh] w-full max-w-lg flex-col overflow-y-auto rounded-2xl bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-lg font-bold text-foreground">{t.title}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{record.code}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-background/10 hover:text-foreground"
          >
            <XIcon className="size-4" />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t.category}>
            <select value={form.category} onChange={(event) => patch({ category: event.target.value as CategoryId })} className={inputClass}>
              {CATEGORY_IDS.map((id) => (
                <option key={id} value={id}>
                  {CATEGORY_LABELS[language][id]}
                </option>
              ))}
            </select>
          </Field>

          <Field label={t.layout}>
            <select value={form.layout} onChange={(event) => patch({ layout: event.target.value })} className={inputClass}>
              {LAYOUTS.map((layout) => (
                <option key={layout} value={layout}>
                  {t.layoutHint[layout]}
                </option>
              ))}
            </select>
          </Field>

          <div className="sm:col-span-2">
            <Field label={t.imageUrl}>
              <div className="flex items-center gap-3">
                <input value={form.imageUrl} onChange={(event) => patch({ imageUrl: event.target.value })} className={inputClass} />
                {form.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.imageUrl} alt="" className="h-14 w-9 shrink-0 rounded-lg border border-border object-cover" />
                )}
              </div>
            </Field>
            <label className="mt-1.5 flex w-fit cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-[#C8A24A]/40 px-3 py-1.5 text-xs font-medium text-[#C8A24A] transition-colors hover:bg-[#C8A24A]/5">
              {uploadingField === "imageUrl" ? <LoaderIcon className="size-3.5 animate-spin" /> : <UploadIcon className="size-3.5" />}
              {uploadingField === "imageUrl" ? t.uploading : t.uploadFromDevice}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                disabled={uploadingField !== null}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  if (file) void handleUpload("imageUrl", file);
                }}
                className="hidden"
              />
            </label>
          </div>

          <div className="sm:col-span-2">
            <Field label={t.backgroundImageUrl}>
              <div className="flex items-center gap-3">
                <input
                  value={form.backgroundImageUrl ?? ""}
                  onChange={(event) => patch({ backgroundImageUrl: event.target.value })}
                  className={inputClass}
                />
                {form.backgroundImageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.backgroundImageUrl} alt="" className="h-14 w-9 shrink-0 rounded-lg border border-border object-cover" />
                )}
              </div>
            </Field>
            <label className="mt-1.5 flex w-fit cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-[#C8A24A]/40 px-3 py-1.5 text-xs font-medium text-[#C8A24A] transition-colors hover:bg-[#C8A24A]/5">
              {uploadingField === "backgroundImageUrl" ? (
                <LoaderIcon className="size-3.5 animate-spin" />
              ) : (
                <UploadIcon className="size-3.5" />
              )}
              {uploadingField === "backgroundImageUrl" ? t.uploading : t.uploadFromDevice}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                disabled={uploadingField !== null}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  if (file) void handleUpload("backgroundImageUrl", file);
                }}
                className="hidden"
              />
            </label>
          </div>

          {uploadError && (
            <p className="text-xs font-medium text-rose-700 sm:col-span-2 dark:text-rose-400">{uploadError}</p>
          )}

          <div className="sm:col-span-2">
            <Field label={t.pageBg}>
              <input
                value={form.pageBg ?? ""}
                onChange={(event) => patch({ pageBg: event.target.value })}
                placeholder="#faf1ea,#fffdfa"
                className={inputClass}
              />
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:col-span-2">
            <Field label={t.cardBg}>
              <input
                type="color"
                value={form.cardBg || "#f5f5f5"}
                onChange={(event) => patch({ cardBg: event.target.value })}
                className="h-10 w-full cursor-pointer rounded-xl border border-border"
              />
            </Field>
            <Field label={t.textColor}>
              <input
                type="color"
                value={form.textColor || "#1f1f1f"}
                onChange={(event) => patch({ textColor: event.target.value })}
                className="h-10 w-full cursor-pointer rounded-xl border border-border"
              />
            </Field>
            <Field label={t.primaryAccent}>
              <input
                type="color"
                value={form.primaryAccent || "#C8A24A"}
                onChange={(event) => patch({ primaryAccent: event.target.value })}
                className="h-10 w-full cursor-pointer rounded-xl border border-border"
              />
            </Field>
          </div>

          <Field label={t.defaultNamesFont}>
            <select
              value={form.defaultNamesFont ?? ""}
              onChange={(event) => patch({ defaultNamesFont: event.target.value })}
              className={inputClass}
            >
              {NAME_FONTS.map((font) => (
                <option key={font || "default"} value={font}>
                  {font || (language === "ar" ? "الافتراضي" : "Default")}
                </option>
              ))}
            </select>
          </Field>

          <Field label={t.ambientEffect}>
            <select
              value={form.ambientEffect ?? ""}
              onChange={(event) => patch({ ambientEffect: event.target.value })}
              className={inputClass}
            >
              {AMBIENT_EFFECTS.map((effect) => (
                <option key={effect || "default"} value={effect}>
                  {effect || (language === "ar" ? "تلقائي" : "Auto")}
                </option>
              ))}
            </select>
          </Field>

          <div className="sm:col-span-2">
            <Field label={t.envelopeLibrary}>
              <div className="flex items-center gap-3">
                <select
                  value={form.envelopeId ?? ""}
                  onChange={(event) => patch({ envelopeId: event.target.value })}
                  className={inputClass}
                >
                  <option value="">{t.envelopeLibraryNone}</option>
                  {envelopes.map((envelope) => (
                    <option key={envelope.id} value={envelope.id}>
                      {envelope.name}
                    </option>
                  ))}
                </select>
                {form.envelopeId &&
                  (() => {
                    const selected = envelopes.find((e) => e.id === form.envelopeId);
                    return selected ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={selected.photoUrl}
                        alt={selected.name}
                        className="h-14 w-9 shrink-0 rounded-lg border border-border object-cover"
                      />
                    ) : null;
                  })()}
              </div>
            </Field>
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              {envelopesError ? t.envelopeLibraryLoadError : t.envelopeLibraryHint}
            </p>
          </div>

          <Field label={t.heroFrameStyle}>
            <select
              value={form.heroFrameStyle ?? ""}
              onChange={(event) => patch({ heroFrameStyle: event.target.value })}
              className={inputClass}
            >
              {HERO_FRAME_STYLES.map((style) => (
                <option key={style || "default"} value={style}>
                  {t.sceneStyleValues[style]}
                </option>
              ))}
            </select>
          </Field>

          <Field label={t.dateRevealStyle}>
            <select
              value={form.dateRevealStyle ?? ""}
              onChange={(event) => patch({ dateRevealStyle: event.target.value })}
              className={inputClass}
            >
              {DATE_REVEAL_STYLES.map((style) => (
                <option key={style || "default"} value={style}>
                  {t.sceneStyleValues[style]}
                </option>
              ))}
            </select>
          </Field>

          <Field label={t.invitationCardStyle}>
            <select
              value={form.invitationCardStyle ?? ""}
              onChange={(event) => patch({ invitationCardStyle: event.target.value })}
              className={inputClass}
            >
              {INVITATION_CARD_STYLES.map((style) => (
                <option key={style || "default"} value={style}>
                  {t.sceneStyleValues[style]}
                </option>
              ))}
            </select>
          </Field>

          <label className="flex items-center gap-2 sm:col-span-2">
            <input
              type="checkbox"
              checked={form.isPopular}
              onChange={(event) => patch({ isPopular: event.target.checked })}
              className="size-4 rounded border-border text-[#C8A24A] focus:ring-[#C8A24A]"
            />
            <span className="text-sm text-body-foreground">{t.isPopular}</span>
          </label>
        </div>

        {error && <p className="mt-3 text-xs font-medium text-rose-700 dark:text-rose-400">{error}</p>}

        <div className="mt-5 flex items-center justify-end gap-2 border-t border-border pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-medium text-body-foreground transition-colors hover:bg-background/10"
          >
            {t.cancel}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl bg-[#C8A24A] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? t.saving : t.save}
          </button>
        </div>
      </div>
    </div>
  );
}
