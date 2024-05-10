// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

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
    // Accessing DOM elements after the DOM has fully loaded
    var heightInput = document.getElementById("height");
    var weightInput = document.getElementById("weight");
    var bmiInput = document.getElementById("bmi");
    var passwordInput = document.getElementById("password");


    // Adding event listeners after the DOM has fully loaded
    heightInput.addEventListener("input", calculateBMI);
    weightInput.addEventListener("input", calculateBMI);

    // Function to calculate BMI
    function calculateBMI() {
        var heightFeet = parseFloat(heightInput.value);
        var weight = parseFloat(weightInput.value);

        if (!isNaN(heightFeet) && !isNaN(weight) && heightFeet > 0 && weight > 0) {
            // Convert height from feet to meters
            var heightMeters = heightFeet * 0.3048; // 1 foot = 0.3048 meters
            // Calculate BMI using the formula: BMI = weight (kg) / height^2 (m^2)
            var bmi = weight / (heightMeters * heightMeters);
            bmiInput.value = bmi.toFixed(2);
        } else {
            bmiInput.value = "";
        }
    }

    document.getElementById('registrationForm').addEventListener('submit', submitForm);

    function submitForm(e) {
        e.preventDefault();
        // Get form data and submit to Firebase
        const formData = {
            name: document.getElementById("name").value,
            age: document.getElementById("age").value,
            phone: document.getElementById("phone").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
            address: document.getElementById("address").value,
            doctorName: document.getElementById("doctor-name").value,
            doctorPhone: document.getElementById("doctor-phone").value,
            doctorEmail: document.getElementById("doctor-email").value,
            height: document.getElementById("height").value,
            weight: document.getElementById("weight").value,
            bmi: document.getElementById("bmi").value,
            diabetes: document.getElementById("diabetes").value,
            cholesterol: document.getElementById("cholesterol").value,
            smokingAlcohol: document.getElementById("smoking_alcohol").value,
            familyHistory: document.getElementById("family_history").value
        };
        if (!validatePassword(formData.password)) {
            alert("Password must have a minimum of 8 characters, 1 special character, 1 capital letter, and 1 number.");
            return;
        }
        createUserWithEmailAndPassword(auth, formData.email, formData.password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                
                // Push form data to Realtime Database
                push(ref(database, 'registrationForm'), formData)
                    .then(() => {
                        console.log("Data saved successfully");
                        alert("Registered successfully!");
                    })
                    .catch((error) => {
                        console.error("Error saving data: ", error);
                    });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error("Error creating user: ", errorMessage);
            });
          
    }

    function validatePassword(password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }
});
