// Wait until the DOM is fully loaded before running the scripts
document.addEventListener('DOMContentLoaded', function () {
    displayOrderSummary();
    setupFormValidation();
});

// Function to display the order summary
function displayOrderSummary() {
    // Get cart data from local storage (or use an empty array if no data exists)
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalItems = 0;
    let totalAmount = 0;

    // Calculate total items and total amount
    for (let i = 0; i < cart.length; i++) {
        totalItems += cart[i].quantity;
        totalAmount += cart[i].price * cart[i].quantity;
    }

    // Update the page with totals
    document.getElementById('total-items').textContent = totalItems;
    document.getElementById('total-amount').textContent = totalAmount.toFixed(2);
    document.getElementById('pay-amount').textContent = totalAmount.toFixed(2);
}

// Function to set up form validation and payment process
function setupFormValidation() {
    let form = document.getElementById('payment-form');
    let cardNumber = document.getElementById('card-number');
    let expiry = document.getElementById('expiry');
    let cvv = document.getElementById('cvv');
    let pincode = document.getElementById('pincode');

    // Format the card number with spaces every 4 digits
    cardNumber.addEventListener('input', function (event) {
        let value = event.target.value.replace(/\s/g, ''); // Remove spaces
        value = value.replace(/\D/g, ''); // Remove non-digit characters
        value = value.replace(/(\d{4})/g, '$1 ').trim(); // Add space every 4 digits
        event.target.value = value;
    });

    // Format the expiry date as MM/YY
    expiry.addEventListener('input', function (event) {
        let value = event.target.value.replace(/\D/g, ''); // Remove non-digit characters
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2); // Add '/' after MM
        }
        event.target.value = value;
    });

    // Allow only digits for CVV
    cvv.addEventListener('input', function (event) {
        event.target.value = event.target.value.replace(/\D/g, '');
    });

    // Allow only digits for PIN code
    pincode.addEventListener('input', function (event) {
        event.target.value = event.target.value.replace(/\D/g, '');
    });

    // Handle form submission
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        // Disable the button and show processing text
        var button = form.querySelector('button');
        button.disabled = true;
        button.textContent = 'Processing...';

        // Simulate payment processing with a delay
        setTimeout(function () {
            // Fade out the payment form
            document.querySelector('.payment-container').style.opacity = '0';

            // Show the success animation
            let successAnimation = document.getElementById('success-animation');
            successAnimation.classList.add('show');

            // Save cart items for tracking before clearing the cart
            localStorage.setItem('cartItems', localStorage.getItem('cart'));

            // Clear the cart from local storage
            localStorage.removeItem('cart');

            // Initialize tracking data
            const orderDate = new Date();
            const orderId = 'ORD' + Math.random().toString(36).substr(2, 9).toUpperCase();
            
            const trackingData = {
                orderId: orderId,
                orderDate: orderDate,
                currentStatus: 0,
                lastUpdate: orderDate,
                estimatedDelivery: new Date(orderDate.getTime() + (5 * 24 * 60 * 60 * 1000)) // 5 days from order
            };
            
            localStorage.setItem('trackingData', JSON.stringify(trackingData));

            // Redirect to tracking page after showing success animation
            setTimeout(function () {
                window.location.href = '../pages/my_order.html';
            }, 3000); // Redirect after 3 seconds
        }, 2000); // Simulate payment processing for 2 seconds
    });
}