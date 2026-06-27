const firebaseConfig = {
    apiKey: "AIzaSyB5gaFlx4llGtJygmEt-awU-MUakEJE7AU",
    authDomain: "egc---follow-up.firebaseapp.com",
    projectId: "egc---follow-up",
    storageBucket: "egc---follow-up.firebasestorage.app",
    messagingSenderId: "48796498031",
    appId: "1:48796498031:web:075b9f5b63ad3c3789759a",
    measurementId: "G-9TVKSSQ52D"
  };

const isConfigured = true;

let db = null;

if (isConfigured) {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
} else {
  console.warn("Firebase not configured yet.");
} 
