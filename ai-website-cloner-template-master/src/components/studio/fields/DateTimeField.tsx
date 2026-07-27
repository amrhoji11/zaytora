export function DateTimeField({
  label,
  required,
  value,
  onChange,
}: {
  label?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
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
        type="datetime-local"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-gold"
      />
    </div>
  );
}
