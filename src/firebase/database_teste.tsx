// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { initializeFirestore, CACHE_SIZE_UNLIMITED, enableIndexedDbPersistence, getFirestore } from "firebase/firestore";
import { Auth } from "firebase/auth";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBfQt5UWzpraTrNuOglttZZ4Adqu1LptSw",
  authDomain: "teste-69c09.firebaseapp.com",
  projectId: "teste-69c09",
  storageBucket: "teste-69c09.appspot.com",
  messagingSenderId: "768532353757",
  appId: "1:768532353757:web:7417e0ebd2907bd0028134",
  measurementId: "G-4907KQMMRB"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED
});

//const db = getFirestore(app);

enableIndexedDbPersistence(db)
  .catch((err) => {
      if (err.code == 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a a time.
          // ...
      } else if (err.code == 'unimplemented') {
          // The current browser does not support all of the
          // features required to enable persistence
          // ...
      }
  });
// Subsequent queries will use persistence, if it was enabled successfully

export default db


