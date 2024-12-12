// Wait for the page to load
document.addEventListener("DOMContentLoaded", () => {
    showLoadingAnimation(); // Show loading animation immediately
    loadProducts();
});



// Load products from JSON file
async function loadProducts() {
    const productList = document.getElementById("product-list");

    try {
        // Fetch the products data
        const response = await fetch("/data/fruits.json");
        if (!response.ok) {
            throw new Error("Failed to load products");
        }

        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error("Error:", error);
        showError(productList);
    } finally {
        hideLoadingAnimation(); // Hide loading animation once loading is complete
    }
}

// Show error message
function showError(container) {
    container.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <p style="color: #e74c3c; font-size: 1.1em;">
                Sorry, we couldn't load the products. Please try again later.
            </p>
        </div>
    `;
}

// Display products on the page
function displayProducts(products) {
    const productList = document.getElementById("product-list");

    const productCards = products.map(product => `
        <div class="card">
            <img src="${product.image}" alt="${product.name}">
            <div class="card-content">
                <h3>${product.name}</h3>
                <p>${product.weight}</p>
                <p>₹${product.price}</p>
                <button onclick="addToCart('${product.id}')">Add to Cart</button>
            </div>
        </div>
    `).join("");

    productList.innerHTML = productCards;
}

// Add to cart function
function addToCart(productId) {
    console.log(`Added product ${productId} to cart`);
    alert("Product added to cart!");
}
