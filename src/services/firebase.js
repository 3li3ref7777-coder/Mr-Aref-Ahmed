import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyCY_fSuAboQFnQjKI7767EGCd-YYECRI78",
    authDomain: "mr-aref-math.firebaseapp.com",
    projectId: "mr-aref-math",
    storageBucket: "mr-aref-math.firebasestorage.app",
    messagingSenderId: "786425823803",
    appId: "1:786425823803:web:b7a25578b8c88b961b521e",
    measurementId: "G-7BK1MB993T"
  };
const isConfigured = Object.values(firebaseConfig).every(Boolean)

const db = isConfigured
  ? getFirestore(initializeApp(firebaseConfig))
  : null

export { db, isConfigured }