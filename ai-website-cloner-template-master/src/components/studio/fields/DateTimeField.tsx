export function DateTimeField({
  label,
  required,
  value,
  onChange,
  type = "datetime-local",
}: {
  label?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  // "time" renders a bare HH:MM picker — used for a range's end time, where
  // the date is implied to match the start rather than picked separately.
  type?: "datetime-local" | "time";
}) {
  return (
    <div>
      {label && (
        <label className="mb-1.5 block text-sm text-body-foreground">
          {label}
          {required && <span className="text-rose-500"> *</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-border bg-background/5 px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors [color-scheme:dark] focus:border-gold"
      />
    </div>
  );
}
