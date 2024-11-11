import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

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
  const form = document.querySelector("form");
  const username = document.getElementById("username");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");
  const terms = document.getElementById("terms");

  const usernameError = document.getElementById("usernameError");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");
  const confirmPasswordError = document.getElementById("confirmPasswordError");

  const strongPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent form from submitting by default

    // Reset error messages
    usernameError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";
    confirmPasswordError.textContent = "";

    let isValid = true;

    // Username validation
    if (username.value.trim() === "") {
      usernameError.textContent = "Username is required.";
      isValid = false;
    } else if (username.value.length < 3) {
      usernameError.textContent = "Username must be at least 3 characters.";
      isValid = false;
    }

    // Email validation
    if (email.value.trim() === "") {
      emailError.textContent = "Email is required.";
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
      emailError.textContent = "Please enter a valid email address.";
      isValid = false;
    }

    // Password validation
    if (password.value.trim() === "") {
      passwordError.textContent = "Password is required.";
      isValid = false;
    } else if (!strongPasswordRegex.test(password.value)) {
      passwordError.textContent = "Password must be at least 6 characters long and include at least one letter and one number.";
      isValid = false;
    }

    // Confirm password validation
    if (confirmPassword.value.trim() === "") {
      confirmPasswordError.textContent = "Please confirm your password.";
      isValid = false;
    } else if (password.value !== confirmPassword.value) {
      confirmPasswordError.textContent = "Passwords do not match.";
      isValid = false;
    }

    // Terms and conditions checkbox validation
    if (!terms.checked) {
      alert("You must agree to the Terms of Use and Privacy Policy.");
      isValid = false;
    }

    // If validation passed, attempt to create user
    if (isValid) {
      try {
        await createUserWithEmailAndPassword(auth, email.value, password.value);
        alert("Account created successfully!");

        // Redirect to login page
        window.location.href = "login.html";
      } catch (error) {
        // Display Firebase-specific errors
        if (error.code === "auth/email-already-in-use") {
          emailError.textContent = "Email is already in use.";
        } else if (error.code === "auth/invalid-email") {
          emailError.textContent = "Invalid email address.";
        } else if (error.code === "auth/weak-password") {
          passwordError.textContent = "Password is too weak.";
        } else {
          alert("Error creating account. Please try again.");
        }
      }
    }
  });
});
