"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { CurrencyCode, CurrencyOption } from "@/types/numinds";

interface PricingCurrencyOption extends CurrencyOption {
  name: string;
  accentGradient: string;
}

const CURRENCY_OPTIONS: PricingCurrencyOption[] = [
  {
    code: "SAR",
    flag: "🇸🇦",
    price: 69.99,
    name: "Saudi Riyal",
    accentGradient: "from-[#006C35] to-[#00A651]",
  },
  {
    code: "USD",
    flag: "🇺🇸",
    price: 19.99,
    name: "US Dollar",
    accentGradient: "from-[#3C3B6E] to-[#5A5898]",
  },
  {
    code: "GBP",
    flag: "🇬🇧",
    price: 14.99,
    name: "British Pound",
    accentGradient: "from-[#012169] to-[#1A3E9A]",
  },
];

export function PricingSection() {
  const [selectedCode, setSelectedCode] = useState<CurrencyCode>("SAR");

  const selected =
    CURRENCY_OPTIONS.find((option) => option.code === selectedCode) ??
    CURRENCY_OPTIONS[0];

  return (
    <section className="py-28 bg-white relative overflow-hidden">
      <div className="absolute rounded-full blur-3xl opacity-5 w-[600px] h-[600px] top-0 right-0 bg-[#C8A24A]" />
      <div className="absolute rounded-full blur-3xl opacity-5 w-[500px] h-[500px] bottom-0 left-0 bg-[#C8A24A]" />

      <div className="max-w-3xl mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <p className="text-sm text-[#C8A24A] font-medium tracking-widest uppercase mb-3">
            أسعار بسيطة
          </p>
          <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            دعوة واحدة،
            <br />
            سعر واحد
          </h2>
          <p className="text-gray-600">
            اختر عملتك المفضلة. كل خطة تشمل تجربة الدعوة الكاملة مع جميع
            الميزات الفاخرة.
          </p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#C8A24A] to-[#A68832] rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-300" />

          <div className="relative bg-white rounded-2xl p-8 md:p-12 border border-gray-100">
            <div
              className={cn(
                "h-1 w-12 rounded-full bg-gradient-to-r mb-6 mx-auto",
                selected.accentGradient
              )}
            />

            <div className="space-y-6 flex flex-col items-center text-center">
              <p className="text-sm text-gray-500">
                {selected.flag} {selected.name}
              </p>
              <div className="flex items-end gap-2">
                <span className="text-gradient-gold text-6xl font-bold">
                  {selected.price}
                </span>
                <span className="text-lg text-gray-400">{selected.code}</span>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-6" />

            <button
              type="button"
              className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-[#C8A24A] to-[#A68832] text-white font-medium transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
            >
              View Pricing
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-3 text-center mt-10">
          اختر العملة
        </p>
        <div className="flex items-center justify-center gap-2">
          {CURRENCY_OPTIONS.map((option) => (
            <button
              key={option.code}
              type="button"
              onClick={() => setSelectedCode(option.code)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 border",
                option.code === selectedCode
                  ? "bg-[#C8A24A] text-white border-transparent"
                  : "bg-white text-gray-600 border-gray-200"
              )}
            >
              <span>{option.flag}</span>
              <span>{option.code}</span>
            </button>
          ))}
        </div>

        <p className="text-xs text-gray-400 text-center mt-4">
          🔄 فقط اختر GBP بجانب السعر وسيتحول تلقائياً إلى عملتك المحلية.
        </p>
      </div>
    </section>
  );
}
