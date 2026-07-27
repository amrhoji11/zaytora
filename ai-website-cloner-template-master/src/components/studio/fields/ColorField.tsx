export function ColorField({
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
      <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3.5 py-2">
        <span className="text-sm text-gray-500">{value}</span>
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="size-7 cursor-pointer rounded-md border border-gray-200"
        />
      </div>
    </div>
  );
}
