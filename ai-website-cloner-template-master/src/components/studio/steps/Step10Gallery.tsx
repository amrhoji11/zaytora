import { ImageIcon, PlusIcon, TrashIcon } from "@/components/icons";
import { HintBox } from "@/components/studio/fields/HintBox";
import type { InvitationDetail } from "@/types/studio";

const MAX_IMAGES = 6;

export function Step10Gallery({
  value,
  onChange,
}: {
  value: InvitationDetail;
  onChange: (patch: Partial<InvitationDetail>) => void;
}) {
  const images = value.galleryImages;

  function updateAt(index: number, url: string) {
    onChange({ galleryImages: images.map((image, i) => (i === index ? url : image)) });
  }

  function removeAt(index: number) {
    onChange({ galleryImages: images.filter((_, i) => i !== index) });
  }

  return (
    <div className="space-y-3">
      <HintBox>ارفع حتى {MAX_IMAGES} صور — صور عائلية، صور القاعة، أو لحظات خاصة.</HintBox>

      <div className="grid grid-cols-3 gap-3">
        {images.map((url, index) => (
          <div key={index} className="group relative">
            <div className="aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
              {url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={url} alt="" className="size-full object-cover" />
              ) : (
                <div className="flex size-full items-center justify-center text-gray-300">
                  <ImageIcon className="size-6" />
                </div>
              )}
            </div>
            <input
              type="text"
              value={url}
              placeholder="رابط الصورة"
              onChange={(event) => updateAt(index, event.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-2 py-1 text-xs outline-none focus:border-gold"
            />
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
            onClick={() => onChange({ galleryImages: [...images, ""] })}
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
