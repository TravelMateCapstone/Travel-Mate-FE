import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAc89mKa0gSF-x5Khm55OOg8OPWSs9Dkow",
    authDomain: "travelmate-15583.firebaseapp.com",
    projectId: "travelmate-15583",
    storageBucket: "travelmate-15583.appspot.com",
    messagingSenderId: "532465699415",
    appId: "1:532465699415:web:fded48b938589a4e7a7112",
    measurementId: "G-CSYZDFG38D"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };