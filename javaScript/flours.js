// Wait for the page to fully load before running the script
document.addEventListener('DOMContentLoaded', () => {
    loadProducts(); // Load and display products from Firebase
    setupSearch(); // Add event listener for search input
});

// Array to hold products
let allProducts = [];

// Load products from Firebase and display them
function loadProducts() {
    const productGrid = document.getElementById("productGrid");
    const productsRef = ref(database, "products");

    onValue(productsRef, (getProduct) => {
        if (getProduct.exists()) {
            allProducts = [];
            getProduct.forEach((childgetProduct) => {
                const product = {
                    id: childgetProduct.key,
                    ...childgetProduct.val(),
                };
                allProducts.push(product);
            });
            displayProducts(allProducts);
        } else {
            productGrid.innerHTML = "<p>No products found.</p>";
        }
    });
}

// Display products in the grid
function displayProducts(products) {
    const productGrid = document.getElementById("productGrid");
    productGrid.innerHTML = ""; // Clear the product grid

    products.forEach((product) => {
        const productElement = document.createElement("div");
        productElement.classList.add("product-card");

        productElement.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p>Weight: 1kg</p>
                <p class="product-price">₹${product.price}</p>
                <button class="add-to-cart" onclick="addToCart('${product.id}', '${product.name}', '${product.imageUrl}', ${product.price})">
                    Add to Cart
                </button>
            </div>
        `;

        productGrid.appendChild(productElement);
    });
}

// Add product to the cart
window.addToCart = function (id, name, imageUrl, price) {
    const cart = JSON.parse(localStorage.getItem('cart')) || []; // Get cart from localStorage
    const existingProduct = cart.find((item) => item.id === id);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ id, name, imageUrl, price, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart)); // Save updated cart
    showPopupMessage(`${name} added to cart!`);
};

// Show a popup message when an item is added to the cart
function showPopupMessage(message) {
    const popup = document.createElement('div');
    popup.className = 'cart-popup';
    popup.textContent = message;
    document.body.appendChild(popup);

    setTimeout(() => {
        popup.classList.add('hide');
        popup.addEventListener('transitionend', () => popup.remove());
    }, 2000);
}

// Filter products based on search input
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        const filteredProducts = allProducts.filter(product =>
            product.name.toLowerCase().includes(query) ||
            product.price.toString().includes(query)
        );
        displayProducts(filteredProducts);
    });
}
