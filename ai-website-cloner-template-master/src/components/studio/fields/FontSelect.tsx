export const FONT_OPTIONS = [
  { value: "font-cinzel", label: "Cinzel (كلاسيكي)" },
  { value: "font-serif", label: "Serif" },
  { value: "font-sans", label: "Sans" },
  { value: "italic font-serif", label: "مائل" },
];

export function FontSelect({
  label,
  value,
  onChange,
}: {
  label?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      {label && <label className="mb-1.5 block text-sm text-gray-700">{label}</label>}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-gold"
      >
        <option value="">اختر خطاً</option>
        {FONT_OPTIONS.map((font) => (
          <option key={font.value} value={font.value}>
            {font.label}
          </option>
        ))}
      </select>
    </div>
  );
}
