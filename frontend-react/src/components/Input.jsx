import React from 'react';
import { cn } from '../lib/cn.js';

export function Input({ label, helper, className, id, type = 'text', ...props }) {
  return (
    <label className="flex w-full flex-col gap-2" htmlFor={id}>
      {label && <span className="text-base font-bold text-onyx dark:text-white">{label}</span>}
      <input
        id={id}
        type={type}
        className={cn(
          'w-full rounded-lg border-2 border-onyx bg-white px-4 py-3 text-base text-onyx shadow-hard outline-none transition-all focus:translate-x-[-2px] focus:translate-y-[-2px] focus:shadow-hard-hover focus:ring-0 dark:border-white dark:bg-background-dark dark:text-white',
          className,
        )}
        {...props}
      />
      {helper && <p className="text-xs text-mutedSilver">{helper}</p>}
    </label>
  );
}

export default Input;
