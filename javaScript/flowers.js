// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, query, orderByChild, equalTo, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAhx3Qp8Qg23w6bWkcsWYrXtlg46I7_1PA",
    authDomain: "entreculture-project.firebaseapp.com",
    databaseURL: "https://entreculture-project-default-rtdb.firebaseio.com",
    projectId: "entreculture-project",
    appId: "1:26756746313:web:899812d4cad707d232c398",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Run code after the page loads
window.addEventListener("DOMContentLoaded", () => {
    showLoadingMessage();
    fetchProductsByCategory("Flowers");
});

// Fetch products from Firebase by category
function fetchProductsByCategory(category) {
    const productContainer = document.getElementById("product-list");

    // Create a reference and query for the category
    const productsRef = ref(database, "products");
    const categoryQuery = query(productsRef, orderByChild("category"), equalTo(category));

    // Listen for data changes
    onValue(categoryQuery, (getProduct) => {
        if (getProduct.exists()) {
            const products = [];

            // Collect product data
            getProduct.forEach((productgetProduct) => {
                const productData = productgetProduct.val();
                const productId = productgetProduct.key;
                products.push({ id: productId, ...productData });
            });

            // Display the products
            renderProducts(products);
        } else {
            showErrorMessage(productContainer, "No products found.");
        }
    }, (error) => {
        console.error("Error fetching products:", error);
        showErrorMessage(productContainer, "Failed to load products.");
    });

    hideLoadingMessage();
}

// Display products on the page
function renderProducts(products) {
    const productContainer = document.getElementById("product-list");

    // Create HTML for each product
    const productHTML = products.map((product) => {
        return `
            <div class="card">
                <img src="${product.imageUrl}" alt="${product.name}">
                <div class="card-content">
                    <h3>${product.name}</h3>
                    <p>Weight: 1kg</p>
                    <p>Price: ₹${product.price}</p>
                    <button onclick="addToCart('${product.id}', '${product.name}', '${product.imageUrl}', ${product.price})">
                        Add to Cart
                    </button>
                </div>
            </div>`;
    }).join("");

    productContainer.innerHTML = productHTML;
}

// Add product to cart
window.addToCart = function (id, name, imageUrl, price) {
    // Get the cart from localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if the product is already in the cart
    const existingProduct = cart.find((item) => item.id === id);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ id, name, imageUrl, price, quantity: 1 });
    }

    // Save the updated cart
    localStorage.setItem("cart", JSON.stringify(cart));
    showPopupMessage(`${name} added to cart!`);
};

// Show popup message
function showPopupMessage(message) {
    const popup = document.createElement("div");
    popup.className = "cart-popup";
    popup.textContent = message;
    document.body.appendChild(popup);

    setTimeout(() => {
        popup.classList.add("hide");
        popup.addEventListener("transitionend", () => popup.remove());
    }, 2000);
}

// Show loading message
function showLoadingMessage() {
    const productContainer = document.getElementById("product-list");
    productContainer.innerHTML = `<p class="loading">Loading products, please wait...</p>`;
}

// Hide loading message
function hideLoadingMessage() {
    const productContainer = document.getElementById("product-list");
    productContainer.innerHTML = "";
}

// Show error message
function showErrorMessage(container, message) {
    container.innerHTML = `<div style="text-align: center; padding: 20px;">
        <p style="color: #e74c3c; font-size: 1.1em;">${message}</p>
    </div>`;
}
