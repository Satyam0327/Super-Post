import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { SEO } from '../components/SEO';
import { CheckCircle2, ArrowRight, Zap, Youtube, FileText, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';


const XLogo = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

export function Home() {
  const [user, setUser] = useState<User | null>(null);


    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How does AI content repurposing work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our AI content repurposing tool analyzes your original video, transcript, or blog post using advanced Gemini language models. It extracts the core concepts and automatically generates optimized posts for platforms like LinkedIn, X (Twitter), and Instagram while maintaining your unique voice."
          }
        },
        {
          "@type": "Question",
          "name": "What platforms do you support?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We currently support generating content for X (Twitter) threads, LinkedIn professional posts, Instagram captions with emojis and hashtags, SEO-friendly blog summaries, and engaging email newsletters. We are constantly adding new platform formats."
          }
        },
        {
          "@type": "Question",
          "name": "Why should I repurpose my content?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Repurposing content maximizes your reach without requiring you to create net-new ideas. By transforming a single YouTube video or podcast into 30+ social media posts, you maintain a consistent posting schedule, reach different audience segments, and improve your overall SEO footprint."
          }
        }
      ]
    };

    const softwareSchema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "RepurposeAI",
      "operatingSystem": "Web",
      "applicationCategory": "BusinessApplication",
      "description": "AI-powered content repurposing for creators, marketers, and small businesses.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>

      <SEO 
        title="RepurposeAI | Turn 1 Video into 30 Social Posts using AI"
        description="Our AI content repurposing tool turns your videos and podcasts into LinkedIn posts, X threads, and Instagram captions. Maximize your reach in minutes."
        schema={[faqSchema, softwareSchema]}
      />
      {/* Hero Section */}
      <section className="bg-slate-50 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8">
            Turn 1 Video into <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">30 Social Posts</span> in 2 Minutes
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            AI-powered content repurposing for creators, marketers, and small businesses. Maximize your reach without the extra work.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to={user ? "/dashboard" : "/signup"}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
            >
              {user ? 'Go to Dashboard' : 'Start Repurposing Free'} <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/pricing"
              className="bg-white text-slate-800 border border-slate-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-colors shadow-sm flex items-center justify-center"
            >
              View Pricing
            </Link>
          </div>
          <p className="mt-6 text-sm text-slate-500 font-medium">No credit card required. Free tier available.</p>
        </div>
      </section>

      {/* Output Formats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Generate Content For Every Platform</h2>
            <p className="text-lg text-slate-600">One input, optimized outputs for all your social channels.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:border-blue-200 transition-colors">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Linkedin className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">LinkedIn Posts</h3>
              <p className="text-slate-600 mb-4">Professional, insightful posts with strong hooks designed for B2B engagement.</p>
              <span className="text-blue-600 font-medium text-sm bg-blue-50 px-3 py-1 rounded-full">5 Posts Generated</span>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:border-blue-200 transition-colors">
              <div className="w-12 h-12 bg-slate-200 rounded-xl flex items-center justify-center mb-6">
                <XLogo className="h-6 w-6 text-black" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">X (Twitter) Threads</h3>
              <p className="text-slate-600 mb-4">Punchy, conversational posts formatted into engaging threads.</p>
              <span className="text-blue-600 font-medium text-sm bg-blue-50 px-3 py-1 rounded-full">10 Posts Generated</span>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:border-blue-200 transition-colors">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-6">
                <Instagram className="h-6 w-6 text-pink-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Instagram Captions</h3>
              <p className="text-slate-600 mb-4">Casual, emoji-rich captions optimized for visual platforms with hashtags.</p>
              <span className="text-blue-600 font-medium text-sm bg-blue-50 px-3 py-1 rounded-full">3 Captions Generated</span>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:border-blue-200 transition-colors">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <FileText className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Blog Summaries</h3>
              <p className="text-slate-600 mb-4">SEO-friendly articles summarizing the core concepts with clear headings.</p>
              <span className="text-blue-600 font-medium text-sm bg-blue-50 px-3 py-1 rounded-full">1 Article Generated</span>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:border-blue-200 transition-colors">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Mail className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Email Newsletters</h3>
              <p className="text-slate-600 mb-4">Personal, engaging snippets perfect for your mailing list updates.</p>
              <span className="text-blue-600 font-medium text-sm bg-blue-50 px-3 py-1 rounded-full">1 Email Generated</span>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:border-blue-200 transition-colors flex flex-col justify-center items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Zap className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Powered by Gemini</h3>
              <p className="text-slate-600">Advanced AI reasoning ensures your core message isn't lost in translation.</p>
            </div>
          </div>
        </div>
      </section>

      
      {/* FAQ Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-slate-600">Everything you need to know about our AI content repurposing.</p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-3">How does AI content repurposing work?</h3>
              <p className="text-slate-600">
                Our AI content repurposing tool analyzes your original video, transcript, or blog post using advanced Gemini language models. It extracts the core concepts and automatically generates optimized posts for platforms like LinkedIn, X (Twitter), and Instagram while maintaining your unique voice.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-3">What platforms do you support?</h3>
              <p className="text-slate-600">
                We currently support generating content for X (Twitter) threads, LinkedIn professional posts, Instagram captions with emojis and hashtags, SEO-friendly blog summaries, and engaging email newsletters. We are constantly adding new platform formats.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Why should I repurpose my content?</h3>
              <p className="text-slate-600">
                Repurposing content maximizes your reach without requiring you to create net-new ideas. By transforming a single YouTube video or podcast into 30+ social media posts, you maintain a consistent posting schedule, reach different audience segments, and improve your overall SEO footprint.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Stop wasting hours on social media copy</h2>
          <p className="text-xl text-slate-300 mb-10">Join thousands of creators working smarter, not harder.</p>
          <Link
            to={user ? "/dashboard" : "/signup"}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-purple-900/50 inline-block"
          >
            {user ? 'Go to Dashboard' : 'Create Your Free Account'}
          </Link>
        </div>
      </section>
    </div>
  );
}
