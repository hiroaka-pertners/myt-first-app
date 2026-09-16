interface ProgressBarProps {
  value: number; // 0-1
  colorClassName?: string;
}

export default function ProgressBar({ value, colorClassName = 'bg-blue-600' }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
      <div
        className={`h-full rounded-full transition-all duration-500 ${colorClassName}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
