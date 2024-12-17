let cart = [];

// Fetch and render products
document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
});

async function loadProducts() {
    const productList = document.getElementById("product-list");
    
    // Add loading state
    showLoadingState(productList);
    
    try {
        const response = await fetch("/data/flours.json");
        if (!response.ok) {
            throw new Error("Failed to fetch products data");
        }
        const data = await response.json();
        renderProducts(data);
    } catch (error) {
        console.error("Error loading products data:", error);
        showErrorState(productList);
    }
}

function showLoadingState(container) {
    container.innerHTML = Array(8)
        .fill()
        .map(() => `
            <div class="card loading">
                <div class="card-image-container"></div>
                <div class="card-content">
                    <h3>&nbsp;</h3>
                    <p class="weight">&nbsp;</p>
                    <p class="price">&nbsp;</p>
                    <button disabled>Add to Cart</button>
                </div>
            </div>
        `)
        .join("");
}

function showErrorState(container) {
    container.innerHTML = `
        <div style="text-align: center; grid-column: 1 / -1; padding: 2rem;">
            <p style="color: #e53e3e; font-size: 1.1rem;">
                Sorry, we couldn't load the products. Please try again later.
            </p>
        </div>
    `;
}

function renderProducts(data) {
    const productList = document.getElementById("product-list");
    productList.innerHTML = data.map(item => `
        <div class="card">
            <div class="card-image-container">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
            </div>
            <div class="card-content">
                <h3>${item.name}</h3>
                <p class="weight">${item.weight}</p>
                <p class="price">₹${item.price}</p>
                <button onclick="addToCart(${JSON.stringify(item).replace(/"/g, '&quot;')})">Add to Cart</button>
            </div>
        </div>
    `).join("");
}

function addToCart(product) {
    // Check if product already exists in the cart
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
        existingProduct.quantity += 1; // Increase quantity if already in cart
    } else {
        product.quantity = 1; // Add new product with quantity 1
        cart.push(product);
    }

    // Save the cart in localStorage for persistence
    localStorage.setItem("cart", JSON.stringify(cart));

    console.log(`Product ${product.name} added to cart`);
    alert(`${product.name} has been added to your cart.`);
}

// Function to render the cart page
function renderCartPage() {
    const cartContainer = document.getElementById("cart-container");
    if (cart.length === 0) {
        cartContainer.innerHTML = `<p>Your cart is empty.</p>`;
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    cartContainer.innerHTML = `
        <div class="cart-items">
            ${cart.map(item => `
                <div class="cart-item">
                    <p>${item.name}</p>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Price: ₹${item.price * item.quantity}</p>
                </div>
            `).join('')}
        </div>
        <div class="cart-summary">
            <p>Total: ₹${total}</p>
            <button id="place-order" onclick="placeOrder()">Place Order</button>
        </div>
    `;
}

// Function to handle order placement
function placeOrder() {
    alert("Order placed successfully!");
    cart = []; // Clear the cart
    localStorage.removeItem("cart"); // Clear cart from localStorage
    renderCartPage(); // Re-render the empty cart
}

// Load cart from localStorage when cart page is loaded
document.addEventListener("DOMContentLoaded", () => {
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    if (savedCart) {
        cart = savedCart;
    }
    const cartPage = document.getElementById("cart-container");
    if (cartPage) {
        renderCartPage();
    }
});
