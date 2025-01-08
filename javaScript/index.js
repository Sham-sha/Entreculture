// Run this code only after the HTML document is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    const ctaButton = document.querySelector('.cta-button');

    // Add a smooth scroll effect when the CTA button is clicked
    if (ctaButton) {
        ctaButton.addEventListener('click', function () {
            const categoriesSection = document.getElementById('categories');
            if (categoriesSection) {
                categoriesSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Fetch and display category data
    fetchCategories();
});

// Fetch category data from a JSON file
function fetchCategories() {
    fetch('../data/categories.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load categories'); // Handle fetch errors
            }
            return response.json();
        })
        .then(categories => {
            displayCategories(categories); // Pass the fetched data to be displayed
        })
        .catch(error => {
            console.error('Error:', error); // Log errors for debugging
        });
}

// Display fetched categories dynamically
function displayCategories(categories) {
    const categoryContainer = document.getElementById('category-container');

    if (categoryContainer) {
        categoryContainer.innerHTML = ''; // Clear existing content
        categories.forEach(category => {
            const card = createCategoryCard(category); // Create a card for each category
            categoryContainer.appendChild(card); // Add the card to the container
        });
    }
}

// Create a category card with the given data
function createCategoryCard(category) {
    const card = document.createElement('div');
    card.className = 'category-card';

    // Add image, title, and description to the card
    card.innerHTML = `
        <img src="${category.image}" alt="${category.name}">
        <div class="category-card-content">
            <h3>${category.name}</h3>
            <p>${category.description}</p>
        </div>
    `;

    // Redirect to the category-specific page when the card is clicked
    card.addEventListener('click', function () {
        window.location.href = `/pages/${category.name.toLowerCase()}.html`;
    });

    return card; // Return the created card
}
