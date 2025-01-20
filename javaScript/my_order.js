// Function to generate a random order ID
function generateOrderId() {
    return 'ORD' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Function to format date with time
function formatDateWithTime(date) {
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
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Function to get all orders from localStorage
function getAllOrders() {
    return JSON.parse(localStorage.getItem('orders')) || [];
}

// Function to save orders to localStorage
function saveOrders(orders) {
    localStorage.setItem('orders', JSON.stringify(orders));
}

// Function to initialize a new order and save it
function initializeNewOrder(cartItems) {
    const orderDate = new Date();
    const orderId = generateOrderId();
    const newOrder = {
        orderId: orderId,
        orderDate: orderDate,
        currentStatus: 0,
        lastUpdate: orderDate,
        estimatedDelivery: new Date(orderDate.getTime() + (3 * 60 * 1000)), // Simulated 3-minute delivery for demo
        items: cartItems
    };

    const orders = getAllOrders();
    orders.push(newOrder);
    saveOrders(orders);

    return newOrder;
}

// Function to check if there are active orders
function hasActiveOrders() {
    return getAllOrders().length > 0;
}

// Function to update the tracking status of all orders
function updateTrackingStatus() {
    if (!hasActiveOrders()) {
        return;
    }

    let orders = getAllOrders();
    const now = new Date();

    orders = orders.map(order => {
        const elapsedMinutes = (now - new Date(order.orderDate)) / (1000 * 60); // Elapsed minutes since orderDate

        // Update the currentStatus based on elapsed time
        if (elapsedMinutes >= 3) {
            order.currentStatus = 3; // Delivered
        } else if (elapsedMinutes >= 2) {
            order.currentStatus = 2; // Shipped
        } else if (elapsedMinutes >= 1) {
            order.currentStatus = 1; // Processing
        } else {
            order.currentStatus = 0; // Order Placed
        }

        return order;
    });

    saveOrders(orders); // Save updated orders
    updateTrackingDisplay(); // Refresh the display
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
                ${['Order Placed', 'Processing', 'Shipped', 'Delivered'].map((step, index) => `
                    <div class="tracking-step ${index <= order.currentStatus ? 'active' : ''}">
                        <div class="step-icon">${['📦', '🏭', '🚚', '✅'][index]}</div>
                        <div class="step-content">
                            <h3>${step}</h3>
                            <p class="time">${
                                index <= order.currentStatus 
                                    ? formatDateWithTime(new Date(order.orderDate).getTime() + (index * 60 * 1000))
                                    : 'Pending'
                            }</p>
                        </div>
                    </div>
                `).join('')}
            </div>git add    

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
        noOrderElement.style.display = 'block';
        orderContentElement.style.display = 'none';
        return;
    }

    noOrderElement.style.display = 'none';
    orderContentElement.style.display = 'block';
    const orders = getAllOrders();
    orderContentElement.innerHTML = orders.map(order => createOrderHTML(order)).join('');
}

// Function to create a new order from cart items
function createOrderFromCart() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    console.log('Retrieved Cart Items:', cartItems); // Debug log

    if (cartItems.length > 0) {
        initializeNewOrder(cartItems);
        localStorage.removeItem('cartItems');
        updateTrackingDisplay(); // Refresh the display
    } else {
        console.warn('No items in cart to create order.');
    }
}

// Initialize the page when it loads
document.addEventListener('DOMContentLoaded', function () {
    updateTrackingStatus(); // Update tracking status on page load
    updateTrackingDisplay(); // Display the updated order tracking
});
