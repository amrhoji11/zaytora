"use client";

import { useRef } from "react";
import { ToggleField } from "@/components/studio/fields/ToggleField";
import { TextField } from "@/components/studio/fields/TextField";
import { TextareaField } from "@/components/studio/fields/TextareaField";
import { HintBox } from "@/components/studio/fields/HintBox";
import { ListEditor } from "@/components/studio/fields/ListEditor";
import { PlusIcon, TrashIcon } from "@/components/icons";
import type { InvitationDetail, WishlistItem } from "@/types/studio";

export function Step14Gift({
  value,
  onChange,
}: {
  value: InvitationDetail;
  onChange: (patch: Partial<InvitationDetail>) => void;
}) {
  const qrInputRef = useRef<HTMLInputElement>(null);
  const wishImageInputRef = useRef<HTMLInputElement>(null);
  const wishImageTargetRef = useRef<((imageUrl: string) => void) | null>(null);

  async function readAsDataUrl(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  async function handleQrSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    onChange({ giftQrImageUrl: await readAsDataUrl(file) });
  }

  function requestWishlistImage(apply: (imageUrl: string) => void) {
    wishImageTargetRef.current = apply;
    wishImageInputRef.current?.click();
  }

  async function handleWishlistImageSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    const apply = wishImageTargetRef.current;
    event.target.value = "";
    wishImageTargetRef.current = null;
    if (!file || !apply) return;
    apply(await readAsDataUrl(file));
  }

  return (
    <div className="space-y-5">
      <HintBox>
        فعّل هذا حتى يتمكن الضيوف من إرسال هدية عبر التحويل البنكي أو تصفح قائمة أمنياتك.
      </HintBox>

      <ToggleField
        label="تفعيل الهدايا"
        description="يمكن للضيوف إرسال هدية أو تصفح قائمة الأمنيات"
        checked={value.enableGifts}
        onChange={(enableGifts) => onChange({ enableGifts })}
      />

      {value.enableGifts && (
        <>
          <ToggleField
            label="إضافة رسم الهدايا"
            description="يضيف 5% إضافية عند الدفع"
            checked={Boolean(value.giftFeeCoverage)}
            onChange={(giftFeeCoverage) => onChange({ giftFeeCoverage })}
          />

          <TextareaField
            label="رسالة للضيوف"
            value={value.giftMessage ?? ""}
            placeholder="مثال: هديتكم الكريمة تسعدنا 🎁"
            rows={3}
            onChange={(giftMessage) => onChange({ giftMessage })}
          />

          {/* Bank transfer / cash */}
          <div className="space-y-4 border-t border-gray-100 pt-4">
            <ToggleField
              label="التحويل البنكي / الكاش"
              description="شارك حساباً بنكياً أو رمز QR لاستقبال الهدايا"
              checked={Boolean(value.giftBankTransferEnabled)}
              onChange={(giftBankTransferEnabled) => onChange({ giftBankTransferEnabled })}
            />

            {value.giftBankTransferEnabled && (
              <div className="space-y-3">
                <TextField
                  label="اسم صاحب الحساب"
                  value={value.giftAccountHolderName ?? ""}
                  placeholder="مثال: محمد العتيبي"
                  onChange={(giftAccountHolderName) => onChange({ giftAccountHolderName })}
                />
                <TextField
                  label="رقم الحساب البنكي (IBAN)"
                  value={value.giftIban ?? ""}
                  placeholder="SA00 0000 0000 0000 0000 0000"
                  onChange={(giftIban) => onChange({ giftIban })}
                />

                <div>
                  <label className="mb-1.5 block text-sm text-gray-700">صورة رمز QR البنكي</label>
                  <input
                    ref={qrInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleQrSelected}
                  />
                  {value.giftQrImageUrl ? (
                    <div className="relative w-28">
                      <div className="aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={value.giftQrImageUrl} alt="" className="size-full object-cover" />
                      </div>
                      <button
                        type="button"
                        onClick={() => onChange({ giftQrImageUrl: null })}
                        aria-label="حذف"
                        className="absolute -top-2 -end-2 flex size-5 items-center justify-center rounded-full bg-white text-gray-400 shadow transition-colors hover:text-rose-500"
                      >
                        <TrashIcon className="size-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => qrInputRef.current?.click()}
                      className="flex aspect-square w-28 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-gold/40 text-gold transition-colors hover:bg-gold/5"
                    >
                      <PlusIcon className="size-5" />
                      <span className="text-xs font-medium">رفع صورة</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Wishlist */}
          <div className="space-y-4 border-t border-gray-100 pt-4">
            <ToggleField
              label="قائمة الأمنيات"
              description="شارك قائمة بالهدايا التي تتمناها"
              checked={Boolean(value.giftWishlistEnabled)}
              onChange={(giftWishlistEnabled) => onChange({ giftWishlistEnabled })}
            />

            {value.giftWishlistEnabled && (
              <>
                <input
                  ref={wishImageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleWishlistImageSelected}
                />
                <ListEditor<WishlistItem>
                  items={value.giftWishlistItems ?? []}
                  onChange={(giftWishlistItems) => onChange({ giftWishlistItems })}
                  createItem={() => ({ name: "", link: "", imageUrl: "" })}
                  addLabel="إضافة عنصر"
                  emptyLabel="لم تتم إضافة أمنيات بعد"
                  itemLabel="أمنية"
                  renderItem={(item, update) => (
                    <div className="flex gap-3">
                      <div className="shrink-0">
                        {item.imageUrl ? (
                          <div className="relative size-16">
                            <div className="size-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={item.imageUrl} alt="" className="size-full object-cover" />
                            </div>
                            <button
                              type="button"
                              onClick={() => update({ imageUrl: "" })}
                              aria-label="حذف الصورة"
                              className="absolute -top-1.5 -end-1.5 flex size-4 items-center justify-center rounded-full bg-white text-gray-400 shadow transition-colors hover:text-rose-500"
                            >
                              <TrashIcon className="size-2.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => requestWishlistImage((imageUrl) => update({ imageUrl }))}
                            className="flex size-16 flex-col items-center justify-center gap-0.5 rounded-lg border border-dashed border-gold/40 text-gold transition-colors hover:bg-gold/5"
                          >
                            <PlusIcon className="size-4" />
                            <span className="text-[10px]">صورة</span>
                          </button>
                        )}
                      </div>

                      <div className="min-w-0 flex-1 space-y-2">
                        <TextField
                          label="اسم الهدية"
                          required
                          value={item.name}
                          placeholder="مثال: خلاط كهربائي"
                          onChange={(name) => update({ name })}
                        />
                        <TextField
                          label="رابط (استشهادي)"
                          value={item.link ?? ""}
                          placeholder="https://..."
                          onChange={(link) => update({ link })}
                        />
                      </div>
                    </div>
                  )}
                />
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
