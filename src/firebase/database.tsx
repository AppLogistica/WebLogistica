// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBrcB12bfgVP469aqaFHuNeaHh4ZWsUc9w",
  authDomain: "applogistica-599aa.firebaseapp.com",
  projectId: "applogistica-599aa",
  storageBucket: "applogistica-599aa.appspot.com",
  messagingSenderId: "839048842126",
  appId: "1:839048842126:web:351055fdacaa0ce293f2df",
  measurementId: "G-XFFR14N7K6"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export default db


