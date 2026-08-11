import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAyhW8ZTTA33NfW52D3TOABGAPjdgfm7Z4",
  authDomain: "superpost-ec5b8.firebaseapp.com",
  projectId: "superpost-ec5b8",
  storageBucket: "superpost-ec5b8.firebasestorage.app",
  messagingSenderId: "326507440936",
  appId: "1:326507440936:web:e4efc5c240a2d9abe2fe1d",
  measurementId: "G-CB0KFRNWD1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };
