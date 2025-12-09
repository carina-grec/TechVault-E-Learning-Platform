import React from 'react';
import { cn } from '../lib/cn.js';

const variants = {
  neutral: 'bg-stone text-charcoal border border-onyx/20',
  success: 'bg-accentLime text-charcoal border border-onyx/30',
  info: 'bg-accentBlue text-charcoal border border-onyx/20',
  warning: 'bg-softGold text-charcoal border border-onyx/20',
  accent: 'bg-accentLime text-charcoal border border-onyx/20',
  dark: 'bg-charcoal text-softGold border border-onyx',
};

export function Badge({ variant = 'neutral', children, className }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide', variants[variant], className)}>
      {children}
    </span>
  );
}

export default Badge;
