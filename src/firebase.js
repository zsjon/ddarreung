// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import {getFirestore} from "firebase/firestore"
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries
//
// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyAVGaThHcbLZnz1mD7nzFtfxRxbRilp4kU",
//   authDomain: "seoul-bike-detection.firebaseapp.com",
//   projectId: "seoul-bike-detection",
//   storageBucket: "seoul-bike-detection.appspot.com",
//   messagingSenderId: "141833394500",
//   appId: "1:141833394500:web:d204ff49e6086e50649f11",
//   measurementId: "G-4Q1PXL6V6Z"
// };
//
// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const db = getFirestore(app);
//
// export { db, analytics };

// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import {getFirestore} from "firebase/firestore"
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries
//
// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyAVGaThHcbLZnz1mD7nzFtfxRxbRilp4kU",
//   authDomain: "seoul-bike-detection.firebaseapp.com",
//   projectId: "seoul-bike-detection",
//   storageBucket: "seoul-bike-detection.appspot.com",
//   messagingSenderId: "141833394500",
//   appId: "1:141833394500:web:e494ddbdb924fd0e649f11",
//   measurementId: "G-D09W7PWSZF"
// };
//
// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const db = getFirestore(app);
//
// export { db, analytics };

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAVGaThHcbLZnz1mD7nzFtfxRxbRilp4kU",
  authDomain: "seoul-bike-detection.firebaseapp.com",
  projectId: "seoul-bike-detection",
  storageBucket: "seoul-bike-detection.appspot.com",
  messagingSenderId: "141833394500",
  appId: "1:141833394500:web:d204ff49e6086e50649f11",
  measurementId: "G-4Q1PXL6V6Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export {db, analytics};