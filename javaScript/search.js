// Importing necessary Firebase modules for the app
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Firebase configuration object that connects our app to Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAhx3Qp8Qg23w6bWkcsWYrXtlg46I7_1PA",  // Unique API key for your Firebase project
    authDomain: "entreculture-project.firebaseapp.com",  // Domain for Firebase authentication
    databaseURL: "https://entreculture-project-default-rtdb.firebaseio.com",  // Firebase Realtime Database URL
    projectId: "entreculture-project",  // Firebase project ID
    appId: "1:26756746313:web:899812d4cad707d232c398",  // Unique app ID for your project
};

// Initialize Firebase app using the configuration
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);  // Get the reference to the database

// Array to store all products fetched from Firebase
let allProducts = [];

// Function to load products from Firebase
async function loadProducts() {
    // Get the HTML element where the products will be displayed
    const productGrid = document.getElementById('productGrid');

    // Reference to the 'products' section of the Firebase database
    const productsRef = ref(database, "products");

    // Listen for changes in the database (like adding new products)
    onValue(productsRef, (snapshot) => {
        // Check if the data exists in Firebase
        if (snapshot.exists()) {
            allProducts = [];  // Reset the products array
            // Loop through each product in the database
            snapshot.forEach((childSnapshot) => {
                const product = { id: childSnapshot.key, ...childSnapshot.val() };  // Store product data in an object
                allProducts.push(product);  // Add product to the products array
            });

            // Display all the products
            displayProducts(allProducts);
        } else {
            // If no products exist, show a message
            productGrid.innerHTML = '<p>No products found.</p>';
            productGrid.style.display = 'none';  // Hide the grid if no products
        }
    }, (error) => {
        console.error("Error fetching products:", error);  // Log any error in fetching data
    });
}

// Function to display the products on the webpage
function displayProducts(filteredProducts) {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = '';  // Clear the product grid

    // Check if there are any products to display
    if (filteredProducts.length > 0) {
        productGrid.style.display = 'grid';  // Show the grid if products are available
        // Loop through each product and create HTML for each product card
        filteredProducts.forEach((product) => {
            const productElement = document.createElement('div');
            productElement.classList.add('product-card');  // Add class for styling
            
            productElement.innerHTML = `
                <img src="${product.imageUrl}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p>Weight: ${product.weight || "N/A"}</p>
                    <p class="product-price">₹ ${product.price}</p>
                    <button class="add-to-cart" onclick="addToCart('${product.id}', '${product.name}', '${product.imageUrl}', '${product.price}')">
                        Add to Cart
                    </button>
                </div>
            `;
            productGrid.appendChild(productElement);  // Add product to the grid
        });
    } else {
        productGrid.style.display = 'none';  // Hide the grid if no products are filtered
    }
}

// Function to filter products based on the search query
function filterProducts() {
    const searchInput = document.getElementById('searchInput');  // Get search input element
    const query = searchInput.value.trim().toLowerCase();  // Clean and lowercase the search query

    if (query === '') {
        // If the search query is empty, hide all products
        displayProducts([]);
        return;
    }

    // Filter products based on the query
    const filteredProducts = allProducts.filter(product =>
        product.name.toLowerCase().includes(query) ||  // Match product name
        (product.weight && product.weight.toLowerCase().includes(query)) ||  // Match weight if available
        product.price.toString().includes(query)  // Match product price
    );

    // Display the filtered products
    displayProducts(filteredProducts);
}

// Event listener for search input changes
document.getElementById('searchInput').addEventListener('input', function () {
    this.value = this.value.replace(/\s+/g, ' ').trim();  // Clean extra spaces in the input
    filterProducts();  // Filter products based on the input
});

// Load all products when the page is ready
document.addEventListener("DOMContentLoaded", loadProducts);

// Function to add a product to the cart
function addToCart(id, name, imageUrl, price) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];  // Get the cart from localStorage, or an empty array if not present

    // Check if the product already exists in the cart
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        // If the product is already in the cart, increase its quantity
        existingItem.quantity += 1;
    } else {
        // Otherwise, add the new product to the cart with quantity 1
        cart.push({ id, name, imageUrl, price: parseFloat(price), quantity: 1 });
    }

    // Save the updated cart back to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${name} added to cart!`);  // Show a confirmation message
}
