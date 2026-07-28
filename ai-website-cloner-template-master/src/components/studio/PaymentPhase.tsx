"use client";

import { useEffect, useState } from "react";
import { CardIcon, CheckIcon, ChevronLeftIcon, InfoIcon, LockIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { DEFAULT_RATES, loadCurrencyRates, type CurrencyCode, type CurrencyRates } from "@/lib/currencyRates";
import type { InvitationDetail } from "@/types/studio";

// This template has no live billing integration, so the base SAR prices
// below are a transparent, deterministic placeholder quote (not a real
// catalog price) — wire in the real pricing/Stripe session in production.
// The QR-entry line reuses the same per-guest formula as Step16QrEntry so
// the two stay consistent with each other.
const BASE_PACKAGE_PRICE_SAR = 149;
const QR_SAR_PER_GUEST = 2;
const QR_SAR_FLAT_DISCOUNT = 2;
const GIFT_FEE_RATE = 0.05;

const INCLUDED_FEATURES = ["رابط مشاركة عام", "توليد رمز QR", "جمع الردود", "صورة ستوري لوسائل التواصل"];

// Symbols/labels only — the actual conversion multipliers come from
// currencyRates (live API, 24h cached, falling back to DEFAULT_RATES),
// loaded on mount below. ILS is included alongside the rest for
// Palestinian guests.
const CURRENCY_META: Record<CurrencyCode, { symbol: string; label: string }> = {
  USD: { symbol: "$", label: "USD - دولار أمريكي" },
  EUR: { symbol: "€", label: "EUR - يورو" },
  GBP: { symbol: "£", label: "GBP - جنيه إسترليني" },
  SAR: { symbol: "ريال", label: "SAR - ريال سعودي" },
  ILS: { symbol: "₪", label: "ILS - شيكل إسرائيلي" },
};

const LOCAL_PAYMENT_OPTIONS = ["Jawwal Pay", "Reflect", "تحويل بنكي محلي"];

export function PaymentPhase({ value, onBack }: { value: InvitationDetail; onBack: () => void }) {
  const [currency, setCurrency] = useState<CurrencyCode>("SAR");
  const [rates, setRates] = useState<CurrencyRates>(DEFAULT_RATES);
  const [partnerCode, setPartnerCode] = useState("");
  const [checkingCode, setCheckingCode] = useState(false);
  const [codeResult, setCodeResult] = useState<"valid" | "invalid" | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadCurrencyRates().then((loaded) => {
      if (!cancelled) setRates(loaded);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const guestCount = value.qrGuestCount ?? 50;
  const qrPriceSar = value.enableQrEntry ? Math.max(0, guestCount * QR_SAR_PER_GUEST - QR_SAR_FLAT_DISCOUNT) : 0;
  const giftFeeSar = value.enableGifts && value.giftFeeCoverage ? BASE_PACKAGE_PRICE_SAR * GIFT_FEE_RATE : 0;
  const totalSar = BASE_PACKAGE_PRICE_SAR + qrPriceSar + giftFeeSar;

  const { symbol } = CURRENCY_META[currency];
  const rate = rates[currency];
  function fmt(sar: number) {
    return (sar * rate).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function checkPartnerCode() {
    if (!partnerCode.trim()) return;
    setCheckingCode(true);
    setCodeResult(null);
    // No real partner-code service wired up yet — this just simulates a
    // lookup so the "Check" interaction has visible feedback.
    setTimeout(() => {
      setCheckingCode(false);
      setCodeResult("invalid");
    }, 700);
  }

  return (
    <div>
      {/* Full-width header banner */}
      <div className="flex items-center gap-3 rounded-t-2xl bg-gradient-to-l from-gold to-[#E4C878] px-6 py-5 text-white">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/20">
          <CardIcon className="size-5" />
        </span>
        <div>
          <p className="text-base font-semibold">دعوة مميزة</p>
          <p className="text-xs text-white/85">افتح جميع المميزات لدعوتك</p>
        </div>
      </div>

      <div className="space-y-5 px-6 py-6">
        {/* Included features */}
        <ul className="space-y-1.5">
          {INCLUDED_FEATURES.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm text-gray-700">
              <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckIcon className="size-2.5" />
              </span>
              {feature}
            </li>
          ))}
        </ul>

        {/* Partner code */}
        <div>
          <label className="mb-1.5 block text-sm text-gray-700">كود الشريك (اختياري)</label>
          <div className="flex gap-2">
            <input
              value={partnerCode}
              onChange={(event) => {
                setPartnerCode(event.target.value);
                setCodeResult(null);
              }}
              placeholder="مثال: PARTNER10"
              className="flex-1 rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-gold"
            />
            <button
              type="button"
              onClick={checkPartnerCode}
              disabled={checkingCode || !partnerCode.trim()}
              className="rounded-xl border border-gold/40 px-4 text-sm font-medium text-gold transition-colors hover:bg-gold/5 disabled:opacity-40"
            >
              {checkingCode ? "..." : "تحقق"}
            </button>
          </div>
          {codeResult === "invalid" && <p className="mt-1 text-xs text-rose-500">الكود غير صالح</p>}
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="h-px flex-1 bg-gray-200" />
          أو ادفع بالبطاقة
          <span className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Currency */}
        <div>
          <label className="mb-1.5 block text-sm text-gray-700">العملة</label>
          <select
            value={currency}
            onChange={(event) => setCurrency(event.target.value as CurrencyCode)}
            className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-gold"
          >
            {(Object.keys(CURRENCY_META) as CurrencyCode[]).map((code) => (
              <option key={code} value={code}>
                {CURRENCY_META[code].label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-start gap-2 rounded-xl border border-sky-100 bg-sky-50 px-3.5 py-3">
          <InfoIcon className="mt-0.5 size-4 shrink-0 text-sky-500" />
          <p className="text-xs leading-relaxed text-sky-700">
            الأسعار محسوبة بالريال السعودي وتُحوَّل تلقائياً إلى العملة المختارة عند إتمام الدفع، وقد يطبّق مزوّد
            الدفع سعر صرف مختلف قليلاً.
          </p>
        </div>

        {/* Breakdown */}
        <div className="space-y-2 rounded-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">دعوة مميزة</span>
            <span dir="ltr" className="text-gray-900">
              {symbol} {fmt(BASE_PACKAGE_PRICE_SAR)}
            </span>
          </div>
          {value.enableQrEntry && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">دخول الضيوف عبر QR</span>
              <span dir="ltr" className="text-gray-900">
                {symbol} {fmt(qrPriceSar)}
              </span>
            </div>
          )}
          {giftFeeSar > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">رسم قسم الهدايا</span>
              <span dir="ltr" className="text-gray-900">
                {symbol} {fmt(giftFeeSar)}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between border-t border-gray-100 pt-2 text-sm font-semibold">
            <span className="uppercase tracking-wide text-gray-900">الإجمالي</span>
            <span dir="ltr" className="text-gold">
              {symbol} {fmt(totalSar)}
            </span>
          </div>
        </div>

        {/* Primary pay button — Stripe purple/blue */}
        <button
          type="button"
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-xl bg-[#635BFF] py-3 text-sm font-medium text-white transition-colors hover:bg-[#524ae0]"
          )}
        >
          ادفع الآن — {symbol} {fmt(totalSar)}
        </button>
        <p className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <LockIcon className="size-3.5" />
          دفع آمن عبر Stripe
        </p>

        {/* Local payment fallback for ILS */}
        {currency === "ILS" && (
          <div className="space-y-2 border-t border-gray-100 pt-4">
            <p className="text-xs font-medium text-gray-500">أو ادفع عبر طرق محلية</p>
            <div className="flex flex-wrap gap-2">
              {LOCAL_PAYMENT_OPTIONS.map((option) => (
                <span
                  key={option}
                  className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  {option}
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onBack}
          className="flex w-full items-center justify-center gap-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
        >
          <ChevronLeftIcon className="size-4" />
          العودة للتصميم
        </button>
      </div>
    </div>
  );
}
