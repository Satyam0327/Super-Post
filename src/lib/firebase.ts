import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "nifty-backbone-r83b3",
  appId: "1:436433591620:web:b744df9d5295f467d5cb11",
  apiKey: "AIzaSyBkYMYLyF9yGH_9rC2JXkmcqBmbiGeCMPg",
  authDomain: "nifty-backbone-r83b3.firebaseapp.com",
  storageBucket: "nifty-backbone-r83b3.firebasestorage.app",
  messagingSenderId: "436433591620"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app, "ai-studio-0524ddbb-7588-4600-be6b-e0c560bde6a9");
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };
