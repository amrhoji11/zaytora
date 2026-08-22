interface DividerProps {
  color: string;
}

export function Divider({ color }: DividerProps) {
  return (
    <div className="my-2 flex items-center justify-center gap-2">
      <div className="h-px w-12" style={{ background: color, opacity: 0.5 }} />
      <div className="h-1.5 w-1.5 rotate-45" style={{ backgroundColor: color, opacity: 0.5 }} />
      <div className="h-px w-12" style={{ background: color, opacity: 0.5 }} />
    </div>
  );
}
