// Import Firebase authentication methods
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAhx3Qp8Qg23w6bWkcsWYrXtlg46I7_1PA",
  authDomain: "entreculture-project.firebaseapp.com",
  projectId: "entreculture-project",
  storageBucket: "entreculture-project.firebasestorage.app",
  messagingSenderId: "26756746313",
  appId: "1:26756746313:web:899812d4cad707d232c398",
  measurementId: "G-MR1HYZK1KD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".login-form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const generalError = document.getElementById("generalError");

    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // Prevent form submission to avoid page reload

        // Reset error messages
        emailError.textContent = "";
        passwordError.textContent = "";
        generalError.textContent = "";

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        let isValid = true;

        // Validate email and password fields
        if (!email) {
            emailError.textContent = "Email is required.";
            isValid = false;
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            emailError.textContent = "Please enter a valid email address.";
            isValid = false;
        }

        if (!password) {
            passwordError.textContent = "Password is required.";
            isValid = false;
        }

        if (isValid) {
            try {
                // Log in using Firebase
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Save login info securely in sessionStorage
                const idToken = await user.getIdToken();
                sessionStorage.setItem("userToken", idToken);
                sessionStorage.setItem("userEmail", user.email);

                // Redirect to home page
                window.location.href = "../../index.html";
            } catch (error) {
                console.error("Error logging in:", error);

                // Handle Firebase errors
                if (error.code === "auth/user-not-found") {
                    emailError.textContent = "No user found with this email address.";
                } else if (error.code === "auth/wrong-password") {
                    passwordError.textContent = "Incorrect password. Please try again.";
                } else if (error.code === "auth/too-many-requests") {
                    generalError.textContent = "Too many failed login attempts. Please try again later.";
                } else if (error.code === "auth/invalid-email") {
                    emailError.textContent = "Invalid email address format.";
                } else {
                    generalError.textContent = "Login failed. Please try again.";
                }
            }
        }
    });
});

