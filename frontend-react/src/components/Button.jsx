import React from 'react';
import { cn } from '../lib/cn.js';

const variants = {
  primary:
    'bg-sand text-charcoal border border-onyx/30 shadow-soft hover:-translate-y-0.5 hover:shadow-depth active:translate-y-0',
  secondary:
    'bg-white text-onyx border border-onyx/30 shadow-soft hover:bg-sand/40 hover:shadow-depth',
  ghost: 'text-onyx hover:bg-sand/40 dark:text-mutedSilver dark:hover:bg-onyx',
  accent:
    'bg-accentRose text-charcoal border border-onyx/40 shadow-soft hover:shadow-depth',
  dark: 'bg-charcoal text-softGold border border-onyx shadow-soft hover:shadow-depth',
  success:
    'bg-accentLime text-charcoal border border-onyx/30 shadow-soft hover:shadow-depth',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-3 text-base',
};

export function Button({ as: Tag = 'button', variant = 'primary', size = 'md', className, children, ...props }) {
  return (
    <Tag
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-deepViolet focus-visible:ring-offset-2 dark:focus-visible:ring-softGold',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

export default Button;
