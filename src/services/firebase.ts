import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';

// Public Web Firebase Configuration as defined in project
export const firebaseConfig = {
  apiKey: "AIzaSyDs1FIj48kFUFldi0n-t5SsLd_mvsCWMZc",
  authDomain: "narmada-prahari-india.firebaseapp.com",
  projectId: "narmada-prahari-india",
  storageBucket: "narmada-prahari-india.firebasestorage.app",
  messagingSenderId: "465153037413",
  appId: "1:465153037413:web:821ad95ddcb7eac4d7628c",
  measurementId: "G-DYTK6XQ113"
};

// Initialize or reuse Firebase App instance safely
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
