import type { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, noPadding = false, onClick }: CardProps) {
  return (
    <div 
      className={clsx(
        "bg-surface rounded-2xl shadow-card border border-slate-100",
        !noPadding && "p-5",
        onClick && "cursor-pointer transition-transform active:scale-[0.98]",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
