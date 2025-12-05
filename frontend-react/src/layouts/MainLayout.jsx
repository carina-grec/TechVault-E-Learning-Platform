import React from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { cn } from '../lib/cn.js';

export function MainLayout({ children, fullWidth = false, hideChrome = false }) {
  return (
    <div className="min-h-screen bg-ivory text-onyx dark:bg-charcoal dark:text-mutedSilver transition-colors">
      {!hideChrome && <Navbar />}
      <main className={cn(fullWidth ? 'w-full' : 'soft-container', 'py-8 md:py-10')}>{children}</main>
      {!hideChrome && <Footer />}
    </div>
  );
}

export default MainLayout;
