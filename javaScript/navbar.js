document.addEventListener("DOMContentLoaded", () => {
    const navbarPlaceholder = document.getElementById("navbar-placeholder");

    // Check if the user is logged in (using localStorage or other methods)
    const isLoggedIn = localStorage.getItem("userToken");

    // Cache navbar HTML to reduce load time
    const cacheNavbar = (key, filePath) => {
        const cachedHTML = localStorage.getItem(key);
        if (cachedHTML) {
            return Promise.resolve(cachedHTML);
        }
        return fetch(filePath)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to load navbar");
                }
                return response.text();
            })
            .then((html) => {
                localStorage.setItem(key, html);
                return html;
            });
    };

    // Load and display the appropriate navbar based on login status
    const loadNavbar = (filePath, cacheKey) => {
        cacheNavbar(cacheKey, filePath)
            .then((html) => {
                navbarPlaceholder.innerHTML = html;
                attachNavbarListeners();
            })
            .catch((error) => console.error("Error loading navbar:", error));
    };

    // Attach event listeners to navbar links
    const attachNavbarListeners = () => {
        const home = document.getElementById("home");
        const search = document.getElementById("search");
        const login = document.getElementById("login");
        const logout = document.getElementById("logout");
        const cart = document.getElementById("cart");
        const admin = document.getElementById("admin");
        const order = document.getElementById("my-orders");

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

        if (order) {
            order.addEventListener("click", () => {
                window.location.href = "../pages/my_order.html";
            });
        }
        
    };

    // Determine which navbar to load based on login status
    if (isLoggedIn) {
        loadNavbar("../pages/navbarLogin.html", "loggedInNavbar");
    } else {
        loadNavbar("../pages/navbar.html", "loggedOutNavbar");
    }
});
