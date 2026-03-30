import clsx from 'clsx';

interface ProgressBarProps {
  value: number; // 0 to 1
  label?: string;
  colorClass?: string;
  className?: string;
}

export function ProgressBar({ value, label, colorClass = "bg-primary", className }: ProgressBarProps) {
  const percentage = Math.min(Math.max(value, 0), 1) * 100;
  
  return (
    <div className={clsx("w-full", className)}>
      {label && (
        <div className="flex justify-between mb-1.5">
          <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">{label}</span>
          <span className="text-[10px] font-bold text-primary">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={clsx("h-full rounded-full transition-all duration-500 ease-out", colorClass)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
