document.addEventListener("DOMContentLoaded", () => {
    showLoadingAnimation();
    loadProducts();
});

async function loadProducts() {
    const productList = document.getElementById("product-list");
    try {
        const response = await fetch("/data/grains.json");
        if (!response.ok) throw new Error("Failed to load products");
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error("Error loading products:", error);
        showError(productList);
    } finally {
        hideLoadingAnimation();
    }
}

function displayProducts(products) {
    const productList = document.getElementById("product-list");
    const productCards = products.map(product => `
        <div class="card">
            <img src="${product.image}" alt="${product.name}">
            <div class="card-content">
                <h3>${product.name}</h3>
                <p>Weight: ${product.weight}</p>
                <p>Price: ₹${product.price}</p>
                <button onclick="addToCart('${product.id}', '${product.name}', '${product.image}', '${product.price}', '${product.weight}')">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join("");
    productList.innerHTML = productCards;
}

function addToCart(id, name, image, price, weight) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, image, price: parseFloat(price), weight, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    showPopup(`${name} added to cart!`);
}

function showPopup(message) {
    const popup = document.createElement('div');
    popup.className = 'cart-popup';
    popup.textContent = message;

    document.body.appendChild(popup);

    // Remove the popup after animation ends
    setTimeout(() => {
        popup.classList.add('hide');
        popup.addEventListener('transitionend', () => popup.remove());
    }, 2000);
}


function showLoadingAnimation() {
    console.log("Loading...");
}

function hideLoadingAnimation() {
    console.log("Loading complete.");
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
