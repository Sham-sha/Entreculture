// Function to format date with time
function formatDateWithTime(date) {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric', 
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(date).toLocaleDateString('en-US', options);
}

// Function to get all orders from localStorage
function getAllOrders() {
    const orders = localStorage.getItem('orders');
    return orders ? JSON.parse(orders) : [];
}

// Function to save orders to localStorage
function saveOrders(orders) {
    localStorage.setItem('orders', JSON.stringify(orders));
}

// Function to update the tracking status of all orders
function updateTrackingStatus() {
    const orders = getAllOrders();
    const now = new Date();

    // Loop through all orders and update their status based on elapsed time
    orders.forEach(order => {
        const elapsedMinutes = (now - new Date(order.orderDate)) / (1000 * 60); // Calculate elapsed minutes

        // Update the status based on time
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

    saveOrders(orders); // Save updated orders back to localStorage
    updateTrackingDisplay(); // Update the display
}

// Function to create HTML for displaying one order
function createOrderHTML(order) {
    const statusSteps = ['Order Placed', 'Processing', 'Shipped', 'Delivered'];
    const statusIcons = ['📦', '🏭', '🚚', '✅'];

    // Create HTML for the tracking steps
    const trackingStepsHTML = statusSteps.map((step, index) => {
        const isActive = index <= order.currentStatus;
        const stepTime = isActive
            ? formatDateWithTime(new Date(order.orderDate).getTime() + index * 60 * 1000)
            : 'Pending';

        return `
            <div class="tracking-step ${isActive ? 'active' : ''}">
                <div class="step-icon">${statusIcons[index]}</div>
                <div class="step-content">
                    <h3>${step}</h3>
                    <p class="time">${stepTime}</p>
                </div>
            </div>
        `;
    }).join('');

    // Create HTML for the order items
    const itemsHTML = order.items.map(item => {
        return `
            <div class="product-item">
                <img src="${item.imageUrl || 'https://via.placeholder.com/60'}" alt="${item.name}" />
                <div class="product-details">
                    <h3>${item.name}</h3>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Price: ₹${(item.price * item.quantity).toFixed(2)}</p>
                </div>
            </div>
        `;
    }).join('');

    // Return the complete HTML for one order
    return `
        <div class="order-section" data-order-id="${order.orderId}">
            <div class="order-info">
                <p>Order ID: ${order.orderId}</p>
                <p>Order Date: ${formatDateWithTime(order.orderDate)}</p>
            </div>
            <div class="tracking-timeline">
                ${trackingStepsHTML}
            </div>
            <div class="product-list">
                <h2>Ordered Items</h2>
                <div class="ordered-items">
                    ${itemsHTML}
                </div>
            </div>
        </div>
    `;
}

// Function to update the order tracking display
function updateTrackingDisplay() {
    const noOrderElement = document.getElementById('no-order');
    const orderContentElement = document.getElementById('order-content');
    const orders = getAllOrders();

    // Show or hide the order list based on whether there are orders
    if (orders.length === 0) {
        noOrderElement.style.display = 'block';
        orderContentElement.style.display = 'none';
    } else {
        noOrderElement.style.display = 'none';
        orderContentElement.style.display = 'block';
        orderContentElement.innerHTML = orders.map(createOrderHTML).join('');
    }
}

// Function to initialize the tracking page
function initializeOrderTrackingPage() {
    updateTrackingStatus(); // Update the status of orders
    updateTrackingDisplay(); // Update the order display
    refreshPage(); // Set up auto-refresh
}

// Function to refresh the page every 60 seconds
function refreshPage() {
    setTimeout(() => {
        initializeOrderTrackingPage();
    }, 60000);
}

// Run the initialization when the page loads
document.addEventListener('DOMContentLoaded', initializeOrderTrackingPage);

// Example: Function to add a new order
function addOrder(order) {
    const orders = getAllOrders();
    orders.push(order);
    saveOrders(orders); // Save the new order
    updateTrackingDisplay(); // Refresh the display
}
