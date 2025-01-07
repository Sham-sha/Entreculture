// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
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
