import type { ChangeEvent } from 'react';
import clsx from 'clsx';

interface SliderInputProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (val: number) => void;
  className?: string;
}

export function SliderInput({ label, value, min = 1, max = 10, onChange, className }: SliderInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  return (
    <div className={clsx("w-full", className)}>
      <div className="flex justify-between items-center mb-3">
        <label className="text-sm font-semibold text-primary">{label}</label>
        <span className="text-sm font-bold text-primary bg-slate-100 px-2.5 py-1 rounded-md">
          {value} / {max}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
      />
    </div>
  );
}
