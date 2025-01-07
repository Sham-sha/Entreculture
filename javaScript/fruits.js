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

// Wait for the DOM content to load before running the functions
document.addEventListener("DOMContentLoaded", () => {
    showLoadingAnimation();  // Display loading message while fetching products
    loadProductsByCategory("Fruits");  // Load products from category "Fruits" as an example
});

// Load products from Firebase by category (Fruits in this case)
async function loadProductsByCategory(category) {
    const productList = document.getElementById("product-list");  // Get the element to display products

    try {
        // Reference to the "products" node in Firebase
        const productsRef = ref(database, "products");

        // Create a query to filter products by category (e.g., Fruits)
        const categoryQuery = query(productsRef, orderByChild("category"), equalTo(category));

        // Use 'onValue' to listen to changes in the database and fetch products based on the query
        onValue(categoryQuery, (snapshot) => {
            if (snapshot.exists()) {
                const products = [];  // Array to store products
                snapshot.forEach((childSnapshot) => {
                    const product = { id: childSnapshot.key, ...childSnapshot.val() };  // Get product data
                    products.push(product);  // Add the product to the array
                });
                displayProducts(products);  // Display products on the page
            } else {
                showError(productList);  // If no products are found, show an error message
            }
        });
    } catch (error) {
        console.error("Error loading products:", error);
        showError(productList);  // Show error if something goes wrong with fetching products
    } finally {
        hideLoadingAnimation();  // Hide the loading animation after fetching is complete
    }
}

// Display products on the page
function displayProducts(products) {
    const productList = document.getElementById("product-list");  // Get the container to display products
    const productCards = products.map((product) => `
        <div class="card">
            <img src="${product.imageUrl}" alt="${product.name}">  <!-- Product image -->
            <div class="card-content">
                <h3>${product.name}</h3>  <!-- Product name -->
                <p>Weight: 1kg</p>  <!-- Product weight -->
                <p>Price: ₹${product.price}</p>  <!-- Product price -->
                <button onclick="addToCart('${product.id}', '${product.name}', '${product.imageUrl}', ${product.price})">
                    Add to Cart
                </button>  <!-- Add to cart button -->
            </div>
        </div>
    `).join("");  // Generate HTML for each product card and join them into one string
    productList.innerHTML = productCards;  // Insert the product cards into the page
}

// Add a product to the cart
window.addToCart = function (id, name, imageUrl, price) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];  // Get cart from localStorage, or an empty array if no cart
    const existingItem = cart.find((item) => item.id === id);  // Check if the product already exists in the cart

    if (existingItem) {
        // If the product is already in the cart, increase its quantity
        existingItem.quantity += 1;
    } else {
        // If it's a new product, add it to the cart with quantity 1
        cart.push({ id, name, imageUrl, price, quantity: 1 });
    }

    // Save the updated cart back to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    showPopup(`${name} added to cart!`);  // Show a confirmation popup
};

// Show a popup message
function showPopup(message) {
    const popup = document.createElement("div");  // Create a new div element for the popup
    popup.className = "cart-popup";  // Add a class to style the popup
    popup.textContent = message;  // Set the popup message text

    document.body.appendChild(popup);  // Append the popup to the body

    // Remove the popup after it has been displayed for 2 seconds
    setTimeout(() => {
        popup.classList.add("hide");  // Add 'hide' class to start hide animation
        popup.addEventListener("transitionend", () => popup.remove());  // Remove popup after animation ends
    }, 2000);
}

// Display a loading message while fetching data
function showLoadingAnimation() {
    const productList = document.getElementById("product-list");
    productList.innerHTML = `<p class="loading">Loading products, please wait...</p>`;  // Display loading text
}

// Hide the loading message once the products are loaded
function hideLoadingAnimation() {
    const productList = document.getElementById("product-list");
    productList.innerHTML = "";  // Clear the loading message
}

// Show an error message if products can't be loaded
function showError(container) {
    container.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <p style="color: #e74c3c; font-size: 1.1em;">
                Sorry, we couldn't load the products. Please try again later.
            </p>
        </div>
    `;
}
