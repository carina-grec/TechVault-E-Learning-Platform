import React from 'react';
import { cn } from '../lib/cn.js';

export function ProgressBar({ value = 0, label, className }) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && <div className="flex items-center justify-between text-sm text-mutedSilver"><span>{label}</span><span className="font-semibold text-onyx dark:text-softGold">{value}%</span></div>}
      <div className="h-3 w-full rounded-full border border-onyx/20 bg-stone/50 dark:border-mutedSilver/30 dark:bg-onyx">
        <div className="h-full rounded-full bg-accentRose transition-all" style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }} />
      </div>
    </div>
  );
}

export default ProgressBar;
