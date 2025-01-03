document.addEventListener('DOMContentLoaded', () => {
    displayCart();
    updateCartSummary();
    document.getElementById('checkout-btn').addEventListener('click', handleCheckout);
    
    // Event delegation for cart item actions
    document.getElementById('cart-items').addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;
        
        const id = button.closest('.cart-item')?.dataset.id;
        if (!id) return;

        if (button.classList.contains('quantity-btn')) {
            const change = button.textContent === '+' ? 1 : -1;
            updateQuantity(id, change);
        } else if (button.classList.contains('remove-btn')) {
            removeFromCart(id);
        }
    });
});

function displayCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cart-items');

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Add some items to your cart to see them here.</p>
            </div>
        `;
        return;
    }

    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h3>${item.name}</h3>
                <p>${item.weight}</p>
                <p>₹${item.price.toFixed(2)}</p>
                <div class="quantity-controls">
                    <button class="quantity-btn">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn">+</button>
                </div>
            </div>
            <button class="remove-btn">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    document.getElementById('total-items').textContent = totalItems;
    document.getElementById('total-amount').textContent = totalAmount.toFixed(2);
}

function updateQuantity(productId, change) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(item => item.id === productId);

    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            updateDisplay();
        }
    }
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateDisplay();
}

function handleCheckout() {
    console.log("Button clicked")
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    window.location.href = '../pages/payment.html';
}

function updateDisplay() {
    displayCart();
    updateCartSummary();
}