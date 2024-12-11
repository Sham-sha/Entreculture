// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Fetch the navbar HTML and insert it into the placeholder
    const navbarPlaceholder = document.getElementById('navbar-placeholder');

    fetch('/pages/navbar.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            navbarPlaceholder.innerHTML = data;

            // Add event listeners to the navbar links for navigation
            const home = document.getElementById('home');
            const search = document.getElementById('search');
            const cart = document.getElementById('cart');
            const login = document.getElementById('login');

            if (home) {
                home.addEventListener('click', () => {
                    window.location.href = '/index.html'; // Adjust path as needed
                });
            }

            if (search) {
                search.addEventListener('click', () => {
                    window.location.href = '/pages/search.html'; // Adjust path as needed
                });
            }

            if (login) {
                login.addEventListener('click', () => {
                    window.location.href = '/pages/login.html'; // Adjust path as needed
                });
            }

            if (cart) {
                cart.addEventListener('click', () => {
                    window.location.href = '/pages/cart.html'; // Adjust path as needed
                });
            }

            console.log('Navbar loaded successfully.');
        })
        .catch(error => {
            console.error('Error loading the navbar:', error);
        });

    // Add click handler for CTA button (smooth scrolling to categories section)
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function () {
            // Scroll to categories section
            document.getElementById('categories').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    // Load categories after fetching the JSON
    fetchCategories();
});

// Function to fetch categories from a JSON file
function fetchCategories() {
    fetch('../data/categories.json')
        .then(response => {
            // Check if the response is valid (HTTP status 200)
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(categories => {
            console.log('Categories loaded:', categories); // Log the categories data
            loadCategories(categories); // Call loadCategories function with the fetched data
        })
        .catch(error => {
            console.error('Error fetching categories:', error); // Log the error if fetch fails
        });
}

// Function to load categories into the page
function loadCategories(categories) {
    const categoryContainer = document.getElementById('category-container');
    
    // Clear existing categories before adding new ones
    categoryContainer.innerHTML = '';
    
    // Add each category dynamically
    categories.forEach(category => {
        const categoryCard = createCategoryCard(category);
        categoryContainer.appendChild(categoryCard);
    });
}

// Function to create a category card dynamically
function createCategoryCard(category) {
    const card = document.createElement('div');
    card.className = 'category-card';
    card.innerHTML = `
        <img src="${category.image}" alt="${category.name}">
        <div class="category-card-content">
            <h3>${category.name}</h3>
            <p>${category.description}</p>
        </div>
    `;

    // Add click handler for category card
    card.addEventListener('click', function () {
        // Navigate to a specific page for the category
        window.location.href = `/pages/${category.name.toLowerCase()}.html`; 
    });

    return card;
}
