// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDd1dwVPitW6GUEsxP3WGrfohg9X3qdApY",
  authDomain: "kynnovate-9efe3.firebaseapp.com",
  projectId: "kynnovate-9efe3",
  storageBucket: "kynnovate-9efe3.firebasestorage.app",
  messagingSenderId: "870301329997",
  appId: "1:870301329997:web:7f715d39b149c56bb2ca04",
  measurementId: "G-N66FTKZV0X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
