// firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔹 Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDrr9S_ZUSlTRtFsjMhh0EjTKoDyZPJIvI",
  authDomain: "jobxp-89821.firebaseapp.com",
  projectId: "jobxp-89821",
  storageBucket: "jobxp-89821.firebasestorage.app",
  messagingSenderId: "835099058139",
  appId: "1:835099058139:web:5d24243de05076698151fe",
  measurementId: "G-4X7HWRE57D"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

