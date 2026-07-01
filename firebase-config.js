// Firebase SDK Configuration using Compat Libraries for simplicity
const firebaseConfig = {
    apiKey: "AIzaSyA6P-FatL0iggYld-6nyRL-KbVYmsCyuyU",
    authDomain: "education-app-6584d.firebaseapp.com",
    projectId: "education-app-6584d",
    storageBucket: "education-app-6584d.firebasestorage.app",
    messagingSenderId: "824086022871",
    appId: "1:824086022871:web:c415cbb5d74e07b4ccfe92"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
