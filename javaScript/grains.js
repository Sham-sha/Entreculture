// Fetch JSON data and render products when DOM content is loaded
document.addEventListener("DOMContentLoaded", () => {
    fetch("/data/grains.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch fruits data");
            }
            return response.json();
        })
        .then(data => {
            renderProducts(data); // Call function to render products
        })
        .catch(error => {
            console.error("Error loading fruits data:", error);
        });
});

// Function to render the product list
function renderProducts(data) {
    const productList = document.getElementById("product-list");
    productList.innerHTML = ""; // Clear existing content

    data.forEach(item => {
        const productCard = document.createElement("div");
        productCard.classList.add("card");

        productCard.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>${item.weight}</p>
            <p>₹${item.price}</p>
            <button>Add to Cart</button>
        `;

        productList.appendChild(productCard);
    });
}
