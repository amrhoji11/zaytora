import { PlusIcon, TrashIcon } from "@/components/icons";
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
      <p className="text-xs text-gray-500">
        ارفع حتى {MAX_IMAGES} صور — صور عائلية، صور القاعة، أو لحظات خاصة. الصق رابط الصورة أدناه.
      </p>

      {images.map((url, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type="text"
            value={url}
            placeholder="https://example.com/photo.jpg"
            onChange={(event) => updateAt(index, event.target.value)}
            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gold"
          />
          <button
            type="button"
            onClick={() => removeAt(index)}
            aria-label="حذف"
            className="text-gray-300 transition-colors hover:text-rose-500"
          >
            <TrashIcon className="size-4" />
          </button>
        </div>
      ))}

      {images.length < MAX_IMAGES && (
        <button
          type="button"
          onClick={() => onChange({ galleryImages: [...images, ""] })}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-gold/40 py-3 text-sm font-medium text-gold transition-colors hover:bg-gold/5"
        >
          <PlusIcon className="size-4" />
          إضافة ({images.length}/{MAX_IMAGES})
        </button>
      )}
    </div>
  );
}
