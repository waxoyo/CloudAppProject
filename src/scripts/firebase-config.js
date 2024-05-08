
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage }  from 'firebase/storage';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIRE_API_KEY,
    authDomain: process.env.REACT_APP_FIRE_AUDOMAIN,
    projectId: process.env.REACT_APP_FIRE_PROJ_ID,
    storageBucket: process.env.REACT_APP_FIRE_STORAGE,
    messagingSenderId: process.env.REACT_APP_FIRE_MESSAGIN,
    appId: process.env.REACT_APP_FIRE_APP_ID,
    measurementId: process.env.REACT_APP_FIRE_MEASUREMENT,
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);