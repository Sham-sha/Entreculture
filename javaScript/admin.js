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

// Prevent form submission on Enter key
form.addEventListener('keydown', function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
    }
});

// Event listener for form submission
submitButton.addEventListener('click', handleFormSubmit);

// Event listener for deleting selected products
deleteSelectedBtn.addEventListener('click', handleDeleteSelected);


// Fetch and display products
function fetchProducts() {
    const productsRef = ref(database, 'products');

    onValue(productsRef, function (snapshot) {
        const products = snapshot.val();
        productList.innerHTML = '';

        if (products) {
            for (let key in products) {
                const product = products[key];
                const li = document.createElement('li');
                li.innerHTML = `
                    <input type="checkbox" class="productCheckbox" data-id="${key}">
                    <img src="${product.imageUrl}" alt="${product.name}" style="width: 50px; height: 50px;">
                    ${product.name} - ${product.category} - $${product.price}
                    <button class="editBtn" data-id="${key}">Edit</button>
                `;
                productList.appendChild(li);
            }

            // Add click events to edit buttons
            const editButtons = document.querySelectorAll('.editBtn');
            editButtons.forEach(function (button) {
                button.addEventListener('click', handleEdit);
            });
        }
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
        updateProduct(productName, imageUrl, category, price);
    } else {
        addProduct(productName, imageUrl, category, price);
    }
}

// Add a new product
function addProduct(name, imageUrl, category, price) {
    const productRef = push(ref(database, 'products'));

    set(productRef, {
        name: name,
        imageUrl: imageUrl,
        category: category,
        price: price
    }).then(function () {
        alert('Product added successfully!');
        form.reset();
        fetchProducts();
    }).catch(function (error) {
        console.error("Error adding product: ", error);
    });
}

// Update an existing product
function updateProduct(name, imageUrl, category, price) {
    const productRef = ref(database, `products/${editingProductId}`);

    update(productRef, {
        name: name,
        imageUrl: imageUrl,
        category: category,
        price: price
    }).then(function () {
        alert('Product updated successfully!');
        form.reset();
        isEditing = false;
        editingProductId = null;
        submitButton.textContent = "Add Product";
        fetchProducts();
    }).catch(function (error) {
        console.error("Error updating product: ", error);
    });
}

// Handle editing a product
function handleEdit(event) {
    const productId = event.target.getAttribute('data-id');
    const productRef = ref(database, `products/${productId}`);

    onValue(productRef, function (getProduct) {
        if (getProduct.exists()) {
            const product = getProduct.val();
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

    selectedCheckboxes.forEach(function (checkbox) {
        const productId = checkbox.getAttribute('data-id');
        const productRef = ref(database, `products/${productId}`);

        remove(productRef).then(function () {
            alert(`Product deleted successfully!`);
            fetchProducts();
        }).catch(function (error) {
            console.error("Error deleting product: ", error);
        });
    });
}

// Fetch products on page load
fetchProducts();
