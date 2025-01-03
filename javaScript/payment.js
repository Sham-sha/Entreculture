document.addEventListener('DOMContentLoaded', () => {
    displayOrderSummary();
    setupFormValidation();
});

function displayOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    document.getElementById('total-items').textContent = totalItems;
    document.getElementById('total-amount').textContent = totalAmount.toFixed(2);
    document.getElementById('pay-amount').textContent = totalAmount.toFixed(2);
}

function setupFormValidation() {
    const form = document.getElementById('payment-form');
    const cardNumber = document.getElementById('card-number');
    const expiry = document.getElementById('expiry');
    const cvv = document.getElementById('cvv');
    const pincode = document.getElementById('pincode');

    // Format card number with spaces
    cardNumber.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\s/g, '');
        value = value.replace(/\D/g, '');
        value = value.replace(/(\d{4})/g, '$1 ').trim();
        e.target.value = value;
    });

    // Format expiry date
    expiry.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }
        e.target.value = value;
    });

    // Allow only numbers for CVV
    cvv.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
    });

    // Allow only numbers for pincode
    pincode.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simulate payment processing
        const button = form.querySelector('button');
        button.disabled = true;
        button.textContent = 'Processing...';

        setTimeout(() => {
            alert('Payment successful! Thank you for your purchase.');
            localStorage.removeItem('cart');
            window.location.href = '/index.html';
        }, 2000);
    });
}