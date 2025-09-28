// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyDgBCejpvZHSbQYGXSfSlLfAbzSzqjWouY",
    authDomain: "animatic-7d235.firebaseapp.com",
    projectId: "animatic-7d235",
    storageBucket: "animatic-7d235.firebasestorage.app",
    messagingSenderId: "737458226045",
    appId: "1:737458226045:web:8da82aec2fa8c12a18c214",
    measurementId: "G-KDGHMVCXKH"
  }
};

// Initialize Firebase
const app = initializeApp(environment.firebase);
const analytics = getAnalytics(app);