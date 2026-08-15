"use client";

import { AnimatePresence, motion } from "framer-motion";
import { WarningIcon } from "@/components/icons";

// Kept in English regardless of site language — matches the "Delete Account"
// menu item itself, which is already hardcoded English in both ar/en COPY.
const TEXT = {
  title: "Delete Account",
  subtitle: "This action cannot be undone",
  body: "Are you sure you want to delete your account? All your invitations and data will be permanently removed.",
  confirm: "Delete Account",
  cancel: "Cancel",
};

export function DeleteAccountDialog({
  open,
  pending,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  pending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          dir="ltr"
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
            className="w-full max-w-sm rounded-2xl bg-background p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-foreground">{TEXT.title}</h2>
                <p className="mt-1 text-xs text-gray-400">{TEXT.subtitle}</p>
              </div>
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-red-50">
                <WarningIcon className="size-5 text-red-500" />
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-body-foreground">{TEXT.body}</p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                disabled={pending}
                onClick={onConfirm}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-50"
              >
                {pending ? "..." : TEXT.confirm}
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={onCancel}
                className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-body-foreground transition-colors hover:bg-muted disabled:opacity-50"
              >
                {TEXT.cancel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
