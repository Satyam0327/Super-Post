import React from 'react';
import { Link } from 'react-router';
import { SEO } from '../components/SEO';
import { Home, ArrowRight } from 'lucide-react';

export function NotFound() {
  return (
    <>
      <SEO 
        title="404: Page Not Found | Super-Post"
        description="The page you are looking for does not exist."
      />
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-9xl font-extrabold text-blue-600 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-slate-900 mb-6">Page Not Found</h2>
        <p className="text-lg text-slate-600 max-w-md mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        <div className="flex gap-4">
          <Link 
            to="/"
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
          >
            <Home className="h-5 w-5" />
            Back to Home
          </Link>
          <Link 
            to="/pricing"
            className="flex items-center gap-2 bg-white text-slate-700 border border-slate-300 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors"
          >
            View Pricing <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </>
  );
}
