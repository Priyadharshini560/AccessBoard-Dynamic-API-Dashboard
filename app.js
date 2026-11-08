
import { fetchProducts } from "./api.js";

const productContainer = document.getElementById("product-list");
const searchInput = document.getElementById("search-input");
const categoryContainer = document.getElementById("category-tabs");
const sortSelect = document.getElementById("sort-select");
const loading = document.getElementById("loading");
const errorBanner = document.getElementById("error-banner");
const cartCount = document.getElementById("cart-count");

let products = [];
let selectedCategory = "all";
let searchText = "";
let sortOrder = "default";

let cart = JSON.parse(localStorage.getItem("accessboard-cart") || "[]");

// UPDATE CART
function updateCartCount() {
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);

    cartCount.textContent = total;

    localStorage.setItem(
        "accessboard-cart",
        JSON.stringify(cart)
    );
}

// LOADING SKELETON
function showLoading() {
    loading.innerHTML = Array.from(
        { length: 6 },
        () => '<div class="skeleton"></div>'
    ).join("");

    loading.style.display = "grid";
}

function hideLoading() {
    loading.style.display = "none";
}

// ERROR MESSAGE
function showError(message) {
    errorBanner.textContent = message;
    errorBanner.style.display = "block";
}

// FETCH PRODUCTS
async function loadProducts() {
    showLoading();
    errorBanner.style.display = "none";

    try {
        products = await fetchProducts();

        displayCategories();
        displayProducts();

    } catch (error) {
        showError("Unable to load products. Check your internet connection.");
    } finally {
        hideLoading();
    }
}

// DISPLAY CATEGORIES
function displayCategories() {
    const categories = [
        "all",
        ...new Set(products.map(product => product.category))
    ];

    categoryContainer.innerHTML = categories.map(category => `
        <button
            class="category-btn ${selectedCategory === category ? "active" : ""}"
            data-category="${category}">
            ${category === "all" ? "All Products" : category}
        </button>
    `).join("");
}

// FILTER AND SORT PRODUCTS
function getFilteredProducts() {
    let result = products.filter(product => {
        const matchesSearch =
            product.title.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "all" ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    if (sortOrder === "low") {
        result.sort((a, b) => a.price - b.price);
    }

    if (sortOrder === "high") {
        result.sort((a, b) => b.price - a.price);
    }

    if (sortOrder === "name") {
        result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
}

// DISPLAY PRODUCTS
function displayProducts() {
    const filteredProducts = getFilteredProducts();

    if (filteredProducts.length === 0) {
        productContainer.innerHTML = "<p>No products found.</p>";
        return;
    }

    productContainer.innerHTML = filteredProducts.map(product => `
        <article class="product-card">

            <img src="${product.image}" alt="${product.title}" loading="lazy">

            <p>${product.category}</p>

            <h3>${product.title}</h3>

            <p class="product-price">
                $${product.price.toFixed(2)}
            </p>

            <p>⭐ ${product.rating.rate} (${product.rating.count} reviews)</p>

            <button class="add-cart-btn" data-id="${product.id}">
                Add to Cart
            </button>

        </article>
    `).join("");
}

// SEARCH
searchInput.addEventListener("input", event => {
    searchText = event.target.value.toLowerCase().trim();
    displayProducts();
});

// CATEGORY FILTER
categoryContainer.addEventListener("click", event => {
    const button = event.target.closest("[data-category]");

    if (!button) return;

    selectedCategory = button.dataset.category;

    displayCategories();
    displayProducts();
});

// SORTING
sortSelect.addEventListener("change", event => {
    sortOrder = event.target.value;
    displayProducts();
});

// ADD TO CART
productContainer.addEventListener("click", event => {
    const button = event.target.closest(".add-cart-btn");

    if (!button) return;

    const productId = Number(button.dataset.id);

    const existingItem = cart.find(
        item => item.id === productId
    );

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: productId,
            quantity: 1
        });
    }

    updateCartCount();

    button.textContent = "Added!";

    setTimeout(() => {
        button.textContent = "Add to Cart";
    }, 1000);
});

// INITIALIZE
updateCartCount();
loadProducts();
