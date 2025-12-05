import React from 'react';
import { cn } from '../lib/cn.js';

export function Card({ as: Tag = 'div', className, children, padding = 'p-5', title, action, subtitle }) {
  return (
    <Tag className={cn('neo-card', padding, className)}>
      {(title || subtitle || action) && (
        <header className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && <h3 className="font-display text-lg font-semibold text-onyx dark:text-softGold">{title}</h3>}
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
