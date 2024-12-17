document.getElementById("payment-form").addEventListener("submit", function (event) {
    event.preventDefault();

    // Simulate payment processing
    alert("Payment Successful!");
    localStorage.removeItem("cart"); // Clear the cart after payment

    // Redirect to a confirmation page or back to products
    window.location.href = "products.html";
});
