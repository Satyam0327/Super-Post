import React from 'react';
import { SEO } from '../components/SEO';
import { Link } from 'react-router';
import { CheckCircle2, Zap } from 'lucide-react';

export function Pricing() {
  return (
    <>
      <SEO title="Pricing | Super-Post" description="Simple, transparent pricing for AI content repurposing. Start free and scale as you grow." />
      <div className="min-h-screen bg-slate-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Simple, transparent pricing</h1>
          <p className="text-xl text-slate-600">Start for free, upgrade when you need more power.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Tier */}
          <div className="bg-white rounded-[32px] p-10 shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Free Plan</h2>
            <p className="text-slate-500 mb-6">Perfect for trying out the platform.</p>
            <div className="mb-8">
              <span className="text-5xl font-extrabold text-slate-900">$0</span>
              <span className="text-slate-500 font-medium">/month</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0" />
                <span className="text-slate-700">3 AI generation jobs per month</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0" />
                <span className="text-slate-700">All output formats (LinkedIn, Twitter, etc.)</span>
              </li>
              <li className="flex gap-3 opacity-60">
                <CheckCircle2 className="h-6 w-6 text-slate-400 shrink-0" />
                <span className="text-slate-500">Ad-supported experience</span>
              </li>
              <li className="flex gap-3 opacity-60">
                <CheckCircle2 className="h-6 w-6 text-slate-400 shrink-0" />
                <span className="text-slate-500">Standard processing speed</span>
              </li>
            </ul>
            <Link
              to="/signup"
              className="block w-full text-center bg-white text-blue-600 border-2 border-blue-600 px-6 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-colors"
            >
              Start Free
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[32px] p-10 shadow-xl border border-blue-500 relative transform md:-translate-y-4">
            <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-bold tracking-wider uppercase flex items-center gap-1">
              <Zap className="h-4 w-4" /> Most Popular
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Pro Plan</h2>
            <p className="text-blue-100 mb-6">For creators and businesses growing their reach.</p>
            <div className="mb-8">
              <span className="text-5xl font-extrabold text-white">₹499</span>
              <span className="text-blue-200 font-medium">/month</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex gap-3">
                <CheckCircle2 className="h-6 w-6 text-blue-300 shrink-0" />
                <span className="text-white font-medium">Unlimited AI generation jobs</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="h-6 w-6 text-blue-300 shrink-0" />
                <span className="text-white font-medium">All output formats included</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="h-6 w-6 text-blue-300 shrink-0" />
                <span className="text-white font-medium">100% Ad-free experience</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="h-6 w-6 text-blue-300 shrink-0" />
                <span className="text-white font-medium">Priority AI processing speed</span>
              </li>
            </ul>
            <button className="block w-full text-center bg-slate-900 text-white px-6 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity shadow-lg">
              Upgrade to Pro
            </button>
          </div>
        </div>
      </div>
    </div>
      </>
  );
}
