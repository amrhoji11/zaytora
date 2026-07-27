export function TextField({
  label,
  required,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      {label && (
        <label className="mb-1.5 block text-sm text-gray-700">
          {label}
          {required && <span className="text-rose-500"> *</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-gold"
      />
    </div>
  );
}
