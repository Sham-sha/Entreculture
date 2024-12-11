// Wait for the page to load
document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
});

// Load products from JSON file
async function loadProducts() {
    const productList = document.getElementById("product-list");
    
    // Show loading state
    showLoading(productList);
    
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
    }
}

// Show loading placeholder
function showLoading(container) {
    const loadingCards = Array(8)
        .fill()
        .map(() => `
            <div class="card loading">
                <div style="height: 200px; background: #eee;"></div>
                <div class="card-content">
                    <h3 style="background: #eee; height: 24px; margin-bottom: 10px;"></h3>
                    <p style="background: #eee; height: 16px; margin-bottom: 10px;"></p>
                    <p style="background: #eee; height: 24px; margin-bottom: 15px;"></p>
                    <div style="background: #eee; height: 40px;"></div>
                </div>
            </div>
        `)
        .join("");
    
    container.innerHTML = loadingCards;
}

// Show error message
function showError(container) {
    container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 20px;">
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
                <p class="weight">${product.weight}</p>
                <p class="price">₹${product.price}</p>
                <button onclick="addToCart('${product.id}')">Add to Cart</button>
            </div>
        </div>
    `).join("");
    
    productList.innerHTML = productCards;
}

// Add to cart function
function addToCart(productId) {
    // Simple cart functionality
    console.log(`Added product ${productId} to cart`);
    alert("Product added to cart!");
}