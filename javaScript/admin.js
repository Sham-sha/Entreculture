// Import Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, push, set, remove, update, get } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAhx3Qp8Qg23w6bWkcsWYrXtlg46I7_1PA",
    authDomain: "entreculture-project.firebaseapp.com",
    databaseURL: "https://entreculture-project-default-rtdb.firebaseio.com",
    projectId: "entreculture-project",
    appId: "1:26756746313:web:899812d4cad707d232c398",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// DOM elements
const formElement = document.getElementById('productForm');
const submitButton = document.getElementById('submitBtn');
const productListElement = document.getElementById('productList');
const deleteSelectedButton = document.getElementById('deleteSelectedBtn');

// Variables to manage editing state
let isEditing = false;
let editingProductId = null;

// Event listener for form submission
submitButton.addEventListener('click', handleFormSubmit);

// Event listener for deleting selected products
deleteSelectedButton.addEventListener('click', handleDeleteSelected);

// Fetch and display products from the database
function fetchProducts() {
    const productsRef = ref(database, 'products');

    get(productsRef).then((snapshot) => {
        const products = snapshot.val();
        productListElement.innerHTML = '';
        

        if (products) {
            Object.keys(products).forEach((productId) => {
                const product = products[productId];
                console.table(product)

                // Create a list item for each product
                const productItem = document.createElement('li');
                productItem.innerHTML = `
                    <input type="checkbox" class="productCheckbox" data-id="${productId}">
                    <img src="${product.imageUrl}" alt="${product.name}" style="width: 50px; height: 50px;">
                    ${product.name} - ${product.category} - ₹${product.price}
                    <button class="editButton" data-id="${productId}">Edit</button>
                `;

                productListElement.appendChild(productItem);
            });

            // Add click events to edit buttons
            const editButtons = document.querySelectorAll('.editButton');
            editButtons.forEach((button) => {
                button.addEventListener('click', handleEdit);
            });
        } else {
            productListElement.innerHTML = '<p>No products found.</p>';
        }
    }).catch((error) => {
        console.error('Error fetching products:', error);
    });
}

// Handle form submission for adding or updating products
function handleFormSubmit(event) {
    event.preventDefault();

    // Get form input values
    const productName = document.getElementById('productName').value;
    const imageUrl = document.getElementById('imageUrl').value;
    const category = document.getElementById('category').value;
    const price = parseFloat(document.getElementById('price').value);

    // Validate input fields
    if (!productName || !imageUrl || !category || isNaN(price)) {
        alert("Please fill all fields correctly!");
        return;
    }

    if (isEditing) {
        updateProductInDatabase(productName, imageUrl, category, price);
    } else {
        addProductToDatabase(productName, imageUrl, category, price);
    }
}

// Add a new product to the database
function addProductToDatabase(name, imageUrl, category, price) {
    const newProductRef = push(ref(database, 'products'));

    set(newProductRef, {
        name: name,
        imageUrl: imageUrl,
        category: category,
        price: price
    }).then(() => {
        alert('Product added successfully!');
        formElement.reset();
        fetchProducts();
    }).catch((error) => {
        console.error("Error adding product:", error);
    });
}

// Update an existing product in the database
function updateProductInDatabase(name, imageUrl, category, price) {
    const productRef = ref(database, `products/${editingProductId}`);

    update(productRef, {
        name: name,
        imageUrl: imageUrl,
        category: category,
        price: price
    }).then(() => {
        alert('Product updated successfully!');
        formElement.reset();
        isEditing = false;
        editingProductId = null;
        submitButton.textContent = "Add Product";
        fetchProducts();
    }).catch((error) => {
        console.error("Error updating product:", error);
    });
}

// Handle editing a product
function handleEdit(event) {
    const productId = event.target.getAttribute('data-id');
    const productRef = ref(database, `products/${productId}`);

    get(productRef).then((snapshot) => {
        if (snapshot.exists()) {
            const product = snapshot.val();

            // Populate the form with product details
            document.getElementById('productName').value = product.name;
            document.getElementById('imageUrl').value = product.imageUrl;
            document.getElementById('category').value = product.category;
            document.getElementById('price').value = product.price;

            isEditing = true;
            editingProductId = productId;
            submitButton.textContent = "Update Product";
        }
    }).catch((error) => {
        console.error("Error fetching product details:", error);
    });
}

// Handle deleting selected products
function handleDeleteSelected() {
    const selectedCheckboxes = document.querySelectorAll('.productCheckbox:checked');

    if (selectedCheckboxes.length === 0) {
        alert("Please select at least one product to delete.");
        return;
    }

    selectedCheckboxes.forEach((checkbox) => {
        const productId = checkbox.getAttribute('data-id');
        const productRef = ref(database, `products/${productId}`);

        remove(productRef).then(() => {
            console.log(`Product ${productId} deleted successfully.`);
            fetchProducts();
        }).catch((error) => {
            console.error("Error deleting product:", error);
        });
    });
}

// Fetch products on page load
fetchProducts();
