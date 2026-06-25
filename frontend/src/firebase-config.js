import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAAGr4kghFLYRn3DRfKaFl66SdvNmafIw4",
  authDomain: "sm-golden-resort.firebaseapp.com",
  projectId: "sm-golden-resort",
  storageBucket: "sm-golden-resort.firebasestorage.app",
  messagingSenderId: "200819635816",
  appId: "1:200819635816:web:a1b7ba3a5c4984d0e5addd"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
export const db = getFirestore(app);
