"use client";

import { useState } from "react";
import { CheckIcon, ChevronDownIcon, GiftIcon, LinkIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import type { InvitationDetail } from "@/types/studio";

export function GiftModal({ value, isRtl }: { value: InvitationDetail; isRtl: boolean }) {
  const [bankExpanded, setBankExpanded] = useState(false);
  const [purchased, setPurchased] = useState<Set<number>>(new Set());

  const hasBankDetails = Boolean(
    value.giftBankTransferEnabled &&
      (value.giftAccountHolderName || value.giftIban || value.giftQrImageUrl)
  );
  const wishlist = value.giftWishlistEnabled ? (value.giftWishlistItems ?? []).filter((item) => item.name) : [];

  function togglePurchased(index: number) {
    setPurchased((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <div className="space-y-3">
      {value.giftMessage && <p className="text-xs leading-relaxed text-gray-600">{value.giftMessage}</p>}

      {hasBankDetails && (
        <div className="overflow-hidden rounded-xl border border-gold/30 bg-gold/5">
          <button
            type="button"
            onClick={() => setBankExpanded((open) => !open)}
            className="flex w-full items-center justify-between gap-2 px-3 py-2.5"
          >
            <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-800">
              <GiftIcon className="size-3.5 text-gold" />
              {isRtl ? "أرسل هدية عبر التحويل البنكي 🎁" : "Send a gift via bank transfer 🎁"}
            </span>
            <ChevronDownIcon
              className={cn("size-3.5 shrink-0 text-gray-400 transition-transform", bankExpanded && "rotate-180")}
            />
          </button>

          {bankExpanded && (
            <div className="space-y-2 border-t border-gold/20 px-3 pb-3 pt-2">
              {value.giftAccountHolderName && (
                <p className="text-xs font-medium text-gray-800">{value.giftAccountHolderName}</p>
              )}
              {value.giftIban && (
                <p dir="ltr" className="text-xs text-gray-500">
                  {value.giftIban}
                </p>
              )}
              {value.giftQrImageUrl && (
                <div className="mx-auto aspect-square w-24 overflow-hidden rounded-lg border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={value.giftQrImageUrl} alt="" className="size-full object-cover" />
                </div>
              )}
              {value.giftFeeCoverage && (
                <p className="text-[10px] text-gray-400">
                  {isRtl ? "يضيف 5% رسم دفع إضافي" : "Adds a 5% processing fee"}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {wishlist.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-semibold text-gray-700">{isRtl ? "قائمة الأمنيات" : "Wishlist"}</p>
          {wishlist.map((item, index) => {
            const isPurchased = purchased.has(index);
            return (
              <div key={index} className="flex items-center gap-2.5 rounded-xl bg-gray-50 p-2">
                <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.imageUrl} alt="" className="size-full object-cover" />
                  ) : (
                    <span className="text-lg">🎁</span>
                  )}
                </div>
                <p className={cn("min-w-0 flex-1 truncate text-xs text-gray-700", isPurchased && "text-gray-400 line-through")}>
                  {item.name}
                </p>
                {item.link ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex shrink-0 items-center gap-1 rounded-full border border-gold/40 px-2.5 py-1 text-[10px] font-medium text-gold transition-colors hover:bg-gold/10"
                  >
                    <LinkIcon className="size-2.5" />
                    {isRtl ? "شراء" : "Buy"}
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => togglePurchased(index)}
                    className={cn(
                      "flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-medium transition-colors",
                      isPurchased
                        ? "border-gold bg-gold text-white"
                        : "border-gray-200 text-gray-500 hover:border-gold/40 hover:text-gold"
                    )}
                  >
                    <CheckIcon className="size-2.5" />
                    {isRtl ? "اشتريته" : "Got it"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!hasBankDetails && wishlist.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-4 text-center text-gray-400">
          <GiftIcon className="size-6" />
          <p className="text-xs">{isRtl ? "لم تتم إضافة تفاصيل الهدايا بعد" : "No gift details added yet"}</p>
        </div>
      )}
    </div>
  );
}
