document.addEventListener("DOMContentLoaded", () => {
    const navbarPlaceholder = document.getElementById("navbar-placeholder");

    // Check login status
    const isLoggedIn = localStorage.getItem("userToken");

    // Function to load and display the appropriate navbar
    const loadNavbar = (filePath) => {
        fetch(filePath)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to load navbar");
                }
                return response.text();
            })
            .then((html) => {
                navbarPlaceholder.innerHTML = html;

                // Attach event listeners to navbar links
                attachNavbarListeners();
            })
            .catch((error) => {
                console.error("Error loading navbar:", error);
            });
    };

    // Attach event listeners to navbar links
    const attachNavbarListeners = () => {
        const home = document.getElementById("home");
        const search = document.getElementById("search");
        const login = document.getElementById("login");
        const logout = document.getElementById("logout");
        const cart = document.getElementById("cart");

        if (home) {
            home.addEventListener("click", () => {
                window.location.href = "/index.html";
            });
        }

        if (search) {
            search.addEventListener("click", () => {
                window.location.href = "/pages/search.html";
            });
        }

        if (login) {
            login.addEventListener("click", () => {
                window.location.href = "/pages/login.html";
            });
        }

        if (logout) {
            logout.addEventListener("click", () => {
                localStorage.clear();
                window.location.href = "/index.html"; // Redirect to the homepage
            });
        }

        if (cart) {
            cart.addEventListener("click", () => {
                window.location.href = "/pages/cart.html";
            });
        }
    };

    // Determine which navbar to load
    if (isLoggedIn) {
        loadNavbar("/pages/navbarLogin.html");
    } else {
        loadNavbar("/pages/navbar.html");
    }
});
