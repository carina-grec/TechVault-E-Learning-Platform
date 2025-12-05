import React from 'react';
import { cn } from '../lib/cn.js';

export function Footer({ className }) {
  return (
    <footer className={cn('border-t border-onyx/10 bg-ivory/80 py-6 dark:border-mutedSilver/20 dark:bg-charcoal/80', className)}>
      <div className="soft-container flex flex-wrap items-center justify-between gap-3 text-sm text-mutedSilver">
        <p>© {new Date().getFullYear()} TechVault Learning. Crafted with care.</p>
        <div className="flex items-center gap-4">
          <a href="#design-system" className="hover:text-onyx dark:hover:text-softGold">
            Design system
          </a>
          <a href="#accessibility" className="hover:text-onyx dark:hover:text-softGold">
            Accessibility
          </a>
          <a href="#support" className="hover:text-onyx dark:hover:text-softGold">
            Support
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
