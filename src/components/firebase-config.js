// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAnMatU081OBwtxQt5RgE2XIrEZcFjpjhQ",
  authDomain: "registration-app-d8318.firebaseapp.com",
  projectId: "registration-app-d8318",
  storageBucket: "registration-app-d8318.appspot.com",
  messagingSenderId: "973374413696",
  appId: "1:973374413696:web:04800a6169d080dd80ff65",
  measurementId: "G-GGHKXKZVY4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
