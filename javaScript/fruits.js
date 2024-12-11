// Fetch and render products
document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
});

async function loadProducts() {
    const productList = document.getElementById("product-list");
    
    // Add loading state
    showLoadingState(productList);
    
    try {
        const response = await fetch("/data/fruits.json");
        if (!response.ok) {
            throw new Error("Failed to fetch fruits data");
        }
        const data = await response.json();
        renderProducts(data);
    } catch (error) {
        console.error("Error loading fruits data:", error);
        showErrorState(productList);
    }
}

function showLoadingState(container) {
    container.innerHTML = Array(8)
        .fill()
        .map(() => `
            <div class="card loading">
                <div class="card-image-container"></div>
                <div class="card-content">
                    <h3>&nbsp;</h3>
                    <p class="weight">&nbsp;</p>
                    <p class="price">&nbsp;</p>
                    <button disabled>Add to Cart</button>
                </div>
            </div>
        `)
        .join("");
}

function showErrorState(container) {
    container.innerHTML = `
        <div style="text-align: center; grid-column: 1 / -1; padding: 2rem;">
            <p style="color: #e53e3e; font-size: 1.1rem;">
                Sorry, we couldn't load the products. Please try again later.
            </p>
        </div>
    `;
}

function renderProducts(data) {
    const productList = document.getElementById("product-list");
    productList.innerHTML = data.map(item => `
        <div class="card">
            <div class="card-image-container">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
            </div>
            <div class="card-content">
                <h3>${item.name}</h3>
                <p class="weight">${item.weight}</p>
                <p class="price">₹${item.price}</p>
                <button onclick="addToCart('${item.id}')">Add to Cart</button>
            </div>
        </div>
    `).join("");
}

function addToCart(productId) {
    // Add your cart functionality here
    console.log(`Product ${productId} added to cart`);
}