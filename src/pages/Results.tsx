import React, { useEffect, useState } from 'react';
import { SEO } from '../components/SEO';
import { useParams, Link } from 'react-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Linkedin, Twitter, Instagram, FileText, Mail, Copy, CheckCircle2, ArrowLeft, Zap, ExternalLink, Download, Image as ImageIcon } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import download from 'downloadjs';
import { useRef } from 'react';


const XLogo = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

export function Results() {
  const { id } = useParams();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('linkedin');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'jobs', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setJob(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching job", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!job || !job.results) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Job not found</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">The results you are looking for do not exist or have been deleted.</p>
          <Link to="/dashboard" className="text-blue-600 hover:underline">Return to Dashboard</Link>
        </div>
      </div>
    );
  }

  const { results } = job;

  const downloadAsTxt = () => {
    if (!job || !job.results) return;
    
    let textContent = `=== SUPER-POST RESULTS ===\n\n`;
    textContent += `Original Content Type: ${job.contentType}\n\n`;
    
    textContent += `--- LINKEDIN POSTS ---\n\n`;
    job.results.linkedin_posts.forEach((post: string, i: number) => {
      textContent += `[Post ${i + 1}]\n${post}\n\n`;
    });
    
    textContent += `--- TWITTER THREADS ---\n\n`;
    job.results.twitter_tweets.forEach((tweet: string, i: number) => {
      textContent += `[Tweet ${i + 1}]\n${tweet}\n\n`;
    });
    
    textContent += `--- INSTAGRAM CAPTIONS ---\n\n`;
    job.results.instagram_captions.forEach((cap: string, i: number) => {
      textContent += `[Caption ${i + 1}]\n${cap}\n\n`;
    });
    
    textContent += `--- BLOG SUMMARY ---\n\n`;
    textContent += `${job.results.blog_summary}\n\n`;
    
    textContent += `--- EMAIL NEWSLETTER ---\n\n`;
    textContent += `Subject: ${job.results.email_newsletter.subject}\n`;
    textContent += `${job.results.email_newsletter.body}\n\n`;

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `super-post-${job.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, data: results.linkedin_posts },
    { id: 'twitter', label: 'X', icon: XLogo, data: results.twitter_tweets },
    { id: 'instagram', label: 'Instagram', icon: Instagram, data: results.instagram_captions },
    { id: 'blog', label: 'Blog Summary', icon: FileText, data: [results.blog_summary] },
    { id: 'email', label: 'Email', icon: Mail, data: [results.email_newsletter] },
    { id: 'insights', label: 'Key Insights', icon: CheckCircle2, data: results.key_insights }
  ];

  return (
    <>
      <SEO title="Generated Posts | Super-Post" description="Your AI-generated social media posts are ready to share." />
      <div className="min-h-screen bg-indigo-50 dark:bg-indigo-950/30/30 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <style>{`
        .results-grid-layout {
          display: grid;
          gap: 2rem;
          grid-template-columns: 1fr;
          grid-template-areas:
            "top-ad"
            "main"
            "sidebar"
            "bottom-ad";
        }
        @media (min-width: 1024px) {
          .results-grid-layout {
            grid-template-columns: 3fr 1fr;
            grid-template-areas:
              "top-ad top-ad"
              "main sidebar"
              "bottom-ad sidebar";
          }
        }
      `}</style>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </Link>
          <div className="text-sm text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
            Created: {new Date(job.createdAt).toLocaleDateString()}
          </div>
        </div>
        
        <div className="results-grid-layout">
          {/* Top Banner Ad Area */}
          <div style={{ gridArea: 'top-ad' }} className="w-full h-[90px] bg-indigo-50 dark:bg-indigo-950/30 border border-dashed border-indigo-200 rounded-2xl flex flex-col items-center justify-center">
            <span className="text-[10px] uppercase tracking-widest text-indigo-400 mb-1">Advertisement</span>
            <div className="text-indigo-600 font-medium text-sm">AdSense Top Banner</div>
          </div>

          {/* Main Content Area */}
          <div style={{ gridArea: 'main' }}>
            <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-sm border border-slate-200 dark:border-slate-800 p-8">
              
              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-1 bg-indigo-50 dark:bg-indigo-950/30 p-1 rounded-xl w-full mb-8">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 min-w-[120px] px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 whitespace-nowrap transition-all ${
                        activeTab === tab.id
                          ? 'bg-white dark:bg-slate-900 shadow-sm text-violet-600'
                          : 'text-slate-500 dark:text-slate-400 hover:text-violet-500'
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${activeTab === tab.id ? 'text-violet-600' : 'text-slate-400'}`} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div>
                {activeTab === 'linkedin' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                    {results.linkedin_posts.map((post: string, idx: number) => (
                      <ResultCard key={idx} text={post} index={idx} onCopy={() => copyToClipboard(post, idx)} copied={copiedIndex === idx} platform="linkedin" />
                    ))}
                  </div>
                )}

                {activeTab === 'twitter' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {results.twitter_tweets.map((tweet: string, idx: number) => (
                      <ResultCard key={idx} text={tweet} index={idx} onCopy={() => copyToClipboard(tweet, idx)} copied={copiedIndex === idx} platform="twitter" />
                    ))}
                  </div>
                )}

                {activeTab === 'instagram' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {results.instagram_captions.map((caption: string, idx: number) => (
                      <ResultCard key={idx} text={caption} index={idx} onCopy={() => copyToClipboard(caption, idx)} copied={copiedIndex === idx} platform="instagram" />
                    ))}
                  </div>
                )}

                {activeTab === 'blog' && (
                  <ResultCard text={results.blog_summary} index={0} onCopy={() => copyToClipboard(results.blog_summary, 0)} copied={copiedIndex === 0} platform="blog" />
                )}

                {activeTab === 'email' && (
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="mb-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 block">Subject Line</span>
                      <p className="font-semibold text-slate-900 dark:text-white text-lg">{results.email_newsletter.subject}</p>
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 block">Body</span>
                      <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{results.email_newsletter.body}</p>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() => copyToClipboard(results.email_newsletter.subject + '\n\n' + results.email_newsletter.body, 0)}
                        className="flex items-center gap-1.5 text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors"
                      >
                        {copiedIndex === 0 ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                        {copiedIndex === 0 ? 'Copied!' : 'Copy Full Email'}
                      </button>
                    </div>
                  </div>
                )}
                
                {activeTab === 'insights' && (
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-indigo-100 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Key Insights</h3>
                    <ul className="space-y-4 mb-10">
                      {results.key_insights.map((insight: string, idx: number) => (
                        <li key={idx} className="flex gap-3">
                          <CheckCircle2 className="h-6 w-6 text-fuchsia-500 shrink-0" />
                          <span className="text-slate-700 dark:text-slate-300">{insight}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Actionable Tips</h3>
                    <ul className="space-y-4">
                      {results.actionable_tips.map((tip: string, idx: number) => (
                        <li key={idx} className="flex gap-3">
                          <Zap className="h-6 w-6 text-amber-500 shrink-0" />
                          <span className="text-slate-700 dark:text-slate-300">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Bottom Native Ad */}
          <div style={{ gridArea: 'bottom-ad' }} className="w-full h-[120px] bg-indigo-50 dark:bg-indigo-950/30 border border-dashed border-indigo-200 rounded-2xl flex flex-col items-center justify-center">
            <span className="text-[10px] uppercase tracking-widest text-indigo-400 mb-1">Advertisement</span>
            <div className="text-indigo-600 font-medium">AdSense Bottom Banner</div>
          </div>

          {/* Sidebar Area */}
          <div style={{ gridArea: 'sidebar' }} className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[24px] shadow-sm border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4">Export Options</h3>
              <div className="space-y-3">
                <button onClick={downloadAsTxt} className="w-full bg-violet-600 text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-violet-700 transition-colors flex justify-center items-center gap-2 shadow-sm">
                  <FileText className="h-4 w-4" /> Download as TXT
                </button>
                <Link to="/repurpose" className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-4 py-3 rounded-xl text-sm font-bold hover:bg-slate-50 dark:bg-slate-950 transition-colors flex justify-center items-center gap-2">
                  Create Another Job
                </Link>
              </div>
            </div>
            
            {/* Sidebar Ad */}
            <div className="w-full h-[250px] bg-fuchsia-50 border border-dashed border-fuchsia-200 rounded-[24px] flex flex-col items-center justify-center p-6 text-center">
              <span className="text-[10px] uppercase tracking-widest text-fuchsia-400 mb-2">Advertisement</span>
              <div className="w-full aspect-[4/3] bg-white dark:bg-slate-900 rounded-lg mb-4 flex items-center justify-center border border-fuchsia-100 shadow-sm">
                <div className="text-sm font-bold text-fuchsia-600">AdSense Sidebar</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

function ResultCard({ text, index, onCopy, copied, platform }: { key?: string | number, text: string, index: number, onCopy: () => void, copied: boolean, platform?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (!cardRef.current) return;
    htmlToImage.toPng(cardRef.current, { quality: 0.95, pixelRatio: 2 })
      .then((dataUrl) => {
        download(dataUrl, `${platform || 'post'}-card-${index}.png`);
      })
      .catch((err) => {
        console.error('Oops, something went wrong!', err);
      });
  };

  const getPlatformStyles = () => {
    switch (platform) {
      case 'twitter':
        return 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-l-4 border-black';
      case 'linkedin':
        return 'bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border-t-4 border-[#0A66C2] shadow-md';
      case 'instagram':
        return 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-t-4 border-pink-500 shadow-md';
      case 'blog':
        return 'bg-amber-50 text-slate-800 dark:text-slate-200 border-2 border-amber-200';
      default:
        return 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800';
    }
  };

  const getPlatformIcon = () => {
    switch (platform) {
      case 'twitter':
        return <XLogo className="h-5 w-5 text-black" />;
      case 'linkedin':
        return <Linkedin className="h-5 w-5 text-[#0A66C2]" />;
      case 'instagram':
        return <Instagram className="h-5 w-5 text-pink-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* The captureable card */}
      <div 
        ref={cardRef} 
        className={`rounded-2xl p-6 relative overflow-hidden shadow-sm transition-all ${getPlatformStyles()} flex flex-col justify-between h-full`}
      >
        <div className="absolute top-4 right-4 opacity-70">
          {getPlatformIcon()}
        </div>
        <p className={`whitespace-pre-wrap leading-relaxed text-base pt-6`}>
          {text}
        </p>
        <div className="mt-6 pt-4 border-t border-black/10 flex items-center justify-between opacity-60 text-xs font-medium">
          <span>{new Date().toLocaleDateString()}</span>
          <span>Super-Post</span>
        </div>

      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center justify-end gap-2 px-1">
        <span className="text-xs text-slate-400 font-medium mr-auto mb-2 sm:mb-0 w-full sm:w-auto">{text.length} chars</span>
        
        {(platform === 'twitter' || platform === 'linkedin' || (typeof navigator !== 'undefined' && navigator.share)) && (
          <button
            onClick={() => {
              const encodedText = encodeURIComponent(text);
              if (platform === 'twitter') {
                window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, '_blank');
              } else if (platform === 'linkedin') {
                window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${encodedText}`, '_blank');
              } else if (navigator.share) {
                navigator.share({ title: 'Super-Post Post', text: text }).catch(console.error);
              }
            }}
            className="flex flex-1 sm:flex-none justify-center items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm"
            title="Share to Platform"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="hidden sm:inline text-xs sm:text-sm">Share</span>
          </button>
        )}
        <button
          onClick={handleDownload}
          className="flex flex-1 sm:flex-none justify-center items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm"
          title="Download as Image"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline text-xs sm:text-sm">Save Image</span>
        </button>

        <button
          onClick={onCopy}
          className="flex flex-1 sm:flex-none justify-center items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-violet-600 transition-colors bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
          {copied ? <span className="text-emerald-600 hidden sm:inline text-xs sm:text-sm">Copied!</span> : <span className="hidden sm:inline text-xs sm:text-sm">Copy Text</span>}
        </button>
      </div>
    </div>
  );
}

