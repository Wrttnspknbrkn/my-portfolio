import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { collection, addDoc, getDocs } from "@firebase/firestore"; 

// web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD77Qujrk8qR3MLTuOAfMp_eGXqGWITZHs",
  authDomain: "my-portfolio-7071.firebaseapp.com",
  projectId: "my-portfolio-7071",
  storageBucket: "my-portfolio-7071.firebasestorage.app",
  messagingSenderId: "926477712931",
  appId: "1:926477712931:web:31f28b2864ffddc11ffb96"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc };
