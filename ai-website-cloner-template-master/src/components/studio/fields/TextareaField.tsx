export function TextareaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      {label && <label className="mb-1.5 block text-sm text-gray-700">{label}</label>}
      <textarea
        value={value}
        placeholder={placeholder}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className="w-full resize-none rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-gold"
      />
    </div>
  );
}
