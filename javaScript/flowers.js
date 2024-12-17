
document.addEventListener("DOMContentLoaded", () => {
    showLoadingAnimation(); 
    loadProducts(); // 
});

// Function to load products from a JSON file
async function loadProducts() {
    
    const productList = document.getElementById("product-list");

    try {
        
        const response = await fetch("/data/flowers.json");

        
        if (!response.ok) {
            throw new Error("Failed to load products");
        }

        
        const products = await response.json();

        
        displayProducts(products);
    } catch (error) {
        
        console.error("Error:", error);
        showError(productList);
    } finally {
        
        hideLoadingAnimation();
    }
}


function showError(container) {
    container.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <p style="color: #e74c3c; font-size: 1.1em;">
                Sorry, we couldn't load the products. Please try again later.
            </p>
        </div>
    `;
}


function displayProducts(products) {
   
    const productList = document.getElementById("product-list");

   
    const productCards = products.map(product => {
        return `
            <div class="card">
                <!-- Product Image -->
                <img src="${product.image}" alt="${product.name}">

                <!-- Product Details -->
                <div class="card-content">
                    <h3>${product.name}</h3>
                    <p>Weight: ${product.weight}</p>
                    <p>Price: ₹${product.price}</p>
                    <button onclick="addToCart('${product.id}')">Add to Cart</button>
                </div>
            </div>
        `;
    }).join(""); 

 
    productList.innerHTML = productCards;
}


function addToCart(productId) {
    console.log(`Added product ${productId} to cart`); 
    alert("Product added to cart!"); 
}


function showLoadingAnimation() {
    console.log("Loading..."); 
}

function hideLoadingAnimation() {
    console.log("Loading complete."); 
}
