document.addEventListener("DOMContentLoaded", () => {
    const navbarPlaceholder = document.getElementById("navbar-placeholder");

    // Check if the user is logged in (using localStorage)
    const isLoggedIn = localStorage.getItem("userToken");

    // Preload both navbars initially (in the background)
    let loggedInNavbarHTML = '';
    let loggedOutNavbarHTML = '';

    const preloadNavbars = () => {
        // Preload both navbars
        return Promise.all([
            fetch("../pages/navbarLogin.html").then((response) => response.text()),
            fetch("../pages/navbar.html").then((response) => response.text())
        ]).then(([loggedInHTML, loggedOutHTML]) => {
            loggedInNavbarHTML = loggedInHTML;
            loggedOutNavbarHTML = loggedOutHTML;
        }).catch((error) => console.error("Error preloading navbars:", error));
    };

    // Load and display the appropriate navbar based on login status
    const loadNavbar = () => {
        if (isLoggedIn) {
            navbarPlaceholder.innerHTML = loggedInNavbarHTML;
        } else {
            navbarPlaceholder.innerHTML = loggedOutNavbarHTML;
        }
        attachNavbarListeners();
    };

    // Attach event listeners to navbar links
    const attachNavbarListeners = () => {
        const home = document.getElementById("home");
        const search = document.getElementById("search");
        const login = document.getElementById("login");
        const logout = document.getElementById("logout");
        const cart = document.getElementById("cart");
        const admin = document.getElementById("admin");

        // Array of admin emails
        const adminEmails = [
            "entrecultureadmin0809@gmail.com",
            "admin2@example.com",
            "admin3@example.com"
        ];

        // Check if logged-in user is an admin
        const loggedInEmail = localStorage.getItem("userEmail"); // Get email stored in localStorage

        // Display admin button if the user is an admin
        if (admin && adminEmails.includes(loggedInEmail)) {
            admin.style.display = "block";
        } else if (admin) {
            admin.style.display = "none";
        }

        // Home button
        if (home) {
            home.addEventListener("click", () => {
                window.location.href = "../index.html";
            });
        }

        // Search button
        if (search) {
            search.addEventListener("click", () => {
                window.location.href = "../pages/search.html";
            });
        }

        // Login button
        if (login) {
            login.addEventListener("click", () => {
                window.location.href = "../pages/login.html";
            });
        }

        // Logout button
        if (logout) {
            logout.addEventListener("click", () => {
                localStorage.clear();
                window.location.href = "../index.html"; // Redirect to the homepage
            });
        }

        // Cart button
        if (cart) {
            cart.addEventListener("click", () => {
                window.location.href = "../pages/cart.html";
            });
        }

        // Admin button logic
        if (admin) {
            admin.addEventListener("click", () => {
                if (adminEmails.includes(loggedInEmail)) {
                    window.location.href = "../pages/admin.html"; // Navigate to the admin page
                }
            });
        }
    };

    // Preload navbars and then load the appropriate one
    preloadNavbars().then(() => {
        loadNavbar(); // Load the correct navbar after preloading
    });
});
