import React from 'react';
import { cn } from '../lib/cn.js';

export function ProgressBar({ value = 0, label, className }) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && <div className="flex items-center justify-between text-sm text-mutedSilver"><span>{label}</span><span className="font-semibold text-onyx dark:text-softGold">{value}%</span></div>}
      <div className="h-6 w-full rounded-full border-2 border-onyx bg-stone/20 p-1 dark:border-mutedSilver dark:bg-onyx">
        <div className="h-full rounded-full bg-accentLime transition-all" style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }} />
      </div>
    </div>
  );
}

export default ProgressBar;
