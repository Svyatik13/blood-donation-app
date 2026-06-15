import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCsFsYBt6DRxQ6Yot1TzgtGHbB8thYqPew",
  authDomain: "blooddonor-196fc.firebaseapp.com",
  projectId: "blooddonor-196fc",
  storageBucket: "blooddonor-196fc.firebasestorage.app",
  messagingSenderId: "347370037631",
  appId: "1:347370037631:web:e16edcb97c7b23510eba4a",
  measurementId: "G-02K8E5NJMQ"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
