// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDs1FIj48kFUFldi0n-t5SsLd_mvsCWMZc",
  authDomain: "narmada-prahari-india.firebaseapp.com",
  projectId: "narmada-prahari-india",
  storageBucket: "narmada-prahari-india.firebasestorage.app",
  messagingSenderId: "465153037413",
  appId: "1:465153037413:web:821ad95ddcb7eac4d7628c",
  measurementId: "G-DYTK6XQ113"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);