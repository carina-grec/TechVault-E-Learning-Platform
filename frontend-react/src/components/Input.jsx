import React from 'react';
import { cn } from '../lib/cn.js';

export function Input({ label, helper, className, id, type = 'text', ...props }) {
  return (
    <label className="flex w-full flex-col gap-2" htmlFor={id}>
      {label && <span className="text-sm font-semibold text-onyx dark:text-softGold">{label}</span>}
      <input
        id={id}
        type={type}
        className={cn(
          'w-full rounded-lg border border-onyx/20 bg-white px-4 py-3 text-base text-onyx shadow-soft outline-none transition focus:border-deepViolet focus:ring-2 focus:ring-deepViolet focus:ring-offset-2 dark:border-mutedSilver/30 dark:bg-onyx dark:text-mutedSilver',
          className,
        )}
        {...props}
      />
      {helper && <p className="text-xs text-mutedSilver">{helper}</p>}
    </label>
  );
}

export default Input;
