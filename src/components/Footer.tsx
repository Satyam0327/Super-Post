import React from 'react';
import { Link } from 'react-router';
import { Rocket } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Rocket className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">RepurposeAI</span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">
              Turn your long-form videos, podcasts, and blogs into weeks of high-converting social media content in just a few clicks.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-wider uppercase mb-4">Product</h3>
            <ul className="space-y-3">
              <li><Link to="/pricing" className="text-base text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white">Pricing</Link></li>
              <li><Link to="/features" className="text-base text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white">Features</Link></li>
              <li><Link to="/login" className="text-base text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white">Log In</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-wider uppercase mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-base text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white">Privacy Policy</a></li>
              <li><a href="#" className="text-base text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white">Terms of Service</a></li>
              <li><a href="#" className="text-base text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-8 flex items-center justify-between">
          <p className="text-base text-slate-400">
            &copy; {new Date().getFullYear()} RepurposeAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
