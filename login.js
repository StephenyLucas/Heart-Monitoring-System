import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, orderByChild, equalTo, get } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAxTzviT4bRIAToRD8aNwwuXMpskpBHNO8",
  authDomain: "registration-cdc5c.firebaseapp.com",
  databaseURL: "https://registration-cdc5c-default-rtdb.firebaseio.com",
  projectId: "registration-cdc5c",
  storageBucket: "registration-cdc5c.appspot.com",
  messagingSenderId: "243273823427",
  appId: "1:243273823427:web:981260b77f9e15fe215e76",
  measurementId: "G-EN57V03PRR"
};


// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);
const auth = getAuth(firebaseApp);

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Sign in user with email and password
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // User signed in successfully
                const user = userCredential.user;
                checkIfUserRegistered(email);
            })
            .catch((error) => {
                // Handle errors
                console.error('Error signing in:', error);
                alert('Error signing in. Please check your credentials and try again.');
            });
    });
});

async function checkIfUserRegistered(email) {
    try {
        // Check if the user is registered in the Realtime Database
        const snapshot = await get(ref(database, 'registrationForm'));
        if (snapshot.exists()) {
            const users = Object.values(snapshot.val());
            const userExists = users.some(user => user.email === email);
            if (userExists) {
                // User is registered, proceed to login
                console.log('User is registered');
                alert('Logged in successfully!');
                // Redirect to the home page
                window.location.href = "home.html"; // Replace "home.html" with the URL of your home page
            } else {
                // User is not registered
                console.log('User is not registered');
                alert('You are not registered. Please sign up.');
            }
        } else {
            console.log('No users found');
            alert('No users found. Please sign up.');
        }
    } catch (error) {
        console.error('Error checking registration:', error);
        alert('An error occurred while checking registration. Please try again later.');
    }
}
