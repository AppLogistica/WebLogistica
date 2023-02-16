// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {  getFirestore  } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCpVdMwzmhM18IzYHXfl5QBfc3zEjuDchQ",
  authDomain: "app-logisticaa.firebaseapp.com",
  projectId: "app-logisticaa",
  storageBucket: "app-logisticaa.appspot.com",
  messagingSenderId: "85281698499",
  appId: "1:85281698499:web:9aa28d2ef547c34a95a876",
  measurementId: "G-D14D3PG27Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
 
// Subsequent queries will use persistence, if it was enabled successfully

export default db;



