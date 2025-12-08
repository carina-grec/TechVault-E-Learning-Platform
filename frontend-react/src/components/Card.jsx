import React from 'react';
import { cn } from '../lib/cn.js';

export function Card({ as: Tag = 'div', className, children, padding = 'p-6', title, action, subtitle, ...props }) {
  return (
    <Tag className={cn('neo-card', padding, className)} {...props}>
      {(title || subtitle || action) && (
        <header className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && <h3 className="font-display text-xl font-bold text-onyx dark:text-white">{title}</h3>}
            {subtitle && <p className="text-sm text-mutedSilver">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </Tag>
  );
}

export default Card;
