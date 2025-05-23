import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAepH5AQMWa8JJ-DucbgU8X3RyJUFKsEMA",
  authDomain: "essenapp.firebaseapp.com",
  projectId: "essenapp",
  storageBucket: "essenapp.appspot.com",
  messagingSenderId: "164518584114",
  appId: "1:164518584114:web:4f76c259c289602fa5012b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);