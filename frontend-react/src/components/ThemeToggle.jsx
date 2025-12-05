import React from 'react';
import { useTheme } from '../hooks/useTheme.js';
import { Button } from './Button.jsx';
import { cn } from '../lib/cn.js';

export function ThemeToggle({ className }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={toggleTheme}
      className={cn('border border-onyx/30 dark:border-mutedSilver/40', className)}
      aria-label="Toggle dark mode"
    >
      {theme === 'dark' ? 'Light' : 'Dark'}
    </Button>
  );
}

export default ThemeToggle;
