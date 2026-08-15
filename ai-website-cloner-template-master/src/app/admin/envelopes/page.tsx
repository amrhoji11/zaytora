"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import {
  createEnvelope,
  deleteEnvelope,
  listEnvelopes,
  updateEnvelope,
  uploadEnvelopeImage,
} from "@/lib/services/envelopes.service";
import { ApiError } from "@/lib/api/client";
import { LoaderIcon, PenLineIcon, SaveIcon, TrashIcon, UploadIcon, XIcon } from "@/components/icons";
import { EnvelopeSealPicker } from "@/components/admin/EnvelopeSealPicker";
import { FoldLineDrawer } from "@/components/admin/FoldLineDrawer";
import { EnvelopeDeleteDialog } from "@/components/admin/EnvelopeDeleteDialog";
import type { FoldPoint } from "@/lib/envelopeFlapGeometry";
import type { EnvelopeDto, EnvelopeOpeningStyle } from "@/types/api";

const OPENING_STYLES: EnvelopeOpeningStyle[] = ["flap", "scroll", "doorSlide", "doorFold"];

// Both door variants split the photo straight down the middle, independent
// of any seal — neither shows the seal/fold-line picker, so neither can
// require one.
function isDoorStyle(style: EnvelopeOpeningStyle): boolean {
  return style === "doorSlide" || style === "doorFold";
}

const COPY = {
  ar: {
    subtitle:
      "أضف صورة ظرف مرة واحدة وحدد مكان الختم فيها، وبعدها اختارها لأي عدد من القوالب من \"تعديل القالب\" — بدون رفع الصورة أو تحديد الختم من جديد كل مرة.",
    nameField: "اسم الظرف (للإدارة فقط)",
    namePlaceholder: "مثال: ظرف كحلي بختم ذهبي",
    imageField: "صورة الظرف",
    chooseImage: "اختر صورة",
    sealField: "مكان الختم بالصورة",
    sealHint: "دوس على مكان الختم بالصورة — طريقة الفتح تبلش بالظبط من هالنقطة.",
    sealEmpty: "اختر صورة فوق الأول عشان تقدر تحدد مكان الختم.",
    photoEmpty: "اختر صورة الظرف فوق أولاً.",
    openingStyleField: "طريقة الفتح",
    openingStyleValues: {
      flap: "ظرف بأربع أطراف",
      scroll: "لفافة (رول) مربوطة بخيط",
      doorSlide: "باب ينسحب أفقي",
      doorFold: "باب يتفتح دوران",
    } as Record<EnvelopeOpeningStyle, string>,
    openingStyleHint: {
      flap: "بينفتح بتقشير الأطراف الأربعة من الختم بالنص.",
      scroll: "بينفتح بفك اللفافة من نص الختم لجهتين.",
      doorSlide: "بينقسم نص بنص لمصراعين، وكل مصراع بينسحب أفقي لجهته على خط مستقيم بدون دوران — بدون علاقة بمكان ختم.",
      doorFold: "بينقسم نص بنص لمصراعين، وكل مصراع بيدور وبيتفتح لبرا زي باب حقيقي بمفصلة — بدون علاقة بمكان ختم.",
    } as Record<EnvelopeOpeningStyle, string>,
    foldLinesField: "خطوط الطيات",
    foldLinesDrawHint:
      "دوس نقطتين لكل طية: وحدة قريبة من الختم، والتانية عند حافة الظرف اللي بتوصلها الطية. كرر لكل طية موجودة بالصورة (وحدة، وحدتين، أربعة، أي عدد). دوس × على أي نقطة عشان تشيلها.",
    foldLinesCount: (count: number) =>
      count === 0
        ? "ما رسمت طيات — رح يفتح كأربع أطراف متساوية (الوضع الافتراضي)"
        : count === 1
          ? "طية وحدة مرسومة — لازم طية تانية على الأقل"
          : `${count} طيات مرسومة`,
    add: "إضافة ظرف",
    adding: "جارٍ الإضافة...",
    requiredError: "الرجاء اختيار صورة، إدخال اسم، وتحديد مكان الختم.",
    genericError: "تعذّر إضافة الظرف. حاول مرة أخرى.",
    listTitle: "الظروف",
    empty: "لا توجد ظروف بعد.",
    active: "نشط",
    inactive: "غير نشط",
    usedIn: (count: number) => (count === 1 ? "مستخدم بقالب واحد" : `مستخدم بـ ${count} قوالب`),
    unused: "غير مستخدم بأي قالب",
    edit: "تعديل",
    remove: "حذف",
    save: "حفظ",
    cancel: "إلغاء",
    loadError: "تعذّر تحميل الظروف.",
    deleting: "جارٍ الحذف...",
    deleteBlocked: "هذا الظرف مستخدم بقوالب حالية، شيله منها أولاً.",
  },
  en: {
    subtitle:
      "Add an envelope photo once and place its seal, then pick it for any number of templates from \"Edit Template\" — no re-uploading or re-placing the seal each time.",
    nameField: "Envelope name (admin only)",
    namePlaceholder: "e.g. Navy gold-seal envelope",
    imageField: "Envelope photo",
    chooseImage: "Choose image",
    sealField: "Seal position on the photo",
    sealHint: "Click where the seal sits in the photo — the open animation starts from exactly there.",
    sealEmpty: "Choose an image above first to place the seal.",
    photoEmpty: "Choose the envelope photo above first.",
    openingStyleField: "Opening style",
    openingStyleValues: {
      flap: "Four-flap envelope",
      scroll: "String-tied scroll",
      doorSlide: "Sliding double door",
      doorFold: "Hinged double door",
    } as Record<EnvelopeOpeningStyle, string>,
    openingStyleHint: {
      flap: "Opens by peeling all four corners back from the seal.",
      scroll: "Opens by unrolling from the seal outward to both sides.",
      doorSlide: "Splits down the middle into two leaves that slide straight out sideways, no rotation — no seal needed.",
      doorFold: "Splits down the middle into two leaves that hinge open in 3D like a real door — no seal needed.",
    } as Record<EnvelopeOpeningStyle, string>,
    foldLinesField: "Fold lines",
    foldLinesDrawHint:
      "Click two points per fold: one near the seal, then one where that fold reaches the envelope's edge. Repeat for every fold visible in the photo (one, two, four, any number). Click × on a point to remove it.",
    foldLinesCount: (count: number) =>
      count === 0
        ? "No fold lines drawn — opens as four equal flaps (the default)"
        : count === 1
          ? "One fold line drawn — needs at least one more"
          : `${count} fold lines drawn`,
    add: "Add envelope",
    adding: "Adding...",
    requiredError: "Please choose an image, enter a name, and place the seal.",
    genericError: "Couldn't add the envelope. Try again.",
    listTitle: "Envelopes",
    empty: "No envelopes yet.",
    active: "Active",
    inactive: "Inactive",
    usedIn: (count: number) => (count === 1 ? "Used in 1 template" : `Used in ${count} templates`),
    unused: "Not used in any template",
    edit: "Edit",
    remove: "Remove",
    save: "Save",
    cancel: "Cancel",
    loadError: "Couldn't load envelopes.",
    deleting: "Deleting...",
    deleteBlocked: "This envelope is assigned to existing templates — unassign it from them first.",
  },
};

const inputClass =
  "w-full rounded-xl border border-border px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors [color-scheme:light] dark:[color-scheme:dark] focus:border-[#C8A24A]";

export default function AdminEnvelopesPage() {
  const { language } = useLanguage();
  const t = COPY[language];

  const [envelopes, setEnvelopes] = useState<EnvelopeDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [sealX, setSealX] = useState<number | null>(null);
  const [sealY, setSealY] = useState<number | null>(null);
  const [openingStyle, setOpeningStyle] = useState<EnvelopeOpeningStyle>("flap");
  const [foldPoints, setFoldPoints] = useState<FoldPoint[]>([]);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingSealX, setEditingSealX] = useState<number | null>(null);
  const [editingSealY, setEditingSealY] = useState<number | null>(null);
  const [editingOpeningStyle, setEditingOpeningStyle] = useState<EnvelopeOpeningStyle>("flap");
  const [editingFoldPoints, setEditingFoldPoints] = useState<FoldPoint[]>([]);
  const [savingEdit, setSavingEdit] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const data = await listEnvelopes();
      setEnvelopes(data);
    } catch (error) {
      console.error("[admin/envelopes] failed to load:", error);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function handlePickFile(picked: File | null) {
    setFile(picked);
    setSealX(null);
    setSealY(null);
    setFoldPoints([]);
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return picked ? URL.createObjectURL(picked) : null;
    });
  }

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    setCreateError(null);

    const sealRequired = !isDoorStyle(openingStyle);
    if (!file || !name.trim() || (sealRequired && (sealX == null || sealY == null))) {
      setCreateError(t.requiredError);
      return;
    }

    setCreating(true);
    try {
      const { url } = await uploadEnvelopeImage(file);
      const created = await createEnvelope({
        name: name.trim(),
        photoUrl: url,
        sealXPercent: sealX ?? 50,
        sealYPercent: sealY ?? 50,
        openingStyle,
        foldPoints,
        isActive: true,
      });
      setEnvelopes((current) => [...current, created]);
      handlePickFile(null);
      setName("");
      setOpeningStyle("flap");
      setFoldPoints([]);
    } catch (error) {
      console.error("[admin/envelopes] failed to create:", error);
      setCreateError(t.genericError);
    } finally {
      setCreating(false);
    }
  }

  async function handleToggleActive(envelope: EnvelopeDto) {
    const nextActive = !envelope.isActive;
    setEnvelopes((current) => current.map((e) => (e.id === envelope.id ? { ...e, isActive: nextActive } : e)));
    try {
      await updateEnvelope(envelope.id, {
        name: envelope.name,
        photoUrl: envelope.photoUrl,
        sealXPercent: envelope.sealXPercent,
        sealYPercent: envelope.sealYPercent,
        openingStyle: envelope.openingStyle,
        foldPoints: envelope.foldPoints,
        isActive: nextActive,
      });
    } catch (error) {
      console.error("[admin/envelopes] failed to toggle active:", error);
      setEnvelopes((current) => current.map((e) => (e.id === envelope.id ? { ...e, isActive: envelope.isActive } : e)));
    }
  }

  function startEdit(envelope: EnvelopeDto) {
    setEditingId(envelope.id);
    setEditingName(envelope.name);
    setEditingSealX(envelope.sealXPercent);
    setEditingSealY(envelope.sealYPercent);
    setEditingOpeningStyle(envelope.openingStyle);
    setEditingFoldPoints(envelope.foldPoints);
  }

  async function saveEdit(envelope: EnvelopeDto) {
    const sealRequired = !isDoorStyle(editingOpeningStyle);
    if (!editingName.trim() || (sealRequired && (editingSealX == null || editingSealY == null))) return;
    setSavingEdit(true);
    try {
      const updated = await updateEnvelope(envelope.id, {
        name: editingName.trim(),
        photoUrl: envelope.photoUrl,
        sealXPercent: editingSealX ?? 50,
        sealYPercent: editingSealY ?? 50,
        openingStyle: editingOpeningStyle,
        foldPoints: editingFoldPoints,
        isActive: envelope.isActive,
      });
      setEnvelopes((current) => current.map((e) => (e.id === envelope.id ? { ...updated, templateCount: e.templateCount } : e)));
      setEditingId(null);
    } catch (error) {
      console.error("[admin/envelopes] failed to save edit:", error);
    } finally {
      setSavingEdit(false);
    }
  }

  async function confirmDelete() {
    if (!deletingId) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteEnvelope(deletingId);
      setEnvelopes((current) => current.filter((e) => e.id !== deletingId));
      setDeletingId(null);
    } catch (error) {
      console.error("[admin/envelopes] failed to delete:", error);
      setDeleteError(error instanceof ApiError && error.status === 409 ? t.deleteBlocked : t.genericError);
    } finally {
      setDeleting(false);
    }
  }

  const deletingEnvelope = envelopes.find((e) => e.id === deletingId) ?? null;

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">{t.subtitle}</p>

      <form
        onSubmit={handleCreate}
        className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_1px_3px_rgba(16,24,40,0.06)]"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-body-foreground">{t.nameField}</label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={t.namePlaceholder}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-body-foreground">{t.imageField}</label>
              <label className="flex w-fit cursor-pointer items-center gap-2 rounded-xl border border-dashed border-[#C8A24A]/40 px-4 py-2.5 text-sm font-medium text-[#C8A24A] transition-colors hover:bg-[#C8A24A]/5">
                <UploadIcon className="size-4" />
                {file ? file.name : t.chooseImage}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(event) => handlePickFile(event.target.files?.[0] ?? null)}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-body-foreground">{t.openingStyleField}</label>
              <div className="flex gap-2">
                {OPENING_STYLES.map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setOpeningStyle(style)}
                    className={cn(
                      "flex-1 rounded-xl border px-3 py-2 text-xs font-medium transition-colors",
                      openingStyle === style
                        ? "border-[#C8A24A] bg-[#C8A24A]/10 text-[#C8A24A]"
                        : "border-border text-body-foreground hover:bg-background/10"
                    )}
                  >
                    {t.openingStyleValues[style]}
                  </button>
                ))}
              </div>
              <p className="mt-1.5 text-[11px] text-muted-foreground">{t.openingStyleHint[openingStyle]}</p>
            </div>
          </div>

          <div>
            {openingStyle === "flap" ? (
              <>
                <label className="mb-1.5 block text-sm font-medium text-body-foreground">{t.foldLinesField}</label>
                <FoldLineDrawer
                  imageUrl={previewUrl ?? ""}
                  sealXPercent={sealX}
                  sealYPercent={sealY}
                  onSealChange={(x, y) => {
                    setSealX(x);
                    setSealY(y);
                  }}
                  points={foldPoints}
                  onChange={setFoldPoints}
                  emptyHint={t.sealEmpty}
                  placeSealHint={t.sealHint}
                  drawHint={t.foldLinesDrawHint}
                />
                <p className="mt-1.5 text-[11px] font-medium text-body-foreground">{t.foldLinesCount(foldPoints.length)}</p>
              </>
            ) : isDoorStyle(openingStyle) ? (
              <>
                <label className="mb-1.5 block text-sm font-medium text-body-foreground">{t.imageField}</label>
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrl}
                    alt=""
                    className="mx-auto aspect-[9/16] max-h-64 w-full rounded-xl border border-border object-cover"
                  />
                ) : (
                  <div className="flex aspect-[9/16] max-h-64 items-center justify-center rounded-xl border border-dashed border-border bg-background/40 px-6 text-center text-xs text-muted-foreground">
                    {t.photoEmpty}
                  </div>
                )}
              </>
            ) : (
              <>
                <label className="mb-1.5 block text-sm font-medium text-body-foreground">{t.sealField}</label>
                <EnvelopeSealPicker
                  imageUrl={previewUrl ?? ""}
                  xPercent={sealX}
                  yPercent={sealY}
                  onChange={(x, y) => {
                    setSealX(x);
                    setSealY(y);
                  }}
                  emptyHint={t.sealEmpty}
                />
                <p className="mt-1.5 text-[11px] text-muted-foreground">{t.sealHint}</p>
              </>
            )}
          </div>
        </div>

        {createError && <p className="text-sm text-rose-700 dark:text-rose-400">{createError}</p>}

        <button
          type="submit"
          disabled={creating}
          className="flex items-center gap-2 rounded-xl bg-[#C8A24A] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {creating ? <LoaderIcon className="size-4 animate-spin" /> : <UploadIcon className="size-4" />}
          {creating ? t.adding : t.add}
        </button>
      </form>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_1px_3px_rgba(16,24,40,0.06)]">
        <p className="mb-4 text-sm font-semibold text-foreground">{t.listTitle}</p>

        {loading ? (
          <div className="flex justify-center py-10">
            <LoaderIcon className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : loadError ? (
          <p className="py-6 text-center text-sm text-rose-700 dark:text-rose-400">{t.loadError}</p>
        ) : envelopes.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">{t.empty}</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {envelopes.map((envelope) => (
              <div
                key={envelope.id}
                className={cn(
                  "overflow-hidden rounded-xl border border-border bg-background",
                  !envelope.isActive && "opacity-50"
                )}
              >
                {editingId === envelope.id ? (
                  <div className="space-y-2 p-2">
                    <div className="flex gap-1.5">
                      {OPENING_STYLES.map((style) => (
                        <button
                          key={style}
                          type="button"
                          onClick={() => setEditingOpeningStyle(style)}
                          className={cn(
                            "flex-1 rounded-lg border px-2 py-1 text-[10px] font-medium transition-colors",
                            editingOpeningStyle === style
                              ? "border-[#C8A24A] bg-[#C8A24A]/10 text-[#C8A24A]"
                              : "border-border text-body-foreground hover:bg-background/10"
                          )}
                        >
                          {t.openingStyleValues[style]}
                        </button>
                      ))}
                    </div>
                    {editingOpeningStyle === "flap" ? (
                      <div>
                        <FoldLineDrawer
                          imageUrl={envelope.photoUrl}
                          sealXPercent={editingSealX}
                          sealYPercent={editingSealY}
                          onSealChange={(x, y) => {
                            setEditingSealX(x);
                            setEditingSealY(y);
                          }}
                          points={editingFoldPoints}
                          onChange={setEditingFoldPoints}
                          emptyHint={t.sealEmpty}
                          placeSealHint={t.sealHint}
                          drawHint={t.foldLinesDrawHint}
                        />
                        <p className="mt-1 text-[10px] font-medium text-body-foreground">{t.foldLinesCount(editingFoldPoints.length)}</p>
                      </div>
                    ) : isDoorStyle(editingOpeningStyle) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={envelope.photoUrl}
                        alt=""
                        className="mx-auto aspect-[9/16] max-h-64 w-full rounded-xl border border-border object-cover"
                      />
                    ) : (
                      <EnvelopeSealPicker
                        imageUrl={envelope.photoUrl}
                        xPercent={editingSealX}
                        yPercent={editingSealY}
                        onChange={(x, y) => {
                          setEditingSealX(x);
                          setEditingSealY(y);
                        }}
                        emptyHint={t.sealEmpty}
                      />
                    )}
                  </div>
                ) : (
                  <div className="relative aspect-[9/16] bg-black/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={envelope.photoUrl} alt={envelope.name} className="size-full object-cover" />
                    <span className="absolute bottom-1.5 end-1.5 rounded-full bg-black/60 px-2 py-0.5 text-[9px] font-medium text-white backdrop-blur-sm">
                      {t.openingStyleValues[envelope.openingStyle]}
                      {envelope.openingStyle === "flap" && envelope.foldPoints.length > 0
                        ? ` · ${envelope.foldPoints.length}`
                        : ""}
                    </span>
                  </div>
                )}
                <div className="space-y-2 p-3">
                  {editingId === envelope.id ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        value={editingName}
                        onChange={(event) => setEditingName(event.target.value)}
                        className="w-full rounded-lg border border-border px-2 py-1 text-xs text-foreground outline-none focus:border-[#C8A24A]"
                      />
                      <button
                        type="button"
                        onClick={() => saveEdit(envelope)}
                        disabled={savingEdit}
                        aria-label={t.save}
                        className="flex size-6 shrink-0 items-center justify-center rounded-lg text-emerald-700 dark:text-emerald-400 transition-colors hover:bg-emerald-100 dark:bg-emerald-950/50"
                      >
                        <SaveIcon className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        aria-label={t.cancel}
                        className="flex size-6 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-background/10"
                      >
                        <XIcon className="size-3.5" />
                      </button>
                    </div>
                  ) : (
                    <p className="truncate text-xs font-medium text-foreground" title={envelope.name}>
                      {envelope.name}
                    </p>
                  )}

                  <p className="text-[10px] text-muted-foreground">
                    {envelope.templateCount > 0 ? t.usedIn(envelope.templateCount) : t.unused}
                  </p>

                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(envelope)}
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-semibold transition-colors",
                        envelope.isActive
                          ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400"
                          : "bg-background/10 text-muted-foreground"
                      )}
                    >
                      {envelope.isActive ? t.active : t.inactive}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => startEdit(envelope)}
                        aria-label={t.edit}
                        title={t.edit}
                        className="flex size-6 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-background/10 hover:text-foreground"
                      >
                        <PenLineIcon className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteError(null);
                          setDeletingId(envelope.id);
                        }}
                        aria-label={t.remove}
                        title={t.remove}
                        className="flex size-6 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-rose-100 dark:bg-rose-950/50 hover:text-rose-700 dark:text-rose-400"
                      >
                        <TrashIcon className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {deleteError && <p className="text-sm text-rose-700 dark:text-rose-400">{deleteError}</p>}

      <EnvelopeDeleteDialog
        open={Boolean(deletingId)}
        name={deletingEnvelope?.name ?? ""}
        templateCount={deletingEnvelope?.templateCount ?? 0}
        language={language}
        deleting={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}
