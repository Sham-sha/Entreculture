// Wait for the page to fully load before running the script
document.addEventListener('DOMContentLoaded', () => {
    displayCart(); // Show the cart items
    updateCartSummary(); // Update the total items and price

    // Add event listener to the checkout button
    const checkoutButton = document.getElementById('checkout-btn');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', handleCheckout);
    }

    // Handle actions on cart items (increase, decrease, remove)
    const cartItemsContainer = document.getElementById('cart-items');
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (event) => {
            const button = event.target.closest('button'); // Find the clicked button
            if (!button) return;

            const itemId = button.closest('.cart-item')?.dataset.id; // Get product ID
            if (!itemId) return;

            if (button.classList.contains('quantity-btn')) {
                // Check if the button is "+" or "-" and adjust quantity
                const change = button.textContent === '+' ? 1 : -1;
                updateQuantity(itemId, change);
            } else if (button.classList.contains('remove-btn')) {
                // Remove the item from the cart
                removeFromCart(itemId);
            }
        });
    }
});

// Show the cart items on the page
function displayCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || []; // Get cart from localStorage
    const cartContainer = document.getElementById('cart-items'); // Container to display cart items

    if (cart.length === 0) {
        // If the cart is empty, show a message
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Add some items to your cart to see them here.</p>
            </div>
        `;
        return;
    }

    // Display each item in the cart
    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.imageUrl}" alt="${item.name}">
            <div class="item-details">
                <h3>${item.name}</h3>
                <p>Weight: 1kg</p>
                <p>Price: ₹${item.price.toFixed(2)}</p>
                <div class="quantity-controls">
                    <button class="quantity-btn">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn">+</button>
                </div>
            </div>
            <button class="remove-btn">Remove</button>
        </div>
    `).join('');
}

// Update the total items and price in the cart
function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    document.getElementById('total-items').textContent = totalItems;
    document.getElementById('total-amount').textContent = totalAmount.toFixed(2);
}

// Change the quantity of a product in the cart
function updateQuantity(productId, change) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(item => item.id === productId);

    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId); // Remove item if quantity is zero or less
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            updateDisplay();
        }
    }
}

// Remove a product from the cart
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId); // Remove the selected item
    localStorage.setItem('cart', JSON.stringify(cart));
    updateDisplay();
}

// Handle the checkout process
function handleCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const loggedInUser = localStorage.getItem('userEmail'); // Check if a user is logged in

    if (!loggedInUser) {
        alert('Please log in to proceed to checkout.');
        return;
    }

    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    // Redirect to the payment page
    window.location.href = '../pages/payment.html';
}

// Update both the cart items and the summary
function updateDisplay() {
    displayCart();
    updateCartSummary();
}
