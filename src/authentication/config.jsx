// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCAQZuFAeL8vJDbeCiOZE3N9skJ7CUkkAs",
  authDomain: "sanivation-3336b.firebaseapp.com",
  projectId: "sanivation-3336b",
  storageBucket: "sanivation-3336b.appspot.com",
  messagingSenderId: "304879988670",
  appId: "1:304879988670:web:8366fcd530c09232ed13ef",
  measurementId: "G-2E6F0SWEEW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
export {auth, provider, app, db};

