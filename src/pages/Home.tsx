import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { SEO } from '../components/SEO';
import { CheckCircle2, ArrowRight, Zap, Youtube, FileText, X, Instagram, Linkedin, Mail } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';

const XLogo = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

export function Home() {
  const [user, setUser] = useState<User | null>(null);
  const { scrollY } = useScroll();
  
  // Advanced 3D Parallax Effects
  // The hero section tilts back, scales down, and fades out as you scroll down
  const heroRotateX = useTransform(scrollY, [0, 800], [0, 20]);
  const heroScale = useTransform(scrollY, [0, 800], [1, 0.9]);
  const heroY = useTransform(scrollY, [0, 800], [0, 100]);
  const heroOpacity = useTransform(scrollY, [0, 400, 700], [1, 1, 0]); // Stays fully visible much longer

  // Individual element parallax for depth
  const titleY = useTransform(scrollY, [0, 500], [0, 40]);
  const textY = useTransform(scrollY, [0, 500], [0, 60]);
  const buttonsY = useTransform(scrollY, [0, 500], [0, 0]); // Keep buttons completely static relative to container so they don't run away

  // Background Blobs morphing
  const blob1Y = useTransform(scrollY, [0, 800], [0, -200]);
  const blob1Scale = useTransform(scrollY, [0, 800], [1, 1.5]);
  const blob2Y = useTransform(scrollY, [0, 800], [0, -300]);
  const blob2Scale = useTransform(scrollY, [0, 800], [1, 1.2]);

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How does AI content repurposing work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our AI content repurposing tool analyzes your original video, transcript, or blog post using advanced Gemini language models. It extracts the core concepts and automatically generates optimized posts for platforms like LinkedIn, X (X), and Instagram while maintaining your unique voice."
          }
        },
        {
          "@type": "Question",
          "name": "What platforms do you support?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We currently support generating content for X (X) threads, LinkedIn professional posts, Instagram captions with emojis and hashtags, SEO-friendly blog summaries, and engaging email newsletters. We are constantly adding new platform formats."
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
      "name": "Super-Post",
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
        title="Super-Post | Turn 1 Video into 30 Social Posts using AI"
        description="Our AI content repurposing tool turns your videos and podcasts into LinkedIn posts, X threads, and Instagram captions. Maximize your reach in minutes."
        schema={[faqSchema, softwareSchema]}
      />
      {/* Hero Section */}
      <section className="bg-slate-50 dark:bg-slate-950 pt-32 pb-24 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden flex items-center min-h-[70vh]" style={{ perspective: '1200px' }}>
        {/* Parallax Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div 
            className="absolute top-0 left-1/4 w-96 h-96 bg-slate-200/50 dark:bg-slate-800/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-lighten"
            style={{ y: blob1Y, scale: blob1Scale }}
          />
          <motion.div 
            className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-slate-300/30 dark:bg-slate-900/40 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-lighten"
            style={{ y: blob2Y, scale: blob2Scale }}
          />
        </div>

        <motion.div 
          className="max-w-5xl mx-auto text-center relative z-10 w-full"
          style={{ 
            y: heroY, 
            opacity: heroOpacity, 
            scale: heroScale, 
            rotateX: heroRotateX,
            transformStyle: 'preserve-3d'
          }}
        >
          <motion.h1 
            className="text-6xl md:text-8xl font-serif font-bold text-slate-900 dark:text-white tracking-tight mb-8 leading-[1.1]"
            style={{ y: titleY }}
          >
            Turn 1 Video into <span className="text-slate-500 dark:text-slate-400">30 Social Posts</span> in 2 Minutes
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed"
            style={{ y: textY }}
          >
            AI-powered content repurposing for creators, marketers, and small businesses. Maximize your reach without the extra work.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4"
            style={{ y: buttonsY }}
          >
            <Link
              to={user ? "/dashboard" : "/signup"}
              className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-5 rounded-2xl font-bold text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10 dark:shadow-white/10"
            >
              {user ? 'Go to Dashboard' : 'Start Repurposing Free'} <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/pricing"
              className="bg-white/50 dark:bg-slate-950/50 backdrop-blur-md text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-800 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white dark:hover:bg-slate-900 transition-colors flex items-center justify-center"
            >
              View Pricing
            </Link>
          </motion.div>
          
          <motion.p 
            className="mt-8 text-sm text-slate-500 dark:text-slate-400 font-medium"
            style={{ y: buttonsY }}
          >
            No credit card required. Free tier available.
          </motion.p>
        </motion.div>
      </section>

      {/* Output Formats Section (adding relative/z-index to overlap) */}
      <section className="py-24 bg-white dark:bg-slate-900 relative z-20 shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.3)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white mb-4">Generate Content For Every Platform</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">One input, optimized outputs for all your social channels.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-slate-50 dark:bg-slate-950 rounded-[32px] p-10 border border-slate-200/50 dark:border-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700 transition-colors group">
              <div className="w-14 h-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Linkedin className="h-6 w-6 text-slate-900 dark:text-white" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-4">LinkedIn Posts</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">Professional, insightful posts with strong hooks designed for B2B engagement.</p>
              <span className="text-slate-900 dark:text-white font-medium text-sm bg-slate-200/50 dark:bg-slate-800/50 px-4 py-1.5 rounded-full">5 Posts Generated</span>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-950 rounded-[32px] p-10 border border-slate-200/50 dark:border-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700 transition-colors group">
              <div className="w-14 h-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <XLogo className="h-6 w-6 text-slate-900 dark:text-white" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-4">X (Twitter) Threads</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">Punchy, conversational posts formatted into engaging threads.</p>
              <span className="text-slate-900 dark:text-white font-medium text-sm bg-slate-200/50 dark:bg-slate-800/50 px-4 py-1.5 rounded-full">10 Posts Generated</span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 rounded-[32px] p-10 border border-slate-200/50 dark:border-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700 transition-colors group">
              <div className="w-14 h-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Instagram className="h-6 w-6 text-slate-900 dark:text-white" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-4">Instagram Captions</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">Casual, emoji-rich captions optimized for visual platforms with hashtags.</p>
              <span className="text-slate-900 dark:text-white font-medium text-sm bg-slate-200/50 dark:bg-slate-800/50 px-4 py-1.5 rounded-full">3 Captions Generated</span>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-950 rounded-[32px] p-10 border border-slate-200/50 dark:border-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700 transition-colors group">
              <div className="w-14 h-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <FileText className="h-6 w-6 text-slate-900 dark:text-white" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-4">Blog Summaries</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">SEO-friendly articles summarizing the core concepts with clear headings.</p>
              <span className="text-slate-900 dark:text-white font-medium text-sm bg-slate-200/50 dark:bg-slate-800/50 px-4 py-1.5 rounded-full">1 Article Generated</span>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-950 rounded-[32px] p-10 border border-slate-200/50 dark:border-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700 transition-colors group">
              <div className="w-14 h-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Mail className="h-6 w-6 text-slate-900 dark:text-white" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-4">Email Newsletters</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">Personal, engaging snippets perfect for your mailing list updates.</p>
              <span className="text-slate-900 dark:text-white font-medium text-sm bg-slate-200/50 dark:bg-slate-800/50 px-4 py-1.5 rounded-full">1 Email Generated</span>
            </div>
            
            <div className="bg-slate-900 dark:bg-white rounded-[32px] p-10 border border-slate-800 dark:border-slate-200 flex flex-col justify-center items-center text-center">
              <div className="w-20 h-20 bg-white/10 dark:bg-slate-900/10 rounded-full flex items-center justify-center mb-6">
                <Zap className="h-10 w-10 text-white dark:text-slate-900" />
              </div>
              <h3 className="text-3xl font-serif font-bold text-white dark:text-slate-900 mb-3">Powered by Gemini</h3>
              <p className="text-slate-300 dark:text-slate-600 text-lg">Advanced AI reasoning ensures your core message isn't lost in translation.</p>
            </div>
          </div>
        </div>
      </section>

      
      {/* FAQ Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">Everything you need to know about our AI content repurposing.</p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-[32px] p-10 border border-slate-200/50 dark:border-slate-800/50">
              <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-4">How does AI content repurposing work?</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                Our AI content repurposing tool analyzes your original video, transcript, or blog post using advanced Gemini language models. It extracts the core concepts and automatically generates optimized posts for platforms like LinkedIn, X (X), and Instagram while maintaining your unique voice.
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-900 rounded-[32px] p-10 border border-slate-200/50 dark:border-slate-800/50">
              <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-4">What platforms do you support?</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                We currently support generating content for X (X) threads, LinkedIn professional posts, Instagram captions with emojis and hashtags, SEO-friendly blog summaries, and engaging email newsletters. We are constantly adding new platform formats.
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-900 rounded-[32px] p-10 border border-slate-200/50 dark:border-slate-800/50">
              <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-4">Why should I repurpose my content?</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                Repurposing content maximizes your reach without requiring you to create net-new ideas. By transforming a single YouTube video or podcast into 30+ social media posts, you maintain a consistent posting schedule, reach different audience segments, and improve your overall SEO footprint.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-slate-900 dark:bg-white text-white dark:text-slate-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-6xl font-serif font-bold mb-8 tracking-tight">Stop wasting hours on social media copy</h2>
          <p className="text-2xl text-slate-300 dark:text-slate-600 mb-12 font-medium">Join thousands of creators working smarter, not harder.</p>
          <Link
            to={user ? "/dashboard" : "/signup"}
            className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-10 py-5 rounded-2xl font-bold text-xl hover:scale-105 transition-transform inline-block"
          >
            {user ? 'Go to Dashboard' : 'Create Your Free Account'}
          </Link>
        </div>
      </section>
    </div>
  );
}
