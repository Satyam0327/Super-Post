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
        body: JSON.stringify({ content, contentType })
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
      <div className="min-h-[80vh] bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Super-Post Content</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">Paste your content below and let AI create 30+ posts for you.</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-xl flex items-start gap-3">
            <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-sm border border-slate-200 dark:border-slate-800 p-8 mb-8">
          {/* Tabs */}
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit mb-8 mx-auto">
            <button
              className={`px-6 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${activeTab === 'url' ? 'bg-white dark:bg-slate-900 shadow-sm text-blue-600' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300'}`}
              onClick={() => setActiveTab('url')}
            >
              <Youtube className="h-4 w-4" />
              YouTube URL
            </button>
            <button
              className={`px-6 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${activeTab === 'file' ? 'bg-white dark:bg-slate-900 shadow-sm text-blue-600' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300'}`}
              onClick={() => setActiveTab('file')}
            >
              <FileAudio className="h-4 w-4" />
              Upload File
            </button>
            <button
              className={`px-6 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${activeTab === 'text' ? 'bg-white dark:bg-slate-900 shadow-sm text-blue-600' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300'}`}
              onClick={() => setActiveTab('text')}
            >
              <AlignLeft className="h-4 w-4" />
              Paste Text
            </button>
          </div>

          <div>
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Content Type</label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="block w-full px-4 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-slate-200 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
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
                  className="block w-full px-4 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
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
                  className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <p className="mt-3 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                  Note: The video's closed captions (transcript) will be automatically fetched. If transcripts are disabled by the creator, we will do our best to generate posts based on the video's title and description using Google Search.
                </p>
              </div>
            )}

            {activeTab === 'file' && (
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-[24px] bg-slate-50 dark:bg-slate-950 p-12 text-center hover:bg-slate-100 dark:bg-slate-800 transition-colors cursor-pointer">
                <FileAudio className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                <p className="text-slate-600 dark:text-slate-400 font-bold mb-1">Click to upload or drag and drop</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm">MP3, MP4, or TXT up to 100MB</p>
                <p className="mt-4 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg max-w-sm mx-auto">
                  Note: File processing is simulated in this demo. Use the "Paste Text" tab for real results.
                </p>
              </div>
            )}
            
            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
              
            {loading ? (
              <div className="w-full flex flex-col items-center justify-center py-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-[20px] flex items-center justify-center mb-6 shadow-xl shadow-blue-500/20 animate-bounce">
                  <span className="text-white font-bold text-5xl">S</span>
                </div>
                <div className="w-full max-w-sm mx-auto">
                  <div className="flex items-center justify-center mb-4">
                    <span className="text-lg font-bold text-slate-800 dark:text-slate-200">
                      Super-Post at work...
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden relative mb-3">
                    <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 h-2 rounded-full absolute top-0 left-0 progress-shimmer" style={{ width: '100%', backgroundSize: '200% 100%' }}></div>
                  </div>
                  <div className="text-center text-sm font-semibold text-blue-600">
                    {progress}
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={handleRepurpose}
                disabled={loading || authChecking}
                className="w-full py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Sparkles className="h-5 w-5" />
                Super-Post Now
              </button>
            )}

            </div>
          </div>
        </div>
        
        {/* Ad Placeholder */}
        <div className="mt-12 max-w-[728px] h-[90px] mx-auto bg-slate-100 dark:bg-slate-800 rounded border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center">
          <span className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">Advertisement</span>
          <div className="text-slate-500 dark:text-slate-400 font-medium">AdSense Banner (728x90)</div>
        </div>
      </div>
    </div>
      </>
  );
}
