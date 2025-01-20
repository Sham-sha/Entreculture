// Function to generate a random order ID
function generateOrderId() {
    // Generate a random string for order ID
    return 'ORD' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Function to format date with time
function formatDateWithTime(date) {
    // Format a date with both date and time
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Function to format date without time
function formatDateWithoutTime(date) {
    // Format a date with only the date (no time)
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Function to get all orders from localStorage
function getAllOrders() {
    // Retrieve saved orders or return an empty array if no orders exist
    return JSON.parse(localStorage.getItem('orders')) || [];
}

// Function to save orders to localStorage
function saveOrders(orders) {
    // Save the orders array to localStorage
    localStorage.setItem('orders', JSON.stringify(orders));
}

// Function to initialize a new order and save it
function initializeNewOrder(cartItems) {
    const orderDate = new Date(); // Current date and time
    const orderId = generateOrderId(); // Generate a unique order ID

    // Create the order object
    const newOrder = {
        orderId: orderId,
        orderDate: orderDate, // Store the order date
        currentStatus: 0, // Start with "Order Placed"
        lastUpdate: orderDate, // Last update time starts as order date
        estimatedDelivery: new Date(orderDate.getTime() + (2 * 24 * 60 * 60 * 1000)), // Delivery in 2 days
        items: cartItems // Items in the order
    };

    // Add the new order to the list of orders
    const orders = getAllOrders();
    orders.push(newOrder);
    saveOrders(orders);

    return newOrder; // Return the new order
}

// Function to check if there are active orders
function hasActiveOrders() {
    const orders = getAllOrders();
    return orders.length > 0; // Return true if there are any orders
}

// Function to create HTML for one order
function createOrderHTML(order) {
    return `
        <div class="order-section" data-order-id="${order.orderId}">
            <div class="order-info">
                <p>Order ID: ${order.orderId}</p>
                <p>Order Date: ${formatDateWithTime(order.orderDate)}</p>
            </div>
            
            <div class="tracking-timeline">
                ${['order-placed', 'processing', 'shipped', 'delivered'].map((step, index) => `
                    <div class="tracking-step ${index <= order.currentStatus ? 'active' : ''}">
                        <div class="step-icon">${['📦', '🏭', '🚚', '✅'][index]}</div>
                        <div class="step-content">
                            <h3>${step.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
                            <p class="time">${
                                index <= order.currentStatus 
                                    ? (index === order.currentStatus 
                                        ? formatDateWithTime(order.lastUpdate)
                                        : formatDateWithTime(new Date(order.orderDate).getTime() + (index * 16 * 60 * 60 * 1000)))
                                    : 'Pending'
                            }</p>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="estimated-delivery">
                <h2>Estimated Delivery</h2>
                <p>${formatDateWithoutTime(order.estimatedDelivery)}</p>
            </div>

            <div class="product-list">
                <h2>Ordered Items</h2>
                <div class="ordered-items">
                    ${order.items.map(item => `
                        <div class="product-item">
                            <img src="${item.imageUrl || 'https://via.placeholder.com/60'}" />
                            <div class="product-details">
                                <h3>${item.name}</h3>
                                <p>Quantity: ${item.quantity}</p>
                                <p>Price: ₹${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <hr class="order-divider">
        </div>
    `;
}

// Function to update the tracking display
function updateTrackingDisplay() {
    const noOrderElement = document.getElementById('no-order');
    const orderContentElement = document.getElementById('order-content');

    if (!hasActiveOrders()) {
        // If no orders, show the "No Order" message
        noOrderElement.style.display = 'block';
        orderContentElement.style.display = 'none';
        return;
    }

    // If there are orders, hide the "No Order" message and show orders
    noOrderElement.style.display = 'none';
    orderContentElement.style.display = 'block';
    
    const orders = getAllOrders();
    orderContentElement.innerHTML = orders.map(order => createOrderHTML(order)).join('');
}

// Function to update the tracking status of all orders
function updateTrackingStatus() {
    if (!hasActiveOrders()) {
        return; // If no active orders, do nothing
    }

    let orders = getAllOrders();
    let updated = false;
    
    orders = orders.map(order => {
        const now = new Date();
        const hoursSinceLastUpdate = (now - new Date(order.lastUpdate)) / (1000 * 60 * 60);

        // If more than 16 hours passed and the status is not "Delivered"
        if (hoursSinceLastUpdate >= 16 && order.currentStatus < 3) {
            order.currentStatus++; // Move to the next status
            order.lastUpdate = now; // Update the last update time
            updated = true;
        }
        return order;
    });

    if (updated) {
        saveOrders(orders); // Save updated orders
        updateTrackingDisplay(); // Refresh the display
    }
}

// Function to create a new order from cart items
function createOrderFromCart() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    if (cartItems.length > 0) {
        initializeNewOrder(cartItems); // Create a new order
        localStorage.removeItem('cartItems'); // Clear the cart
        updateTrackingDisplay(); // Refresh the display
    }
}

// Initialize the page when it loads
document.addEventListener('DOMContentLoaded', function() {
    createOrderFromCart(); // Create a new order from cart items if any
    updateTrackingDisplay(); // Show the orders
    setInterval(updateTrackingStatus, 60000); // Check for updates every 1 minute
});
