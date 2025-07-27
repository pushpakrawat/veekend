import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged, 
  User,
  AuthError
} from "firebase/auth";

import { env } from "./env";

const firebaseConfig = {
  apiKey: env.FIREBASE_API_KEY || "AIzaSyDKl5EkC8vWOsRYknn5zUQ0TjS8_w3M1HQ",
  authDomain: env.FIREBASE_AUTH_DOMAIN || "weekend-fe673.firebaseapp.com",
  projectId: env.FIREBASE_PROJECT_ID || "weekend-fe673",
  storageBucket: env.FIREBASE_STORAGE_BUCKET || "weekend-fe673.firebasestorage.app",
  messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID || "579982141783",
  appId: env.FIREBASE_APP_ID || "1:579982141783:web:dd16aba052b18b515e7612",
  measurementId: env.FIREBASE_MEASUREMENT_ID || "G-9528LV82H2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('email');
provider.addScope('profile');

export const signInWithGoogle = () => {
  return signInWithPopup(auth, provider);
};

export const signInWithEmail = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signUpWithEmail = async (email: string, password: string, displayName: string) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName });
  return result;
};

export const signOutUser = () => {
  return signOut(auth);
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export { GoogleAuthProvider };
