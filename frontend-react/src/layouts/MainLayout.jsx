import React from 'react';
import Sidebar from '../components/Sidebar.jsx';
import Footer from '../components/Footer.jsx';
import { cn } from '../lib/cn.js';

export function MainLayout({ children, fullWidth = false, hideChrome = false }) {
  return (
    <div className="min-h-screen bg-ivory text-onyx dark:bg-charcoal dark:text-mutedSilver transition-colors flex">
      {!hideChrome && <Sidebar />}
      <div className={cn("flex-1 flex flex-col min-h-screen transition-all duration-300", !hideChrome && "lg:ml-64")}>
        <main className={cn(fullWidth ? 'w-full' : 'soft-container', 'flex-1 py-8 md:py-10')}>{children}</main>
        {!hideChrome && <Footer />}
      </div>
    </div>
  );
}

export default MainLayout;
