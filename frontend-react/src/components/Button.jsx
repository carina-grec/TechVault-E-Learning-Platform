import React from 'react';
import { cn } from '../lib/cn.js';

const variants = {
  primary:
    'bg-primary text-white border-2 border-onyx shadow-hard hover:-translate-y-0.5 hover:shadow-hard-hover active:translate-y-0 active:shadow-hard',
  secondary:
    'bg-white text-onyx border-2 border-onyx shadow-hard hover:-translate-y-0.5 hover:shadow-hard-hover active:translate-y-0 active:shadow-hard',
  ghost: 'text-onyx hover:bg-black/5 dark:text-white dark:hover:bg-white/10',
  accent:
    'bg-accentLime text-onyx border-2 border-onyx shadow-hard hover:-translate-y-0.5 hover:shadow-hard-hover active:translate-y-0 active:shadow-hard',
  dark: 'bg-onyx text-white border-2 border-white shadow-hard hover:-translate-y-0.5 hover:shadow-hard-hover active:translate-y-0 active:shadow-hard',
  success:
    'bg-accentLime text-onyx border-2 border-onyx shadow-hard hover:-translate-y-0.5 hover:shadow-hard-hover active:translate-y-0 active:shadow-hard',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export function Button({ as: Tag = 'button', variant = 'primary', size = 'md', className, children, ...props }) {
  return (
    <Tag
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-bold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
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
