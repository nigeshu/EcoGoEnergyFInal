// Firebase Configuration for EcoGo Energy Monitor
// Replace with your own Firebase project credentials

const firebaseConfig = {
  apiKey: "AIzaSyAmKgnPUYLApFdIUxGatjj9Zu69OqMTHsM",
  authDomain: "ecogo-energy-monitor.firebaseapp.com",
  projectId: "ecogo-energy-monitor",
  storageBucket: "ecogo-energy-monitor.firebasestorage.app",
  messagingSenderId: "771130696062",
  appId: "1:771130696062:web:caf403dd042c3913fd932f"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// Export for use in other files
window.firebaseAuth = auth;
window.firebaseDB = db;
