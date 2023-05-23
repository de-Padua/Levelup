// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbaiak2luQOScWlljnOAXYLg8AnSqbFJI",
  authDomain: "levelup-2bf47.firebaseapp.com",
  projectId: "levelup-2bf47",
  storageBucket: "levelup-2bf47.appspot.com",
  messagingSenderId: "893585887106",
  appId: "1:893585887106:web:b5d340e5fc1e87d0f2499b",
};
// Initialize Firebas
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
