var firebaseConfig = {
  apiKey: "AIzaSyB5gaFlx4llGtJygmEt-awU-MUakEJE7AU",
  authDomain: "egc---follow-up.firebaseapp.com",
  projectId: "egc---follow-up",
  storageBucket: "egc---follow-up.firebasestorage.app",
  messagingSenderId: "48796498031",
  appId: "1:48796498031:web:075b9f5b63ad3c3789759a"
};

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
var isConfigured = true;
