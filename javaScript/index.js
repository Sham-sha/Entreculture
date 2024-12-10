// Fetch the navbar HTML and insert it into the placeholder
document.addEventListener('DOMContentLoaded', () => {
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
});



// Fetch categories from a JSON file
fetch('/data/categories.json')
    .then(response => response.json())
    .then(categories => {
        const categoryContainer = document.getElementById('category-container');
        categories.forEach(category => {
            const categoryCard = document.createElement('div');
            categoryCard.classList.add('category-card');
            categoryCard.innerHTML = `
                <img src="${category.image}" alt="${category.name}">
                <h3>${category.name}</h3>
                <p>${category.description}</p>
            `;

            // Add click event listener
            categoryCard.addEventListener('click', () => {
                // Navigate to a specific page for the category
                window.location.href = `/pages/${category.name.toLowerCase()}.html`;
            });

            categoryContainer.appendChild(categoryCard);
        });
    })
    .catch(error => console.error('Error fetching categories:', error));
