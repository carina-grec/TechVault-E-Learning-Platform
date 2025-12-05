import React from 'react';
import { cn } from '../lib/cn.js';

export function Section({ title, description, actions, children, className }) {
  return (
    <section className={cn('space-y-4', className)}>
      {(title || description || actions) && (
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-1">
            {title && <h2 className="font-display text-2xl font-semibold text-onyx dark:text-softGold">{title}</h2>}
            {description && <p className="text-sm text-mutedSilver max-w-3xl">{description}</p>}
          </div>
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}

export default Section;
