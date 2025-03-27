import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAvQLZ00CAgIqP3apv2WZGMpbwTzE3Fofk",
  authDomain: "sow-pay.firebaseapp.com",
  projectId: "sow-pay",
  storageBucket: "sow-pay.firebasestorage.app",
  messagingSenderId: "47005907696",
  appId: "1:47005907696:web:5ffe40b9370fe9bea32035",
  measurementId: "G-ZGNF74TV7K",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: "select_account",
});

// Generate a 6-digit AppID
const generateAppId = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  uuidv4,
  generateAppId,
};
