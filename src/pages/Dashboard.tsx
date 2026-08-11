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

  const jobsLimit = 3;
  const jobsUsed = userData?.jobsUsed || 0;
  const isFreePlan = userData?.plan === 'free';

  return (
    <div className="min-h-[80vh] bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Welcome back, {user?.displayName || 'Creator'}</p>
          </div>
          <Link
            to="/repurpose"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-sm flex items-center gap-2"
          >
            <PlusCircle className="h-5 w-5" />
            New Super-Post Job
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[24px] shadow-sm border border-slate-200 dark:border-slate-800">
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-bold mb-4">Usage This Month</h3>
            <div className="flex items-end gap-2 mb-4">
              <span className="text-4xl font-bold text-slate-900 dark:text-white">{jobsUsed}</span>
              <span className="text-slate-500 dark:text-slate-400 text-lg mb-1">/ {isFreePlan ? jobsLimit : '∞'} jobs</span>
            </div>
            {isFreePlan && (
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all" 
                  style={{ width: `${Math.min((jobsUsed / jobsLimit) * 100, 100)}%` }}
                ></div>
              </div>
            )}
          </div>

          {isFreePlan && (
            <div className="md:col-span-2 bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-[24px] shadow-sm text-white flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-300 fill-yellow-300" />
                  Upgrade to Pro
                </h3>
                <p className="text-blue-100 max-w-md">
                  Get unlimited jobs, no ads, and priority processing. Perfect for serious creators.
                </p>
              </div>
              <Link
                to="/pricing"
                className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity shrink-0"
              >
                Upgrade Now
              </Link>
            </div>
          )}
        </div>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Recent Jobs</h2>
        {jobs.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-12 rounded-[24px] shadow-sm border border-slate-200 dark:border-slate-800 text-center">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-950 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No jobs yet</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
              You haven't repurposed any content yet. Start your first job to see the magic happen.
            </p>
            <Link
              to="/repurpose"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity inline-flex items-center gap-2"
            >
              Start Repurposing
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-[24px] shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <ul className="divide-y divide-slate-100">
              {jobs.map((job) => (
                <li key={job.id} className="p-6 hover:bg-slate-50 dark:bg-slate-950 transition-colors flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">{job.title || 'Untitled Content'}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                      <span className="capitalize">{job.contentType}</span>
                      <span>•</span>
                      <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/results/${job.id}`}
                      className="text-blue-600 font-medium hover:text-blue-800 flex items-center gap-1"
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
