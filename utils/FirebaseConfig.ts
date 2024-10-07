import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBRVygaWappu5XmrKKKMrSRpkibv6L2qC4",
  authDomain: "wodle-7e125.firebaseapp.com",
  projectId: "wodle-7e125",
  storageBucket: "wodle-7e125.appspot.com",
  messagingSenderId: "937631483328",
  appId: "1:937631483328:web:4f65d9218c35ba5a8f3425",
};

const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
