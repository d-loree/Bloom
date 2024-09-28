import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API,
  authDomain: "hackthehill-9df6f.firebaseapp.com",
  projectId: "hackthehill-9df6f",
  storageBucket: "hackthehill-9df6f.appspot.com",
  messagingSenderId: "329488615340",
  appId: "1:329488615340:web:bc19301cd16095289b1c09",
  measurementId: "G-BPKK6D21NS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, auth, db };
