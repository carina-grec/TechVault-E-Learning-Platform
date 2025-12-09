import React from 'react';
import { cn } from '../lib/cn.js';

export function Footer({ className }) {
  return (
    <footer className={cn('border-t border-onyx/10 bg-ivory/80 py-6 dark:border-mutedSilver/20 dark:bg-charcoal/80', className)}>
      <div className="soft-container flex flex-wrap items-center justify-between gap-3 text-sm text-mutedSilver">
        <p>© {new Date().getFullYear()} TechVault Learning. Crafted with care.</p>
      </div>
    </footer>
  );
}

export default Footer;
