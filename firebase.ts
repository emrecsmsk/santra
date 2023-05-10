// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBP8G8_cAQkHW5V0NgF6mu8W2RQD8_qh0c",
    authDomain: "santra-d7297.firebaseapp.com",
    projectId: "santra-d7297",
    storageBucket: "santra-d7297.appspot.com",
    messagingSenderId: "670824922933",
    appId: "1:670824922933:web:7c8cbffe64bdda9ac2d67c",
    measurementId: "G-T9DFC3M06H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const database = getFirestore();