// Initialize cart from localStorage or empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Load cart items when the page loads
document.addEventListener('DOMContentLoaded', () => {
    displayCart();
    updateCartSummary();

    // Add event listener for checkout
    const checkoutButton = document.getElementById('checkout-btn');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', handleCheckout);
    }
});

// Display cart items
function displayCart() {
    const cartContainer = document.getElementById('cart-items');
    if (!cartContainer) {
        console.error("Error: 'cart-items' container not found.");
        return;
    }

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Add some items to your cart to see them here.</p>
            </div>
        `;
        return;
    }

    const cartHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h3>${item.name}</h3>
                <p>${item.weight}</p>
                <p>₹${item.price.toFixed(2)}</p>
                <div class="quantity-controls">
                    <button class="quantity-btn" data-action="decrease" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" data-action="increase" data-id="${item.id}">+</button>
                </div>
            </div>
            <button class="remove-btn" data-action="remove" data-id="${item.id}">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');

    cartContainer.innerHTML = cartHTML;

    // Attach event listeners to cart controls
    cartContainer.addEventListener('click', handleCartActions);
}

// Update cart summary
function updateCartSummary() {
    const totalItemsElement = document.getElementById('total-items');
    const totalAmountElement = document.getElementById('total-amount');

    if (!totalItemsElement || !totalAmountElement) {
        console.error("Error: Cart summary elements not found.");
        return;
    }

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    totalItemsElement.textContent = totalItems;
    totalAmountElement.textContent = totalAmount.toFixed(2);
}

// Handle cart actions
function handleCartActions(event) {
    const button = event.target.closest('button[data-action]');
    if (!button) return;

    const action = button.dataset.action;
    const productId = button.dataset.id;

    if (action === 'increase') {
        updateQuantity(productId, 1);
    } else if (action === 'decrease') {
        updateQuantity(productId, -1);
    } else if (action === 'remove') {
        removeFromCart(productId);
    }
}

// Update item quantity
function updateQuantity(productId, change) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex === -1) return;

    const newQuantity = cart[itemIndex].quantity + change;

    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }

    cart[itemIndex].quantity = newQuantity;
    saveCart();
    updateDisplay();
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateDisplay();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Checkout functionality
function handleCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    alert('Thank you for your purchase!');
    cart = [];
    saveCart();
    updateDisplay();
}

// Update both cart display and summary
function updateDisplay() {
    displayCart();
    updateCartSummary();
}

