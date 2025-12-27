// Firebase initialization
// Replace the values below with your project's config values.
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyDgBCejpvZHSbQYGXSfSlLfAbzSzqjWouY",
  authDomain: "animatic-7d235.firebaseapp.com",
  databaseURL: "https://animatic-7d235-default-rtdb.firebaseio.com",
  projectId: "animatic-7d235",
  storageBucket: "animatic-7d235.firebasestorage.app",
  messagingSenderId: "737458226045",
  appId: "1:737458226045:web:8da82aec2fa8c12a18c214",
  measurementId: "G-KDGHMVCXKH"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAnalytics = typeof window !== 'undefined' ? getAnalytics(firebaseApp) : null;
export const firebaseAuth = typeof window !== 'undefined' ? getAuth(firebaseApp) : null;
