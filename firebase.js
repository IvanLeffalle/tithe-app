import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID } from '@env';
import { getAuth } from "firebase/auth";


export const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGING_SENDER_ID,
    appId: APP_ID
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const database = getFirestore(app);
const auth = getAuth(app);

export { database };
export { db };
export { app };
export { auth };
