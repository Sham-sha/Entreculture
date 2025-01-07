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

// Wait for DOM content to load
document.addEventListener("DOMContentLoaded", () => {
    showLoadingAnimation();
    loadProductsByCategory("Vegetables"); // Example: Load products of category "Fruits"
});

// Load products from Firebase by category
async function loadProductsByCategory(category) {
    const productList = document.getElementById("product-list");

    try {
        // Reference the "products" node in Firebase
        const productsRef = ref(database, "products");

        // Query products by category
        const categoryQuery = query(productsRef, orderByChild("category"), equalTo(category));

        onValue(categoryQuery, (snapshot) => {
            if (snapshot.exists()) {
                const products = [];
                snapshot.forEach((childSnapshot) => {
                    const product = { id: childSnapshot.key, ...childSnapshot.val() };
                    products.push(product);
                });
                displayProducts(products);
            } else {
                showError(productList);
            }
        });
    } catch (error) {
        console.error("Error loading products:", error);
        showError(productList);
    } finally {
        hideLoadingAnimation();
    }
}

// Display products on the page
function displayProducts(products) {
    const productList = document.getElementById("product-list");
    const productCards = products.map((product) => `
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
        </div>
    `).join("");
    productList.innerHTML = productCards;
}

// Add a product to the cart
window.addToCart = function (id, name, imageUrl, price) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find((item) => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, imageUrl, price, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    showPopup(`${name} added to cart!`);
};

// Show a popup message
function showPopup(message) {
    const popup = document.createElement("div");
    popup.className = "cart-popup";
    popup.textContent = message;

    document.body.appendChild(popup);

    // Remove the popup after animation ends
    setTimeout(() => {
        popup.classList.add("hide");
        popup.addEventListener("transitionend", () => popup.remove());
    }, 2000);
}

// Loading animation
function showLoadingAnimation() {
    const productList = document.getElementById("product-list");
    productList.innerHTML = `<p class="loading">Loading products, please wait...</p>`;
}

// Hide loading animation
function hideLoadingAnimation() {
    const productList = document.getElementById("product-list");
    productList.innerHTML = ""; // Clear loading message
}

// Show an error message
function showError(container) {
    container.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <p style="color: #e74c3c; font-size: 1.1em;">
                Sorry, we couldn't load the products. Please try again later.
            </p>
        </div>
    `;
}
