import { getFirestore } from 'firebase/firestore'
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyB92pcwSNgvx_C0X5nX-n6rHsDMzeyDZ6A",
  authDomain: "doutorgabrielcuran.firebaseapp.com",
  projectId: "doutorgabrielcuran",
  storageBucket: "doutorgabrielcuran.firebasestorage.app",
  messagingSenderId: "656707175099",
  appId: "1:656707175099:web:14d37b561422f29e6a5f9e",
  measurementId: "G-31WD8KWGE6"
};

const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export { db, app };