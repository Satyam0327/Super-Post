import React from 'react';
import { SEO } from '../components/SEO';
import { Link } from 'react-router';
import { CheckCircle2, Zap } from 'lucide-react';

export function Pricing() {
  return (
    <>
      <SEO title="Pricing | Super-Post" description="Simple, transparent pricing for AI content repurposing. Start free and scale as you grow." />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-24 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-slate-900 dark:text-white mb-6 tracking-tight">Simple, transparent pricing</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">Start for free, upgrade when you need more power.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Tier */}
          <div className="bg-white dark:bg-slate-900 rounded-[32px] p-10 md:p-12 shadow-sm border border-slate-200/50 dark:border-slate-800/50">
            <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-3">Free Plan</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 text-lg">Perfect for trying out the platform.</p>
            <div className="mb-10">
              <span className="text-6xl font-serif font-bold text-slate-900 dark:text-white">$0</span>
              <span className="text-slate-500 dark:text-slate-400 font-medium text-lg">/month</span>
            </div>
            <ul className="space-y-5 mb-10">
              <li className="flex gap-4">
                <CheckCircle2 className="h-6 w-6 text-slate-900 dark:text-white shrink-0" />
                <span className="text-slate-700 dark:text-slate-300">5 AI generation jobs per month</span>
              </li>
              <li className="flex gap-4">
                <CheckCircle2 className="h-6 w-6 text-slate-900 dark:text-white shrink-0" />
                <span className="text-slate-700 dark:text-slate-300">All output formats (LinkedIn, X, etc.)</span>
              </li>
              <li className="flex gap-4 opacity-50">
                <CheckCircle2 className="h-6 w-6 text-slate-400 shrink-0" />
                <span className="text-slate-500 dark:text-slate-400">Ad-supported experience</span>
              </li>
              <li className="flex gap-4 opacity-50">
                <CheckCircle2 className="h-6 w-6 text-slate-400 shrink-0" />
                <span className="text-slate-500 dark:text-slate-400">Standard processing speed</span>
              </li>
            </ul>
            <Link
              to="/signup"
              className="block w-full text-center bg-transparent text-slate-900 dark:text-white border-2 border-slate-900 dark:border-white px-8 py-5 rounded-2xl font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
            >
              Start Free
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="bg-slate-900 dark:bg-white rounded-[32px] p-10 md:p-12 shadow-xl border border-slate-800 dark:border-slate-200 relative transform md:-translate-y-4">
            <div className="absolute top-0 right-10 transform -translate-y-1/2 bg-amber-400 text-amber-950 px-5 py-1.5 rounded-full text-sm font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-sm">
              <Zap className="h-4 w-4" /> Most Popular
            </div>
            <h2 className="text-3xl font-serif font-bold text-white dark:text-slate-900 mb-3">Pro Plan</h2>
            <p className="text-slate-400 dark:text-slate-600 mb-8 text-lg">For creators and businesses growing their reach.</p>
            <div className="mb-10">
              <span className="text-6xl font-serif font-bold text-white dark:text-slate-900">₹499</span>
              <span className="text-slate-400 dark:text-slate-500 font-medium text-lg">/month</span>
            </div>
            <ul className="space-y-5 mb-10">
              <li className="flex gap-4">
                <CheckCircle2 className="h-6 w-6 text-white dark:text-slate-900 shrink-0" />
                <span className="text-white dark:text-slate-900 font-medium">Unlimited AI generation jobs</span>
              </li>
              <li className="flex gap-4">
                <CheckCircle2 className="h-6 w-6 text-white dark:text-slate-900 shrink-0" />
                <span className="text-white dark:text-slate-900 font-medium">All output formats included</span>
              </li>
              <li className="flex gap-4">
                <CheckCircle2 className="h-6 w-6 text-white dark:text-slate-900 shrink-0" />
                <span className="text-white dark:text-slate-900 font-medium">100% Ad-free experience</span>
              </li>
              <li className="flex gap-4">
                <CheckCircle2 className="h-6 w-6 text-white dark:text-slate-900 shrink-0" />
                <span className="text-white dark:text-slate-900 font-medium">Priority AI processing speed</span>
              </li>
            </ul>
            <button className="block w-full text-center bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-8 py-5 rounded-2xl font-bold text-lg hover:opacity-90 transition-opacity shadow-lg">
              Upgrade to Pro
            </button>
          </div>
        </div>
      </div>
    </div>
      </>
  );
}
