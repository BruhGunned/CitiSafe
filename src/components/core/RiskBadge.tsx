import type { RiskLevel } from '../../store/useAppStore';
import clsx from 'clsx';

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
}

export function RiskBadge({ level, className }: RiskBadgeProps) {
  const styles = {
    low: "bg-green-100 text-green-700 border-green-200",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    high: "bg-red-100 text-red-700 border-red-200"
  };

  return (
    <span className={clsx(
      "px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider border",
      styles[level],
      className
    )}>
      {level} RISK
    </span>
  );
}
