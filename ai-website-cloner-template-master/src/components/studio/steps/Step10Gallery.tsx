import { useRef } from "react";
import { ImageIcon, PlusIcon, TrashIcon } from "@/components/icons";
import { HintBox } from "@/components/studio/fields/HintBox";
import type { InvitationDetail } from "@/types/studio";

const MAX_IMAGES = 6;

function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function Step10Gallery({
  value,
  onChange,
}: {
  value: InvitationDetail;
  onChange: (patch: Partial<InvitationDetail>) => void;
}) {
  const images = value.galleryImages;
  const fileInputRef = useRef<HTMLInputElement>(null);

  function removeAt(index: number) {
    onChange({ galleryImages: images.filter((_, i) => i !== index) });
  }

  async function handleFilesSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;

    const remainingSlots = MAX_IMAGES - images.length;
    const dataUrls = await Promise.all(files.slice(0, remainingSlots).map(readAsDataUrl));
    onChange({ galleryImages: [...images, ...dataUrls] });
  }

  return (
    <div className="space-y-3">
      <HintBox>ارفع حتى {MAX_IMAGES} صور — صور عائلية، صور القاعة، أو لحظات خاصة.</HintBox>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFilesSelected}
      />

      <div className="grid grid-cols-3 gap-3">
        {images.map((url, index) => (
          <div key={index} className="group relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
            {url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={url} alt="" className="size-full object-cover" />
            ) : (
              <div className="flex size-full items-center justify-center text-gray-300">
                <ImageIcon className="size-6" />
              </div>
            )}
            <button
              type="button"
              onClick={() => removeAt(index)}
              aria-label="حذف"
              className="absolute -top-2 -end-2 flex size-5 items-center justify-center rounded-full bg-white text-gray-400 shadow transition-colors hover:text-rose-500"
            >
              <TrashIcon className="size-3" />
            </button>
          </div>
        ))}

        {images.length < MAX_IMAGES && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-gold/40 text-gold transition-colors hover:bg-gold/5"
          >
            <PlusIcon className="size-5" />
            <span className="text-xs font-medium">إضافة</span>
          </button>
        )}
      </div>
    </div>
  );
}
