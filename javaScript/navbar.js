document.addEventListener("DOMContentLoaded", () => {
    const navbarPlaceholder = document.getElementById("navbar-placeholder");

    // Check login status
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

    // Load and display the appropriate navbar
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
        loadNavbar("/pages/navbarLogin.html", "loggedInNavbar");
    } else {
        loadNavbar("/pages/navbar.html", "loggedOutNavbar");
    }
});
