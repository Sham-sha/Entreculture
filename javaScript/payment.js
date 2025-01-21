document.addEventListener('DOMContentLoaded', function () {
    displayOrderSummary();
    setupPaymentForm();
});

function displayOrderSummary() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalItems = 0;
    let totalAmount = 0;

    for (let i = 0; i < cart.length; i++) {
        totalItems += cart[i].quantity;
        totalAmount += cart[i].price * cart[i].quantity;
    }

    document.getElementById('total-items').textContent = totalItems;
    document.getElementById('total-amount').textContent = totalAmount.toFixed(2);
    document.getElementById('pay-amount').textContent = totalAmount.toFixed(2);
}

function setupPaymentForm() {
    const form = document.getElementById('payment-form');
    const payButton = form.querySelector('.pay-button');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const selectedMethod = document.querySelector('input[name="payment-method"]:checked');
        if (!selectedMethod) {
            alert('Please select a payment method');
            return;
        }

        // Disable the button and show processing text
        payButton.disabled = true;
        payButton.textContent = 'Processing...';

        // Simulate payment processing
        setTimeout(function () {
            // Fade out the payment form
            document.querySelector('.payment-container').style.opacity = '0';

            // Show success animation
            document.getElementById('success-animation').classList.add('show');

            // Save cart items for tracking
            const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
            localStorage.removeItem('cart');

            if (cartItems.length > 0) {
                const orderDate = new Date();
                const orderId = 'ORD' + Math.random().toString(36).substr(2, 9).toUpperCase();

                // Get existing orders
                const orders = JSON.parse(localStorage.getItem('orders')) || [];

                // Add the new order
                orders.push({
                    orderId: orderId,
                    orderDate: orderDate,
                    currentStatus: 0, // Order Placed
                    lastUpdate: orderDate,
                    estimatedDelivery: new Date(orderDate.getTime() + (5 * 24 * 60 * 60 * 1000)), // +5 days
                    items: cartItems,
                });

                // Save orders back to localStorage
                localStorage.setItem('orders', JSON.stringify(orders));
            }

            // Redirect after animation
            setTimeout(function () {
                window.location.href = '../pages/my_order.html';
            }, 3000);
        }, 2000);
    });
}
