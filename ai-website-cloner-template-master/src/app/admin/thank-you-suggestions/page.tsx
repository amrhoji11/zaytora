"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import {
  createThankYouSuggestion,
  deleteThankYouSuggestion,
  listThankYouSuggestions,
  setThankYouSuggestionActive,
  updateThankYouSuggestion,
  uploadThankYouSuggestionImage,
} from "@/lib/services/thankYouSuggestions.service";
import { LoaderIcon, PenLineIcon, SaveIcon, TrashIcon, UploadIcon, XIcon } from "@/components/icons";
import { ThankYouSuggestionDeleteDialog } from "@/components/admin/ThankYouSuggestionDeleteDialog";
import type { ThankYouSuggestionDto } from "@/types/api";

const COPY = {
  ar: {
    subtitle: "أدر بطاقات اقتراحات نص الشكر التي تظهر لصاحب الدعوة بدلاً من كتابة نص مخصص.",
    labelField: "اسم الاقتراح (للإدارة فقط)",
    labelPlaceholder: "مثال: بارك الله لكما-1",
    imageField: "صورة البطاقة",
    chooseImage: "اختر صورة",
    add: "إضافة اقتراح",
    adding: "جارٍ الإضافة...",
    requiredError: "الرجاء اختيار صورة وإدخال اسم.",
    genericError: "تعذّر إضافة الاقتراح. حاول مرة أخرى.",
    listTitle: "الاقتراحات",
    empty: "لا توجد اقتراحات بعد.",
    active: "نشط",
    inactive: "غير نشط",
    edit: "تعديل",
    remove: "حذف",
    save: "حفظ",
    cancel: "إلغاء",
    loadError: "تعذّر تحميل الاقتراحات.",
    deleting: "جارٍ الحذف...",
  },
  en: {
    subtitle: "Manage the thank-you suggestion cards shown to an invitation owner instead of typing custom text.",
    labelField: "Suggestion name (admin only)",
    labelPlaceholder: "e.g. Bless you both-1",
    imageField: "Card image",
    chooseImage: "Choose image",
    add: "Add suggestion",
    adding: "Adding...",
    requiredError: "Please choose an image and enter a name.",
    genericError: "Couldn't add the suggestion. Try again.",
    listTitle: "Suggestions",
    empty: "No suggestions yet.",
    active: "Active",
    inactive: "Inactive",
    edit: "Edit",
    remove: "Remove",
    save: "Save",
    cancel: "Cancel",
    loadError: "Couldn't load suggestions.",
    deleting: "Deleting...",
  },
};

const inputClass =
  "w-full rounded-xl border border-border px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-[#C8A24A]";

export default function AdminThankYouSuggestionsPage() {
  const { language } = useLanguage();
  const t = COPY[language];

  const [suggestions, setSuggestions] = useState<ThankYouSuggestionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [label, setLabel] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const data = await listThankYouSuggestions();
      setSuggestions(data);
    } catch (error) {
      console.error("[admin/thank-you-suggestions] failed to load:", error);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    setCreateError(null);

    if (!file || !label.trim()) {
      setCreateError(t.requiredError);
      return;
    }

    setCreating(true);
    try {
      const { url } = await uploadThankYouSuggestionImage(file);
      const created = await createThankYouSuggestion({
        label: label.trim(),
        imageUrl: url,
        isActive: true,
        sortOrder: suggestions.length,
      });
      setSuggestions((current) => [...current, created]);
      setFile(null);
      setLabel("");
    } catch (error) {
      console.error("[admin/thank-you-suggestions] failed to create:", error);
      setCreateError(t.genericError);
    } finally {
      setCreating(false);
    }
  }

  async function handleToggleActive(suggestion: ThankYouSuggestionDto) {
    const nextActive = !suggestion.isActive;
    setSuggestions((current) =>
      current.map((s) => (s.id === suggestion.id ? { ...s, isActive: nextActive } : s))
    );
    try {
      await setThankYouSuggestionActive(suggestion.id, nextActive);
    } catch (error) {
      console.error("[admin/thank-you-suggestions] failed to toggle active:", error);
      setSuggestions((current) =>
        current.map((s) => (s.id === suggestion.id ? { ...s, isActive: suggestion.isActive } : s))
      );
    }
  }

  function startEdit(suggestion: ThankYouSuggestionDto) {
    setEditingId(suggestion.id);
    setEditingLabel(suggestion.label);
  }

  async function saveEdit(suggestion: ThankYouSuggestionDto) {
    if (!editingLabel.trim()) return;
    setSavingEdit(true);
    try {
      const updated = await updateThankYouSuggestion(suggestion.id, {
        label: editingLabel.trim(),
        imageUrl: suggestion.imageUrl,
        isActive: suggestion.isActive,
        sortOrder: suggestion.sortOrder,
      });
      setSuggestions((current) => current.map((s) => (s.id === suggestion.id ? updated : s)));
      setEditingId(null);
    } catch (error) {
      console.error("[admin/thank-you-suggestions] failed to save edit:", error);
    } finally {
      setSavingEdit(false);
    }
  }

  async function confirmDelete() {
    if (!deletingId) return;
    setDeleting(true);
    try {
      await deleteThankYouSuggestion(deletingId);
      setSuggestions((current) => current.filter((s) => s.id !== deletingId));
      setDeletingId(null);
    } catch (error) {
      console.error("[admin/thank-you-suggestions] failed to delete:", error);
    } finally {
      setDeleting(false);
    }
  }

  const deletingSuggestion = suggestions.find((s) => s.id === deletingId) ?? null;

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">{t.subtitle}</p>

      <form
        onSubmit={handleCreate}
        className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_1px_3px_rgba(16,24,40,0.06)]"
      >
        <div>
          <label className="mb-1.5 block text-sm font-medium text-body-foreground">{t.labelField}</label>
          <input
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            placeholder={t.labelPlaceholder}
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
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className="hidden"
            />
          </label>
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
        ) : suggestions.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">{t.empty}</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className={cn(
                  "overflow-hidden rounded-xl border border-border bg-background",
                  !suggestion.isActive && "opacity-50"
                )}
              >
                <div className="aspect-square bg-black/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={suggestion.imageUrl} alt={suggestion.label} className="size-full object-cover" />
                </div>
                <div className="space-y-2 p-3">
                  {editingId === suggestion.id ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        value={editingLabel}
                        onChange={(event) => setEditingLabel(event.target.value)}
                        className="w-full rounded-lg border border-border px-2 py-1 text-xs text-foreground outline-none focus:border-[#C8A24A]"
                      />
                      <button
                        type="button"
                        onClick={() => saveEdit(suggestion)}
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
                    <p className="truncate text-xs font-medium text-foreground" title={suggestion.label}>
                      {suggestion.label}
                    </p>
                  )}

                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(suggestion)}
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-semibold transition-colors",
                        suggestion.isActive
                          ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400"
                          : "bg-background/10 text-muted-foreground"
                      )}
                    >
                      {suggestion.isActive ? t.active : t.inactive}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => startEdit(suggestion)}
                        aria-label={t.edit}
                        title={t.edit}
                        className="flex size-6 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-background/10 hover:text-foreground"
                      >
                        <PenLineIcon className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingId(suggestion.id)}
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

      <ThankYouSuggestionDeleteDialog
        open={Boolean(deletingId)}
        label={deletingSuggestion?.label ?? ""}
        language={language}
        deleting={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}
