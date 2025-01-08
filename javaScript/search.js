// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Firebase configuration to connect the app to Firebase
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

// Array to store all products
let allProducts = [];

// Load products from Firebase
function loadProducts() {
    const productGrid = document.getElementById("productGrid");
    const productsRef = ref(database, "products");

    onValue(productsRef, (getProduct) => {
        if (getProduct.exists()) {
            allProducts = [];
            getProduct.forEach((childgetProduct) => {
                const product = {
                    id: childgetProduct.key,
                    ...childgetProduct.val(),
                };
                allProducts.push(product);
            });
            displayProducts(allProducts);
        } else {
            productGrid.innerHTML = '<p>No products found.</p>';
            productGrid.style.display = "none";
        }
    });
}

// Display products on the page
function displayProducts(products) {
    const productGrid = document.getElementById("productGrid");
    productGrid.innerHTML = "";

    if (products.length > 0) {
        productGrid.style.display = "grid";

        products.forEach((product) => {
            const productElement = document.createElement("div");
            productElement.classList.add("product-card");

            productElement.innerHTML = `
                <img src="${product.imageUrl}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p>Weight: 1Kg</p>
                    <p class="product-price">₹ ${product.price}</p>
                    <button class="add-to-cart" onclick="addToCart('${product.id}', '${product.name}', '${product.imageUrl}', '${product.price}')">
                        Add to Cart
                    </button>
                </div>
            `;

            productGrid.appendChild(productElement);
        });
    } else {
        productGrid.style.display = "none";
    }
}

// Add product to cart
window.addToCart = function (id, name, imageUrl, price) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProduct = cart.find((item) => item.id === id);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ id, name, imageUrl, price, quantity: 1 });
    }

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

// Filter products based on search input
function filterProducts() {
    const searchInput = document.getElementById("searchInput");
    const query = searchInput.value.trim().toLowerCase();

    if (query === "") {
        displayProducts([]); // Show no products
        return;
    }

    const filteredProducts = allProducts.filter((product) => {
        return (
            product.name.toLowerCase().includes(query) ||
            product.price.toString().includes(query)
        );
    });

    displayProducts(filteredProducts);
}

// Event listener for search input
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", filterProducts);

// Load all products on page load
window.addEventListener("DOMContentLoaded", loadProducts);
