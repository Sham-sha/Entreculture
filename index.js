// Toggle the navbar menu visibility
const hamburgerMenu = document.getElementById("hamburgerMenu");
const navbarLinks = document.getElementById("navbarLinks");

hamburgerMenu.addEventListener("click", () => {
  navbarLinks.classList.toggle("active");
});

// Category data and rendering (you can use this code for categories)
const categoriesData = [
  { name: "Fruits", image: "path_to_fruit_image.jpg" },
  { name: "Vegetables", image: "path_to_vegetable_image.jpg" },
  { name: "Grains", image: "path_to_grain_image.jpg" },
  { name: "Flours", image: "path_to_flour_image.jpg" },
  { name: "Flowers", image: "path_to_flower_image.jpg" }
];

document.addEventListener("DOMContentLoaded", () => {
  const categoriesContainer = document.getElementById("categories");

  categoriesData.forEach(category => {
    const categoryCard = document.createElement("div");
    categoryCard.classList.add("category-card");

    const img = document.createElement("img");
    img.src = category.image;
    img.alt = `${category.name} image`;

    const title = document.createElement("h3");
    title.innerText = category.name;

    categoryCard.appendChild(img);
    categoryCard.appendChild(title);
    categoriesContainer.appendChild(categoryCard);
  });
});
