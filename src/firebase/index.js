// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCn7c5u-oBVUizfHV3YUayQC-YG4LFnxUo',
  authDomain: 'tinder-3-383704.firebaseapp.com',
  projectId: 'tinder-3-383704',
  storageBucket: 'tinder-3-383704.appspot.com',
  messagingSenderId: '744409744447',
  appId: '1:744409744447:web:ac98ccdb019a9a2250a48a',
  measurementId: 'G-WR73TMH7CB',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db }; // Import the functions you need from the SDKs you need
