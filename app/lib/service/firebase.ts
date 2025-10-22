// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCTCjsRmPTaY1seC57m4hGSIaDqdtUE6aU",
  authDomain: "reeltrip-f9801.firebaseapp.com",
  projectId: "reeltrip-f9801",
  storageBucket: "reeltrip-f9801.firebasestorage.app",
  messagingSenderId: "467087005853",
  appId: "1:467087005853:web:7fc9c1ad07910aa39a5c74",
  measurementId: "G-VHFPVMG6KH"
};


// すでに初期化済みかどうか確認
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Auth の初期化
const auth = getAuth(app);

// Analytics はクライアントのみ有効
let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes) analytics = getAnalytics(app);
  });
}

export { app, auth, analytics };