interface TimerProps {
  remainingSeconds: number;
}

export default function Timer({ remainingSeconds }: TimerProps) {
  const clamped = Math.max(0, remainingSeconds);
  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;
  const isLow = clamped <= 300; // 5分切ったら警告色

  return (
    <div
      className={`rounded-lg border px-3 py-1.5 font-mono text-sm font-bold tabular-nums ${
        isLow ? 'border-rose-300 bg-rose-50 text-rose-700' : 'border-slate-300 bg-white text-slate-700'
      }`}
    >
      残り {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  );
}
