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

// Function to get all orders from localStorage
function getAllOrders() {
    return JSON.parse(localStorage.getItem('orders')) || [];
}

// Function to save orders to localStorage
function saveOrders(orders) {
    localStorage.setItem('orders', JSON.stringify(orders));
}

// Function to dynamically update the tracking status of all orders
function updateTrackingStatus() {
    const orders = getAllOrders();
    const now = new Date();

    orders.forEach(order => {
        const elapsedMinutes = (now - new Date(order.orderDate)) / (1000 * 60); // Elapsed minutes since orderDate

        // Update the currentStatus dynamically based on elapsed time
        if (elapsedMinutes >= 3) {
            order.currentStatus = 3; // Delivered
        } else if (elapsedMinutes >= 2) {
            order.currentStatus = 2; // Shipped
        } else if (elapsedMinutes >= 1) {
            order.currentStatus = 1; // Processing
        } else {
            order.currentStatus = 0; // Order Placed
        }
    });

    saveOrders(orders); // Save updated orders
    updateTrackingDisplay(); // Refresh the display to reflect updated order statuses
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
                            <p class="time">${index <= order.currentStatus
            ? formatDateWithTime(new Date(order.orderDate).getTime() + (index * 60 * 1000))
            : 'Pending'
        }</p>
                        </div>
                    </div>
                `).join('')}
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
    const orders = getAllOrders();

    if (orders.length === 0) {
        noOrderElement.style.display = 'block';
        orderContentElement.style.display = 'none';
    } else {
        noOrderElement.style.display = 'none';
        orderContentElement.style.display = 'block';
        orderContentElement.innerHTML = orders.map(order => createOrderHTML(order)).join('');
    }
}

// Function to initialize the order tracking page
function initializeOrderTrackingPage() {
    updateTrackingStatus(); // Update order statuses
    updateTrackingDisplay(); // Update the display
    refresh()
}

// Initialize the page when it loads
document.addEventListener('DOMContentLoaded', initializeOrderTrackingPage, refresh());

// Example: Add a new order (or any other action that changes data)
function addOrder(order) {
    const orders = getAllOrders();
    orders.push(order);
    saveOrders(orders); // Save the new order
    updateTrackingDisplay(); // Refresh the display without reloading the page
}

// Example: Updating an order status through a UI action
document.getElementById('update-status-button').addEventListener('click', () => {
    const orders = getAllOrders();
    const order = orders.find(order => order.orderId === 123); // Example order ID
    if (order) {
        order.currentStatus = 2; // Update the status to "Shipped"
        saveOrders(orders); // Save the updated order
        updateTrackingDisplay(); // Refresh the order display after status change
    }
});

function refresh() {
    setTimeout(() => {
        initializeOrderTrackingPage();
    }, 60000);
}

