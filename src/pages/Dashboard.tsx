import React, { useEffect, useState } from 'react';
import { SEO } from '../components/SEO';
import { Link, useNavigate } from 'react-router';
import { collection, query, where, getDocs, doc, getDoc, orderBy } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { PlusCircle, FileText, ArrowRight, Zap, Trash2 } from 'lucide-react';
import { User } from 'firebase/auth';

interface Job {
  id: string;
  title: string;
  contentType: string;
  createdAt: string;
  preview: string;
}

interface UserData {
  plan: string;
  jobsUsed: number;
}

export function Dashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUserData(currentUser);
        fetchJobs(currentUser);
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchUserData = async (user: User) => {
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data() as UserData);
      }
    } catch (error) {
      console.error("Error fetching user data", error);
    }
  };

  const fetchJobs = async (user: User) => {
    try {
      const q = query(
        collection(db, 'jobs'),
        where('userId', '==', user.uid)
      );
      const querySnapshot = await getDocs(q);
      const fetchedJobs: Job[] = [];
      querySnapshot.forEach((doc) => {
        fetchedJobs.push({ id: doc.id, ...doc.data() } as Job);
      });
      fetchedJobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setJobs(fetchedJobs);
    } catch (error) {
      console.error("Error fetching jobs", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
    <>
      <SEO title="Dashboard | Super-Post" description="View your content repurposing history and manage your generated posts." />
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
        </>
  );
}

  const jobsLimit = 5;
  const jobsUsed = userData?.jobsUsed || 0;
  const isFreePlan = !userData || userData.plan !== 'pro';

  return (
    <div className="min-h-[80vh] bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h1 className="text-4xl font-serif font-bold text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Welcome back, {user?.displayName || 'Creator'}</p>
          </div>
          <Link
            to="/repurpose"
            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity shadow-sm flex items-center gap-2"
          >
            <PlusCircle className="h-5 w-5" />
            New Job
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[24px] shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider">Account Status</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${isFreePlan ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                  {isFreePlan ? 'FREE PLAN' : 'PRO PLAN'}
                </span>
              </div>
              
              <div className="mb-8">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Total Content Processed</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-serif font-bold text-slate-900 dark:text-white leading-none">{jobsUsed}</span>
                  <span className="text-slate-500 dark:text-slate-400 text-lg">jobs</span>
                </div>
              </div>
            </div>

            <div className="w-full">
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">
                <span>{isFreePlan ? 'Monthly Capacity' : 'Unlimited Processing'}</span>
                <span>{isFreePlan ? `${jobsUsed} / ${jobsLimit}` : 'Active'}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${isFreePlan ? 'bg-slate-900 dark:bg-white' : 'bg-amber-400 relative overflow-hidden'}`}
                  style={{ width: isFreePlan ? `${Math.min((jobsUsed / jobsLimit) * 100, 100)}%` : '100%' }}
                >
                  {!isFreePlan && (
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent progress-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {isFreePlan && (
            <div className="md:col-span-2 bg-slate-900 dark:bg-slate-50 p-8 rounded-[24px] shadow-sm text-white dark:text-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-serif font-bold mb-2 flex items-center gap-2">
                  <Zap className="h-6 w-6 text-amber-400 fill-amber-400" />
                  Upgrade to Pro
                </h3>
                <p className="text-slate-300 dark:text-slate-600 max-w-md text-lg">
                  Get unlimited jobs, no ads, and priority processing. Perfect for serious creators.
                </p>
              </div>
              <Link
                to="/pricing"
                className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-8 py-4 rounded-xl font-bold hover:opacity-90 transition-opacity shrink-0 w-full sm:w-auto text-center"
              >
                Upgrade Now
              </Link>
            </div>
          )}
        </div>

        <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-6">Recent Jobs</h2>
        {jobs.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-16 rounded-[24px] shadow-sm border border-slate-200 dark:border-slate-800 text-center">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-950 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="h-10 w-10 text-slate-300 dark:text-slate-600" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-3">No jobs yet</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto text-lg">
              You haven't repurposed any content yet. Start your first job to see the magic happen.
            </p>
            <Link
              to="/repurpose"
              className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-xl font-medium hover:opacity-90 transition-opacity inline-flex items-center gap-2"
            >
              Start Repurposing
            </Link>
          </div>
        ) : (
                  <div className="bg-white dark:bg-slate-900 rounded-[24px] shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <ul className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {jobs.map((job) => (
                <li key={job.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">{job.title || 'Untitled Content'}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                      <span className="capitalize">{job.contentType}</span>
                      <span>•</span>
                      <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/results/${job.id}`}
                      className="text-slate-900 dark:text-white font-medium hover:opacity-70 flex items-center gap-1"
                    >
                      View Results <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
