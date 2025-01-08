// Import Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, push, set, remove, update, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

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
const form = document.getElementById('productForm');
const submitButton = document.getElementById('submitBtn');
const productList = document.getElementById('productList');
const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');

// State variables for editing
let isEditing = false;
let editingProductId = null;

// Utility function to reset the form
function resetForm() {
    form.reset();
    isEditing = false;
    editingProductId = null;
    submitButton.textContent = "Upload Product";
}

// Utility function to validate form inputs
function validateInputs(productName, imageUrl, category, price) {
    if (!productName || !imageUrl || !category || isNaN(price)) {
        alert("Please fill all fields correctly!");
        return false;
    }
    return true;
}

// Fetch and display products
function fetchProducts() {
    const productsRef = ref(database, 'products');

    onValue(productsRef, (snapshot) => {
        const products = snapshot.val();
        productList.innerHTML = '';

        if (products) {
            Object.keys(products).forEach((key) => {
                const product = products[key];

                // Create a list item for each product
                const li = document.createElement('li');
                li.innerHTML = `
                    <input type="checkbox" class="productCheckbox" data-id="${key}">
                    <img src="${product.imageUrl}" alt="${product.name}" style="width: 50px; height: 50px;">
                    ${product.name} - ${product.category} - ₹${product.price.toFixed(2)}
                    <button class="editBtn" data-id="${key}">Edit</button>
                `;
                productList.appendChild(li);
            });

            // Attach click events to edit buttons
            document.querySelectorAll('.editBtn').forEach((button) => {
                button.addEventListener('click', handleEdit);
            });
        }
    });
}

// Add a new product
function addProduct(name, imageUrl, category, price) {
    const productRef = push(ref(database, 'products'));

    set(productRef, { name, imageUrl, category, price })
        .then(() => {
            alert('Product added successfully!');
            resetForm();
        })
        .catch((error) => {
            console.error("Error adding product:", error);
        });
}

// Update an existing product
function updateProduct(name, imageUrl, category, price) {
    const productRef = ref(database, `products/${editingProductId}`);

    update(productRef, { name, imageUrl, category, price })
        .then(() => {
            alert('Product updated successfully!');
            resetForm();
        })
        .catch((error) => {
            console.error("Error updating product:", error);
        });
}

// Handle form submission
function handleFormSubmit(event) {
    event.preventDefault();

    // Get form input values
    const productName = document.getElementById('productName').value;
    const imageUrl = document.getElementById('imageUrl').value;
    const category = document.getElementById('category').value;
    const price = parseFloat(document.getElementById('price').value);

    // Validate inputs
    if (!validateInputs(productName, imageUrl, category, price)) return;

    isEditing ? updateProduct(productName, imageUrl, category, price) : addProduct(productName, imageUrl, category, price);
}

// Handle editing a product
function handleEdit(event) {
    const productId = event.target.getAttribute('data-id');
    const productRef = ref(database, `products/${productId}`);

    onValue(productRef, (snapshot) => {
        if (snapshot.exists()) {
            const product = snapshot.val();
            document.getElementById('productName').value = product.name;
            document.getElementById('imageUrl').value = product.imageUrl;
            document.getElementById('category').value = product.category;
            document.getElementById('price').value = product.price;

            isEditing = true;
            editingProductId = productId;
            submitButton.textContent = "Update Product";
        }
    }, { onlyOnce: true });
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

        remove(productRef)
            .then(() => {
                alert(`Product deleted successfully!`);
            })
            .catch((error) => {
                console.error("Error deleting product:", error);
            });
    });
}

// Initialize the app
function init() {
    form.addEventListener('keydown', (event) => {
        if (event.key === "Enter") event.preventDefault();
    });
    submitButton.addEventListener('click', handleFormSubmit);
    deleteSelectedBtn.addEventListener('click', handleDeleteSelected);

    fetchProducts();
}

// Start the app
init();
