"use client";

// Click-to-place seal position for an envelope photo (see /admin/envelopes)
// — replaces asking an admin to eyeball/type raw X/Y percentages against a
// photo they can't see next to the inputs. Percentages (not pixels) so the
// same coordinate works regardless of the photo's actual resolution,
// matching how PhotoWaxSealEnvelopeCover itself positions the seal.
export function EnvelopeSealPicker({
  imageUrl,
  xPercent,
  yPercent,
  onChange,
  emptyHint,
}: {
  imageUrl: string;
  xPercent: number | null;
  yPercent: number | null;
  onChange: (xPercent: number, yPercent: number) => void;
  emptyHint: string;
}) {
  function handlePlace(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((event.clientX - rect.left) / rect.width) * 100));
    const y = Math.min(100, Math.max(0, ((event.clientY - rect.top) / rect.height) * 100));
    onChange(Math.round(x * 10) / 10, Math.round(y * 10) / 10);
  }

  if (!imageUrl.trim()) {
    return (
      <div className="flex aspect-[9/16] max-h-64 items-center justify-center rounded-xl border border-dashed border-border bg-background/40 px-6 text-center text-xs text-muted-foreground">
        {emptyHint}
      </div>
    );
  }

  return (
    <div
      onClick={handlePlace}
      className="relative mx-auto aspect-[9/16] max-h-64 cursor-crosshair overflow-hidden rounded-xl border border-border"
    >
      {/* Admin-supplied file, previewed either as a local blob: URL (before
          upload) or the hosted URL (after) — plain <img> handles both and
          sidesteps next/image's remote-host restriction for what's just an
          internal preview. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
      {xPercent != null && yPercent != null && (
        <span
          aria-hidden
          className="absolute size-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#C8A24A] shadow-[0_0_0_2px_rgba(0,0,0,0.45)]"
          style={{ left: `${xPercent}%`, top: `${yPercent}%` }}
        />
      )}
    </div>
  );
}
