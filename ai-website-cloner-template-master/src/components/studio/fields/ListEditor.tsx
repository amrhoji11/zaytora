"use client";

import { PlusIcon, TrashIcon } from "@/components/icons";
import { useLanguage } from "@/context/LanguageContext";

const COPY = { ar: "حذف", en: "Delete" };

export function ListEditor<T>({
  items,
  onChange,
  createItem,
  renderItem,
  addLabel,
  emptyLabel,
  itemLabel,
  max,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  createItem: () => T;
  renderItem: (item: T, update: (patch: Partial<T>) => void, index: number) => React.ReactNode;
  addLabel: string;
  emptyLabel?: string;
  itemLabel?: string;
  max?: number;
}) {
  const { language } = useLanguage();
  function addItem() {
    onChange([...items, createItem()]);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function updateItem(index: number, patch: Partial<T>) {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  const atMax = max !== undefined && items.length >= max;

  return (
    <div className="space-y-3">
      {items.length === 0 && emptyLabel && (
        <p className="rounded-xl border border-dashed border-border py-6 text-center text-sm text-muted-foreground">
          {emptyLabel}
        </p>
      )}

      {items.map((item, index) => (
        <div key={index} className="relative rounded-xl border border-border bg-background/5 p-3">
          <button
            type="button"
            onClick={() => removeItem(index)}
            aria-label={COPY[language]}
            className="absolute left-3 top-3 text-muted-foreground transition-colors hover:text-rose-700 dark:text-rose-400"
          >
            <TrashIcon className="size-4" />
          </button>
          <div className="space-y-2 pl-8">
            {itemLabel && (
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {itemLabel} {index + 1}
              </p>
            )}
            {renderItem(item, (patch) => updateItem(index, patch), index)}
          </div>
        </div>
      ))}

      {!atMax && (
        <button
          type="button"
          onClick={addItem}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-gold/40 py-3 text-sm font-medium text-gold transition-colors hover:bg-gold/5"
        >
          <PlusIcon className="size-4" />
          {addLabel}
        </button>
      )}
    </div>
  );
}
