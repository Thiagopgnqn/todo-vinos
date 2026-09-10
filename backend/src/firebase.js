import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAmSNt_I6W3bGWGEQTv82bm1gwwza4a-5s",
  authDomain: "todo-vinos.firebaseapp.com",
  projectId: "todo-vinos",
  storageBucket: "todo-vinos.firebasestorage.app",
  messagingSenderId: "379014396063",
  appId: "1:379014396063:web:7fd207f06247f530b68aaa",
  measurementId: "G-GTWJCN46TX"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);