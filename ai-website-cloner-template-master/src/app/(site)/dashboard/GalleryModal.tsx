"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CameraIcon, ImageIcon, TrashIcon, UploadIcon, XIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

const COPY = {
  ar: {
    gallery: "المعرض",
    captured: "ملتقطة",
    addPhotos: "إضافة صور",
    emptyGallery: "لا توجد صور بعد",
    capturedEmptyTitle: "لا توجد صور ملتقطة بعد",
    capturedEmptyBody: "الصور الملتقطة أثناء الحفل ستظهر هنا",
    close: "إغلاق",
    deletePhoto: "حذف الصورة",
  },
  en: {
    gallery: "Gallery",
    captured: "Captured",
    addPhotos: "Add photos",
    emptyGallery: "No photos yet",
    capturedEmptyTitle: "No captured photos yet",
    capturedEmptyBody: "Photos taken during the event will appear here",
    close: "Close",
    deletePhoto: "Delete photo",
  },
};

type Tab = "gallery" | "captured";

export function GalleryModal({
  open,
  images,
  language,
  onClose,
  onAddPhotos,
  onRemovePhoto,
}: {
  open: boolean;
  images: string[];
  language: "ar" | "en";
  onClose: () => void;
  onAddPhotos: (files: FileList | null) => void;
  onRemovePhoto: (index: number) => void;
}) {
  const t = COPY[language];
  const [tab, setTab] = useState<Tab>("gallery");

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
          className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 sm:items-center sm:px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-card shadow-2xl sm:rounded-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-1 rounded-full bg-background/10 p-1">
                <button
                  type="button"
                  onClick={() => setTab("gallery")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                    tab === "gallery" ? "bg-border text-foreground shadow-sm" : "text-muted-foreground"
                  )}
                >
                  <ImageIcon className="size-3.5" />
                  {t.gallery} ({images.length})
                </button>
                <button
                  type="button"
                  onClick={() => setTab("captured")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                    tab === "captured" ? "bg-border text-foreground shadow-sm" : "text-muted-foreground"
                  )}
                >
                  <CameraIcon className="size-3.5" />
                  {t.captured} (0)
                </button>
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

            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              {tab === "gallery" ? (
                <>
                  <label className="mb-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-gold/40 py-2.5 text-sm font-medium text-gold transition-colors hover:bg-gold/5">
                    <UploadIcon className="size-4" />
                    {t.addPhotos}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(event) => onAddPhotos(event.target.files)}
                    />
                  </label>

                  {images.length === 0 ? (
                    <p className="py-10 text-center text-sm text-muted-foreground">{t.emptyGallery}</p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {images.map((url, index) => (
                        // `relative` for the delete button lives on this
                        // outer div; `overflow-hidden` for the rounded photo
                        // corners lives on an inner one — putting both on
                        // the same element would clip the button (offset
                        // half outside the photo box) to nothing.
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.25, delay: Math.min(index, 8) * 0.03, ease: "easeOut" }}
                          className="relative aspect-square"
                        >
                          <div className="size-full overflow-hidden rounded-2xl bg-background/10">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt="" className="size-full object-cover" />
                          </div>
                          <button
                            type="button"
                            onClick={() => onRemovePhoto(index)}
                            aria-label={t.deletePhoto}
                            title={t.deletePhoto}
                            className="absolute -top-1.5 -end-1.5 flex size-6 items-center justify-center rounded-full bg-background text-muted-foreground shadow transition-colors hover:bg-rose-100 dark:bg-rose-950/50 hover:text-rose-700 dark:text-rose-400"
                          >
                            <TrashIcon className="size-3.5" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center gap-3 py-14 text-center">
                  <span className="flex size-14 items-center justify-center rounded-full border-2 border-dashed border-white/15 text-muted-foreground">
                    <CameraIcon className="size-6" />
                  </span>
                  <p className="text-sm font-medium text-body-foreground">{t.capturedEmptyTitle}</p>
                  <p className="max-w-[80%] text-xs text-muted-foreground">{t.capturedEmptyBody}</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
