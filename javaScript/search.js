// List of your JSON file URLs
const jsonFiles = [
    '../data/flours.json',
    '../data/flowers.json',
    '../data/fruits.json',
    '../data/grains.json',
    '../data/vegetables.json'
];

// Array to hold all products
let allProducts = [];

// Function to fetch and parse JSON data from a file
async function fetchProductData(file) {
    try {
        const response = await fetch(file);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching product data from file:', file, error);
        return [];
    }
}

// Function to load all products from the JSON files
async function loadProducts() {
    const productPromises = jsonFiles.map(file => fetchProductData(file));
    const productsArrays = await Promise.all(productPromises);
    
    // Flatten the array of arrays into a single array of products
    allProducts = productsArrays.flat();
    
    // Initially, the product grid should be hidden
    const productGrid = document.getElementById('productGrid');
    productGrid.style.display = 'none';  // Ensure the grid is hidden by default
}

// Function to display the products in the grid
function displayProducts(filteredProducts) {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = ''; // Clear existing products

    // If there are products to display, show the grid
    if (filteredProducts.length > 0) {
        productGrid.style.display = 'grid';  // Show the grid when products are available
        filteredProducts.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product-card');
            
            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p>Weight: ${product.weight}</p>
                    <p class="product-price">₹ ${product.price}</p>
                    <button class="add-to-cart">Add to Cart</button>
                </div>
            `;
            
            productGrid.appendChild(productElement);
        });
    } else {
        productGrid.innerHTML = '<p>No products found.</p>'; // Show message when no products match the search
    }
}

// Function to filter the products based on the search input
function filterProducts() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim().toLowerCase(); // Trim spaces and convert to lowercase

    // Filter products based on the search query
    const filteredProducts = allProducts.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.weight.toLowerCase().includes(query) || 
        product.price.toString().includes(query)
    );

    // Display filtered products
    if (query) {
        // Show grid only if there is a query
        displayProducts(filteredProducts);
    } else {
        // Hide the product grid if search query is empty
        const productGrid = document.getElementById('productGrid');
        productGrid.style.display = 'none';
    }
}

// Event listener for search input
document.getElementById('searchInput').addEventListener('input', function () {
    this.value = this.value.replace(/\s+/g, ' ').trim(); // Replace multiple spaces with a single space and trim
    filterProducts();
});

// Load all products when the page is ready
loadProducts();
