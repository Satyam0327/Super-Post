import React from 'react';
import { Outlet } from 'react-router';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

export function Layout() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-50">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
