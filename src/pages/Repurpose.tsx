import React, { useState, useEffect } from 'react';
import { SEO } from '../components/SEO';
import { useNavigate } from 'react-router';
import ReactGA from 'react-ga4';
import { Youtube, FileAudio, AlignLeft, Sparkles, AlertCircle } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, updateDoc, collection, addDoc } from 'firebase/firestore';

export function Repurpose() {
  const [activeTab, setActiveTab] = useState<'url' | 'file' | 'text'>('text');
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState('Blog Post');
  const [brandVoice, setBrandVoice] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthChecking(false);
    });
    return () => unsubscribe();
  }, []);


  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      setError('File size must be under 100MB.');
      return;
    }

    if (file.type.startsWith('text/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setContent(text);
        setError('');
      };
      reader.onerror = () => {
        setError('Failed to read the file.');
      };
      reader.readAsText(file);
    } else {
      setError('Only text files are supported for now.');
    }
  };

  const handleRepurpose = async () => {
    if (!content.trim()) {
      setError('Please provide content to repurpose.');
      return;
    }
    setError('');
    
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      setProgress('Checking usage limits...');
      
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
      
      if (userData?.plan === 'free' && userData.jobsUsed >= 3) {
        throw new Error('You have reached your limit of 3 free jobs this month. Please upgrade to Pro.');
      }

      setProgress('Analyzing content with Super-Post');
      
      // Call our backend API
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, contentType, brandVoice })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate content. Please try again.');
      }

      const generatedData = await response.json();
      setProgress('Saving results...');

      // Save to Firestore
      const jobRef = await addDoc(collection(db, 'jobs'), {
        userId: user.uid,
        title: content.substring(0, 40) + '...',
        contentType,
        originalContent: content,
        results: generatedData,
        createdAt: new Date().toISOString()
      });

      // Update usage
      if (userData) {
        await updateDoc(userRef, {
          jobsUsed: userData.jobsUsed + 1
        });
      }

      ReactGA.event({ category: 'Job', action: 'Created Job', label: contentType });
      navigate(`/results/${jobRef.id}`);
      
    } catch (err: any) {
      setError(err.message || 'An error occurred during processing.');
      setLoading(false);
      setProgress('');
    }
  };

  return (
    <>
      <SEO title="Create New Job | Super-Post" description="Paste your video URL or text content to generate 30+ optimized social media posts using AI." />
      <div className="min-h-[80vh] bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white mb-4 tracking-tight">Super-Post Content</h1>
          <p className="text-lg text-slate-500 dark:text-slate-400">Paste your content below and let AI create 30+ posts for you.</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-xl flex items-start gap-3">
            <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-sm border border-slate-200/50 dark:border-slate-800/50 p-8 md:p-12 mb-8">
          {/* Tabs */}
          <div className="flex flex-col sm:flex-row gap-2 bg-slate-50 dark:bg-slate-950 p-2 rounded-2xl w-full sm:w-fit mb-10 mx-auto border border-slate-100 dark:border-slate-800">
            <button
              className={`px-4 sm:px-8 py-3 flex-1 rounded-xl text-sm font-bold flex justify-center items-center gap-2 transition-all ${activeTab === 'url' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'}`}
              onClick={() => setActiveTab('url')}
            >
              <Youtube className="h-4 w-4 shrink-0" />
              <span>YouTube URL</span>
            </button>
            <button
              className={`px-4 sm:px-8 py-3 flex-1 rounded-xl text-sm font-bold flex justify-center items-center gap-2 transition-all ${activeTab === 'file' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'}`}
              onClick={() => setActiveTab('file')}
            >
              <FileAudio className="h-4 w-4 shrink-0" />
              <span>Upload File</span>
            </button>
            <button
              className={`px-4 sm:px-8 py-3 flex-1 rounded-xl text-sm font-bold flex justify-center items-center gap-2 transition-all ${activeTab === 'text' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'}`}
              onClick={() => setActiveTab('text')}
            >
              <AlignLeft className="h-4 w-4 shrink-0" />
              <span>Paste Text</span>
            </button>
          </div>

          <div>
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Content Type</label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="block w-full px-4 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-white appearance-none focus:outline-none focus:ring-4 focus:ring-slate-900/5 dark:focus:ring-white/10 focus:border-slate-900 dark:focus:border-white transition-all"
              >
                <option>Blog Post</option>
                <option>YouTube Video Transcript</option>
                <option>Podcast Transcript</option>
                <option>Newsletter</option>
                <option>Other</option>
              </select>
            </div>

            {activeTab === 'text' && (
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Source Content</label>
                <textarea
                  rows={8}
                  className="block w-full px-4 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-slate-900/5 dark:focus:ring-white/10 focus:border-slate-900 dark:focus:border-white transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  placeholder="Paste your article, blog post, or transcript here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                ></textarea>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 text-right">{content.length} characters</p>
              </div>
            )}

            {activeTab === 'url' && (
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">YouTube URL</label>
                <input
                  type="url"
                  className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-slate-900/5 dark:focus:ring-white/10 focus:border-slate-900 dark:focus:border-white transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  Note: The video's closed captions (transcript) will be automatically fetched. If transcripts are disabled by the creator, we will do our best to generate posts based on the video's title and description using Google Search.
                </p>
              </div>
            )}

            {activeTab === 'file' && (
              <label className="block border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-[24px] bg-slate-50 dark:bg-slate-950 p-12 text-center hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer relative">
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="text/*"
                  onChange={handleFileUpload}
                />
                <FileAudio className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500 mb-4" />
                <p className="text-slate-600 dark:text-slate-300 font-bold mb-1">Click to upload or drag and drop</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Upload TXT file to extract content</p>
                {content && <p className="mt-4 text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800 p-3 rounded-lg max-w-sm mx-auto font-medium break-all border border-slate-200 dark:border-slate-700">File loaded. Content length: {content.length} chars</p>}
              </label>
            )}

            <div className="mt-8">
              <div className="flex items-center gap-2 mb-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Brand Voice Learning</label>
                <span className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 text-[10px] px-2 py-0.5 rounded-full font-bold">Premium ✨</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Paste 3-5 of your past posts. Our AI will analyze your unique style, tone, and vocabulary so your generated content sounds exactly like you.</p>
              <textarea
                rows={4}
                className="block w-full px-4 py-4 bg-amber-50/30 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/50 rounded-2xl text-slate-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-amber-500/10 dark:focus:ring-amber-500/20 focus:border-amber-500 dark:focus:border-amber-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                placeholder="Paste your previous highly-engaging posts here (Optional)..."
                value={brandVoice}
                onChange={(e) => setBrandVoice(e.target.value)}
              ></textarea>
            </div>
            
            <div className="mt-10 pt-10 border-t border-slate-100 dark:border-slate-800">
              
            {loading ? (
              <div className="w-full flex flex-col items-center justify-center py-8">
                <div className="w-20 h-20 bg-slate-900 dark:bg-white rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-slate-200 dark:shadow-slate-900 animate-bounce">
                  <span className="text-white dark:text-slate-900 font-serif font-bold text-5xl">S</span>
                </div>
                <div className="w-full max-w-sm mx-auto">
                  <div className="flex items-center justify-center mb-4">
                    <span className="text-xl font-serif font-bold text-slate-800 dark:text-slate-200">
                      Super-Post at work...
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden relative mb-4">
                    <div className="bg-slate-900 dark:bg-white h-full rounded-full absolute top-0 left-0 progress-shimmer" style={{ width: '100%', backgroundSize: '200% 100%' }}></div>
                  </div>
                  <div className="text-center text-sm font-medium text-slate-600 dark:text-slate-400">
                    {progress}
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={handleRepurpose}
                disabled={loading || authChecking}
                className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Sparkles className="h-5 w-5" />
                Super-Post Now
              </button>
            )}

            </div>
          </div>
        </div>
        
        {/* Ad Placeholder */}
        <div className="mt-12 max-w-[728px] mx-auto bg-slate-100 dark:bg-slate-900 rounded border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center p-4">
          <span className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">Advertisement</span>
          <div className="text-slate-500 dark:text-slate-400 font-medium text-center">AdSense Banner (Responsive)</div>
        </div>
      </div>
    </div>
      </>
  );
}
