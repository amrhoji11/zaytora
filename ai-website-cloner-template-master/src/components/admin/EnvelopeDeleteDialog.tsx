"use client";

import { AnimatePresence, motion } from "framer-motion";
import { TrashIcon } from "@/components/icons";

const COPY = {
  ar: {
    title: "هل أنت متأكد من حذف هذا الظرف؟",
    body: (name: string) => `سيتم حذف "${name}" نهائياً. لا يمكن التراجع عن هذا الإجراء.`,
    inUse: (name: string, count: number) =>
      `"${name}" مستخدم حاليًا بـ ${count} قالب. لازم تشيله من هالقوالب أولاً (من "تعديل القالب" → "ظرف من المكتبة") قبل ما تقدر تحذفه.`,
    delete: "حذف",
    cancel: "إلغاء",
  },
  en: {
    title: "Delete this envelope?",
    body: (name: string) => `"${name}" will be permanently removed. This action cannot be undone.`,
    inUse: (name: string, count: number) =>
      `"${name}" is currently assigned to ${count} template(s). Unassign it from them first (Edit Template → "Envelope from library") before deleting.`,
    delete: "Delete",
    cancel: "Cancel",
  },
};

export function EnvelopeDeleteDialog({
  open,
  name,
  templateCount,
  language,
  deleting,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  name: string;
  templateCount: number;
  language: "ar" | "en";
  deleting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const t = COPY[language];
  const inUse = templateCount > 0;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 px-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-sm rounded-3xl bg-card p-6 text-center shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/50">
              <TrashIcon className="size-6 text-red-700 dark:text-red-400" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-foreground">{t.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-body-foreground">
              {inUse ? t.inUse(name, templateCount) : t.body(name)}
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-body-foreground transition-colors hover:bg-background/10"
              >
                {t.cancel}
              </button>
              {!inUse && (
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={deleting}
                  className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {t.delete}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
