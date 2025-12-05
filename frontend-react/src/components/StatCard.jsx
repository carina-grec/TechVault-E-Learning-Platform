import React from 'react';
import { cn } from '../lib/cn.js';
import Badge from './Badge.jsx';

export function StatCard({ label, value, hint, trend, className }) {
  return (
    <div className={cn('neo-card p-5 flex flex-col gap-2', className)}>
      <p className="text-sm font-semibold text-mutedSilver">{label}</p>
      <p className="text-3xl font-display font-bold text-onyx dark:text-softGold">{value}</p>
      {(hint || trend) && (
        <div className="flex items-center gap-2">
          {trend && <Badge variant={trend > 0 ? 'success' : 'warning'}>{trend > 0 ? `+${trend}%` : `${trend}%`}</Badge>}
          {hint && <p className="text-xs text-mutedSilver">{hint}</p>}
        </div>
      )}
    </div>
  );
}

export default StatCard;
