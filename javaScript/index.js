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


