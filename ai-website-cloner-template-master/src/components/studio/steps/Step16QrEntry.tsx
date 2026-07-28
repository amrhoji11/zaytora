import { ToggleField } from "@/components/studio/fields/ToggleField";
import { TextField } from "@/components/studio/fields/TextField";
import { CalendarIcon, ClockIcon, WhatsAppIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import type { InvitationDetail } from "@/types/studio";

// This template ships no live payment/FX integration, so the QR entry
// pricing below is a transparent, deterministic estimate (not a real quote)
// derived from a flat per-guest SAR rate plus static conversion factors —
// swap in the real pricing service's numbers in production.
const SAR_PER_GUEST = 2;
const SAR_FLAT_DISCOUNT = 2;
const GBP_PER_SAR = 0.2;
const USD_PER_SAR = 0.225;

function money(value: number) {
  return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function Step16QrEntry({
  value,
  onChange,
}: {
  value: InvitationDetail;
  onChange: (patch: Partial<InvitationDetail>) => void;
}) {
  const guestCount = value.qrGuestCount ?? 50;
  const totalSar = Math.max(0, guestCount * SAR_PER_GUEST - SAR_FLAT_DISCOUNT);
  const totalGbp = totalSar * GBP_PER_SAR;
  const totalUsd = totalSar * USD_PER_SAR;
  const scannerCount = value.qrScannerCount ?? 1;

  return (
    <div className="space-y-5">
      <ToggleField
        label="دخول الضيوف عبر رمز QR"
        description="نظام تسجيل دخول ذكي لحدثك"
        checked={value.enableQrEntry}
        onChange={(enableQrEntry) => onChange({ enableQrEntry })}
      />

      {value.enableQrEntry && (
        <>
          {/* Guest count & pricing */}
          <div className="space-y-1.5">
            <TextField
              label="عدد الضيوف"
              type="number"
              value={String(guestCount)}
              onChange={(text) => onChange({ qrGuestCount: Math.max(1, Number(text) || 0) })}
            />
            <p className="text-xs text-gray-400">تلميح: أدخل العدد المتوقع من الضيوف (مثال: 50 أو أكثر).</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl border border-gold/30 bg-gold/5 p-3 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">SAR</p>
              <p className="mt-1 text-xs text-gray-500">ريال {money(SAR_PER_GUEST)}/guest</p>
              <p className="text-sm font-semibold text-gold">SAR {money(totalSar)}</p>
            </div>
            <div className="rounded-xl border border-gray-200 p-3 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">GBP</p>
              <p className="mt-4 text-sm font-semibold text-gray-900">£{money(totalGbp)}</p>
            </div>
            <div className="rounded-xl border border-gray-200 p-3 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">USD</p>
              <p className="mt-4 text-sm font-semibold text-gray-900">${money(totalUsd)}</p>
            </div>
          </div>

          {/* Confirmation info alert */}
          <div className="flex items-start gap-2 rounded-xl border border-sky-100 bg-sky-50 px-3.5 py-3">
            <WhatsAppIcon className="mt-0.5 size-4 shrink-0 text-sky-500" />
            <p className="text-sm text-sky-700">سيتم تأكيد كل ضيف برمز QR الشخصي مباشرة عبر رسالة واتساب.</p>
          </div>

          {/* Scanner setup */}
          <div className="space-y-2 border-t border-gray-100 pt-4">
            <p className="text-sm font-medium text-gray-900">إعداد الماسح</p>
            <p className="text-xs text-gray-500">
              أدخل عدد الموظفين الذين سيتولون تسجيل دخول الضيوف. عدد الماسحين (الحد الأقصى 4)
            </p>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => onChange({ qrScannerCount: count })}
                  className={cn(
                    "rounded-xl border-2 py-2.5 text-sm font-medium transition-colors",
                    scannerCount === count
                      ? "border-gold bg-gold/10 text-gold"
                      : "border-gray-200 text-gray-600 hover:border-gold/40"
                  )}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          {/* Scan window */}
          <div className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-4">
            <div>
              <label className="mb-1.5 block text-sm text-gray-700">بداية المسح</label>
              <div className="relative">
                <CalendarIcon className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="datetime-local"
                  value={value.qrScanStart ?? ""}
                  onChange={(event) => onChange({ qrScanStart: event.target.value })}
                  className="w-full rounded-xl border border-gray-200 py-2.5 ps-9 pe-3 text-sm text-gray-900 outline-none transition-colors focus:border-gold"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-gray-700">نهاية المسح</label>
              <div className="relative">
                <ClockIcon className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="datetime-local"
                  value={value.qrScanEnd ?? ""}
                  onChange={(event) => onChange({ qrScanEnd: event.target.value })}
                  className="w-full rounded-xl border border-gray-200 py-2.5 ps-9 pe-3 text-sm text-gray-900 outline-none transition-colors focus:border-gold"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
