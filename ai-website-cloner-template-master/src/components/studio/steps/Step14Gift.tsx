"use client";

import { useRef } from "react";
import { ToggleField } from "@/components/studio/fields/ToggleField";
import { TextField } from "@/components/studio/fields/TextField";
import { TextareaField } from "@/components/studio/fields/TextareaField";
import { HintBox } from "@/components/studio/fields/HintBox";
import { ListEditor } from "@/components/studio/fields/ListEditor";
import { PlusIcon, TrashIcon } from "@/components/icons";
import { useLanguage } from "@/context/LanguageContext";
import type { InvitationDetail, WishlistItem } from "@/types/studio";

const COPY = {
  ar: {
    hint: "فعّل هذا حتى يتمكن الضيوف من إرسال هدية عبر التحويل البنكي أو تصفح قائمة أمنياتك.",
    enableGifts: "تفعيل الهدايا",
    enableGiftsDescription: "يمكن للضيوف إرسال هدية أو تصفح قائمة الأمنيات",
    guestMessage: "رسالة للضيوف",
    guestMessagePlaceholder: "مثال: هديتكم الكريمة تسعدنا 🎁",
    bankTransferToggle: "التحويل البنكي / الكاش",
    bankTransferDescription: "شارك حساباً بنكياً أو رمز QR لاستقبال الهدايا",
    accountHolderName: "اسم صاحب الحساب",
    accountHolderPlaceholder: "مثال: محمد العتيبي",
    iban: "رقم الحساب البنكي (IBAN)",
    qrImage: "صورة رمز QR البنكي",
    deleteAria: "حذف",
    uploadImage: "رفع صورة",
    wishlistToggle: "قائمة الأمنيات",
    wishlistDescription: "شارك قائمة بالهدايا التي تتمناها",
    addItem: "إضافة عنصر",
    emptyWishlist: "لم تتم إضافة أمنيات بعد",
    itemLabel: "أمنية",
    deleteImageAria: "حذف الصورة",
    image: "صورة",
    giftName: "اسم الهدية",
    giftNamePlaceholder: "مثال: خلاط كهربائي",
    link: "رابط (استشهادي)",
  },
  en: {
    hint: "Turn this on so guests can send a gift via bank transfer or browse your wishlist.",
    enableGifts: "Enable gifts",
    enableGiftsDescription: "Guests can send a gift or browse the wishlist",
    guestMessage: "Message for guests",
    guestMessagePlaceholder: "e.g. Your generous gift means so much to us 🎁",
    bankTransferToggle: "Bank transfer / cash",
    bankTransferDescription: "Share a bank account or QR code for receiving gifts",
    accountHolderName: "Account holder name",
    accountHolderPlaceholder: "e.g. Mohammed Al Otaibi",
    iban: "Bank account number (IBAN)",
    qrImage: "Bank QR code image",
    deleteAria: "Delete",
    uploadImage: "Upload image",
    wishlistToggle: "Wishlist",
    wishlistDescription: "Share a list of gifts you'd love to receive",
    addItem: "Add item",
    emptyWishlist: "No wishes added yet",
    itemLabel: "Wish",
    deleteImageAria: "Delete image",
    image: "Image",
    giftName: "Gift name",
    giftNamePlaceholder: "e.g. Electric mixer",
    link: "Link (optional)",
  },
};

export function Step14Gift({
  value,
  onChange,
}: {
  value: InvitationDetail;
  onChange: (patch: Partial<InvitationDetail>) => void;
}) {
  const { language } = useLanguage();
  const t = COPY[language];
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
      <HintBox>{t.hint}</HintBox>

      <ToggleField
        label={t.enableGifts}
        description={t.enableGiftsDescription}
        checked={value.enableGifts}
        onChange={(enableGifts) =>
          onChange(
            enableGifts
              ? { enableGifts, giftFeeCoverage: true }
              : {
                  enableGifts,
                  giftFeeCoverage: false,
                  giftMessage: null,
                  giftBankTransferEnabled: false,
                  giftAccountHolderName: null,
                  giftIban: null,
                  giftQrImageUrl: null,
                  giftWishlistEnabled: false,
                  giftWishlistItems: [],
                }
          )
        }
      />

      {value.enableGifts && (
        <>
          <TextareaField
            label={t.guestMessage}
            value={value.giftMessage ?? ""}
            placeholder={t.guestMessagePlaceholder}
            rows={3}
            onChange={(giftMessage) => onChange({ giftMessage })}
          />

          {/* Bank transfer / cash */}
          <div className="space-y-4 border-t border-border pt-4">
            <ToggleField
              label={t.bankTransferToggle}
              description={t.bankTransferDescription}
              checked={Boolean(value.giftBankTransferEnabled)}
              onChange={(giftBankTransferEnabled) =>
                onChange(
                  giftBankTransferEnabled
                    ? { giftBankTransferEnabled }
                    : {
                        giftBankTransferEnabled,
                        giftAccountHolderName: null,
                        giftIban: null,
                        giftQrImageUrl: null,
                      }
                )
              }
            />

            {value.giftBankTransferEnabled && (
              <div className="space-y-3">
                <TextField
                  label={t.accountHolderName}
                  value={value.giftAccountHolderName ?? ""}
                  placeholder={t.accountHolderPlaceholder}
                  onChange={(giftAccountHolderName) => onChange({ giftAccountHolderName })}
                />
                <TextField
                  label={t.iban}
                  value={value.giftIban ?? ""}
                  placeholder="SA00 0000 0000 0000 0000 0000"
                  onChange={(giftIban) => onChange({ giftIban })}
                />

                <div>
                  <label className="mb-1.5 block text-sm text-body-foreground">{t.qrImage}</label>
                  <input
                    ref={qrInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleQrSelected}
                  />
                  {value.giftQrImageUrl ? (
                    <div className="relative w-28">
                      <div className="aspect-square overflow-hidden rounded-xl border border-border bg-background/5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={value.giftQrImageUrl} alt="" className="size-full object-cover" />
                      </div>
                      <button
                        type="button"
                        onClick={() => onChange({ giftQrImageUrl: null })}
                        aria-label={t.deleteAria}
                        className="absolute -top-2 -end-2 flex size-5 items-center justify-center rounded-full bg-background text-muted-foreground shadow transition-colors hover:text-rose-700 dark:text-rose-400"
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
                      <span className="text-xs font-medium">{t.uploadImage}</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Wishlist */}
          <div className="space-y-4 border-t border-border pt-4">
            <ToggleField
              label={t.wishlistToggle}
              description={t.wishlistDescription}
              checked={Boolean(value.giftWishlistEnabled)}
              onChange={(giftWishlistEnabled) =>
                onChange(giftWishlistEnabled ? { giftWishlistEnabled } : { giftWishlistEnabled, giftWishlistItems: [] })
              }
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
                  addLabel={t.addItem}
                  emptyLabel={t.emptyWishlist}
                  itemLabel={t.itemLabel}
                  renderItem={(item, update) => (
                    <div className="flex gap-3">
                      <div className="shrink-0">
                        {item.imageUrl ? (
                          <div className="relative size-16">
                            <div className="size-full overflow-hidden rounded-lg border border-border bg-background/5">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={item.imageUrl} alt="" className="size-full object-cover" />
                            </div>
                            <button
                              type="button"
                              onClick={() => update({ imageUrl: "" })}
                              aria-label={t.deleteImageAria}
                              className="absolute -top-1.5 -end-1.5 flex size-4 items-center justify-center rounded-full bg-background text-muted-foreground shadow transition-colors hover:text-rose-700 dark:text-rose-400"
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
                            <span className="text-[10px]">{t.image}</span>
                          </button>
                        )}
                      </div>

                      <div className="min-w-0 flex-1 space-y-2">
                        <TextField
                          label={t.giftName}
                          required
                          value={item.name}
                          placeholder={t.giftNamePlaceholder}
                          onChange={(name) => update({ name })}
                        />
                        <TextField
                          label={t.link}
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
