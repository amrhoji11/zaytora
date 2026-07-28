import { useState } from "react";
import { ToggleField } from "@/components/studio/fields/ToggleField";
import { HintBox } from "@/components/studio/fields/HintBox";
import { PlusIcon, XIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import type { InvitationDetail } from "@/types/studio";

const DELIMITER = " · ";

const PRESET_RULES = [
  "ممنوع الأطفال",
  "ممنوع التصوير",
  "يرجى الحضور في الوقت المحدد",
  "درجة اللباس: رسمي",
  "بدون مرافقين إضافيين",
  "يرجى إيقاف الهواتف أثناء الحفل",
];

function parseRules(text?: string | null) {
  return (text ?? "")
    .split(DELIMITER)
    .map((rule) => rule.trim())
    .filter(Boolean);
}

export function Step08Rules({
  value,
  onChange,
}: {
  value: InvitationDetail;
  onChange: (patch: Partial<InvitationDetail>) => void;
}) {
  const [customRule, setCustomRule] = useState("");
  const selectedRules = parseRules(value.eventRulesText);
  const customRules = selectedRules.filter((rule) => !PRESET_RULES.includes(rule));

  function toggleRule(rule: string) {
    const next = selectedRules.includes(rule)
      ? selectedRules.filter((item) => item !== rule)
      : [...selectedRules, rule];
    onChange({ eventRulesText: next.join(DELIMITER) });
  }

  function addCustomRule() {
    const rule = customRule.trim();
    if (!rule || selectedRules.includes(rule)) return;
    onChange({ eventRulesText: [...selectedRules, rule].join(DELIMITER) });
    setCustomRule("");
  }

  return (
    <div className="space-y-5">
      <HintBox>مثال: ممنوع الأطفال · ممنوع التصوير · يرجى الحضور في الوقت المحدد</HintBox>

      <ToggleField
        label="تفعيل قواعد الحدث"
        description="عرض القواعد في الدعوة"
        checked={value.showEventRules}
        onChange={(showEventRules) => onChange({ showEventRules })}
      />

      {value.showEventRules && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {PRESET_RULES.map((rule) => {
              const selected = selectedRules.includes(rule);
              return (
                <button
                  key={rule}
                  type="button"
                  onClick={() => toggleRule(rule)}
                  className={cn(
                    "rounded-full border-2 px-3.5 py-1.5 text-sm font-medium transition-all",
                    selected
                      ? "border-gold bg-gold/10 text-gold"
                      : "border-gray-200 text-gray-600 hover:border-gold/40"
                  )}
                >
                  {rule}
                </button>
              );
            })}
          </div>

          {customRules.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {customRules.map((rule) => (
                <span
                  key={rule}
                  className="flex items-center gap-1.5 rounded-full border-2 border-gold bg-gold/10 px-3.5 py-1.5 text-sm font-medium text-gold"
                >
                  {rule}
                  <button type="button" onClick={() => toggleRule(rule)} aria-label="حذف">
                    <XIcon className="size-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={customRule}
              onChange={(event) => setCustomRule(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addCustomRule();
                }
              }}
              placeholder="قاعدة أخرى..."
              className="flex-1 rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-gold"
            />
            <button
              type="button"
              onClick={addCustomRule}
              className="flex items-center gap-1 rounded-xl border border-dashed border-gold/40 px-4 text-sm font-medium text-gold transition-colors hover:bg-gold/5"
            >
              <PlusIcon className="size-4" />
              إضافة
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
