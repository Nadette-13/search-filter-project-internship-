/* ============================================================
   NZIMA FASHION STORE — script.js
   Features: search, category filter, sort, cart, toast,
             wishlist, navbar scroll effect, skeleton loader
   ============================================================ */

'use strict';

// ── Product Data ─────────────────────────────────────────────
const products = [
    // SHOES
    {
        id: 1,
        name: "Nike Air Max 270",
        category: "shoes",
        price: 120,
        originalPrice: 150,
        badge: "hot",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
        rating: 4.8,
        reviews: 234
    },
    {
        id: 2,
        name: "Adidas Ultraboost 22",
        category: "shoes",
        price: 110,
        originalPrice: null,
        badge: "new",
        image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80",
        rating: 4.6,
        reviews: 187
    },
    {
        id: 3,
        name: "Jordan 1 High OG",
        category: "shoes",
        price: 175,
        originalPrice: 200,
        badge: "sale",
        image: "https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?w=600&q=80",
        rating: 4.9,
        reviews: 512
    },
    {
        id: 4,
        name: "Puma Suede Classic",
        category: "shoes",
        price: 75,
        originalPrice: null,
        badge: null,
        image: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&q=80",
        rating: 4.4,
        reviews: 98
    },

    // CLOTHES
    {
        id: 5,
        name: "Zara Leather Bomber Jacket",
        category: "clothes",
        price: 80,
        originalPrice: 120,
        badge: "sale",
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
        rating: 4.7,
        reviews: 142
    },
    {
        id: 6,
        name: "H&M Oversized Hoodie",
        category: "clothes",
        price: 45,
        originalPrice: null,
        badge: "new",
        image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80",
        rating: 4.5,
        reviews: 203
    },
    {
        id: 7,
        name: "Levi's 501 Original Jeans",
        category: "clothes",
        price: 89,
        originalPrice: null,
        badge: null,
        image: "https://images.unsplash.com/photo-1604176424472-9d7914db1032?w=600&q=80",
        rating: 4.6,
        reviews: 389
    },
    {
        id: 8,
        name: "Silk Evening Dress",
        category: "clothes",
        price: 135,
        originalPrice: 180,
        badge: "hot",
        image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80",
        rating: 4.8,
        reviews: 176
    },

    // ACCESSORIES
    {
        id: 9,
        name: "Louis Vuitton Tote Bag",
        category: "accessories",
        price: 250,
        originalPrice: null,
        badge: "new",
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
        rating: 4.9,
        reviews: 67
    },
    {
        id: 10,
        name: "Ray-Ban Aviator Sunglasses",
        category: "accessories",
        price: 95,
        originalPrice: 130,
        badge: "sale",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80",
        rating: 4.7,
        reviews: 298
    },
    {
        id: 11,
        name: "Gold Chain Necklace",
        category: "accessories",
        price: 55,
        originalPrice: null,
        badge: null,
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80",
        rating: 4.5,
        reviews: 114
    },
    {
        id: 12,
        name: "Luxury Leather Watch",
        category: "accessories",
        price: 320,
        originalPrice: 400,
        badge: "hot",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
        rating: 4.9,
        reviews: 445
    }
];

// ── State ────────────────────────────────────────────────────
let currentCategory = "all";
let currentSort     = "default";
let cartItems       = [];
let wishlist        = new Set();
let searchOpen      = false;
let cartOpen        = false;
let toastTimer      = null;

// ── DOM References ────────────────────────────────────────────
const productGrid  = document.getElementById("productList");
const searchInput  = document.getElementById("searchInput");
const searchClear  = document.getElementById("searchClear");
const filterBtns   = document.querySelectorAll(".filter-btn");
const sortSelect   = document.getElementById("sortSelect");
const cartBadge    = document.getElementById("cartBadge");
const cartItems_el = document.getElementById("cartItems");
const cartFooter   = document.getElementById("cartFooter");
const cartTotal_el = document.getElementById("cartTotal");
const cartSidebar  = document.getElementById("cartSidebar");
const cartBackdrop = document.getElementById("cartBackdrop");
const productCount = document.getElementById("productCount");
const navbar       = document.getElementById("navbar");
const hamburger    = document.getElementById("hamburger");
const navLinks     = document.getElementById("navLinks");
const toast        = document.getElementById("toast");
const toastMsg     = document.getElementById("toastMsg");

// ─────────────────────────────────────────────────────────────
// RENDER
// ─────────────────────────────────────────────────────────────

/** Show skeleton cards during loading animation */
function showSkeletons(count = 4) {
    productGrid.innerHTML = "";
    for (let i = 0; i < count; i++) {
        productGrid.innerHTML += `
            <div class="skeleton-card">
                <div class="skel-img"></div>
                <div class="skel-body">
                    <div class="skel-line short"></div>
                    <div class="skel-line"></div>
                    <div class="skel-line short"></div>
                </div>
            </div>`;
    }
}

/** Build star HTML for a given rating */
function buildStars(rating) {
    const full  = Math.floor(rating);
    const half  = rating % 1 >= 0.5;
    let html = "";
    for (let i = 0; i < full; i++)  html += "★";
    if (half)                        html += "½";
    for (let i = full + (half ? 1 : 0); i < 5; i++) html += "☆";
    return html;
}

/** Format price as $X */
const fmt = (n) => `$${n.toLocaleString()}`;

/** Render a list of product objects into the grid */
function renderProducts(items) {
    // Update count label
    productCount.textContent = items.length;

    showSkeletons(Math.min(items.length || 4, 8));

    setTimeout(() => {
        productGrid.innerHTML = "";

        if (items.length === 0) {
            productGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>No products found</h3>
                    <p>Try adjusting your search or filter.</p>
                </div>`;
            return;
        }

        items.forEach((p) => {
            const card = document.createElement("div");
            card.className = "product-card";
            card.setAttribute("data-id", p.id);

            const badgeHTML = p.badge
                ? `<span class="card-badge badge-${p.badge}">${p.badge}</span>`
                : "";

            const originalHTML = p.originalPrice
                ? `<span class="price-original">${fmt(p.originalPrice)}</span>`
                : "";

            const wishlisted = wishlist.has(p.id) ? "active" : "";

            card.innerHTML = `
                <div class="card-img-wrap">
                    ${badgeHTML}
                    <button class="wishlist-btn ${wishlisted}" data-id="${p.id}" title="Wishlist" aria-label="Add to wishlist">
                        <i class="fa${wishlist.has(p.id) ? 's' : 'r'} fa-heart"></i>
                    </button>
                    <img src="${p.image}" alt="${p.name}" loading="lazy">
                </div>
                <div class="card-body">
                    <span class="card-category">${p.category}</span>
                    <h3 class="card-name">${p.name}</h3>
                    <div class="card-rating">
                        <span class="stars">${buildStars(p.rating)}</span>
                        <span class="rating-count">(${p.reviews})</span>
                    </div>
                </div>
                <div class="card-footer">
                    <div class="card-price">
                        <span class="price-current">${fmt(p.price)}</span>
                        ${originalHTML}
                    </div>
                    <button class="add-to-cart-btn" data-id="${p.id}" aria-label="Add ${p.name} to cart">
                        <i class="fas fa-bag-shopping"></i> Add
                    </button>
                </div>`;

            productGrid.appendChild(card);
        });

        // Bind card events
        productGrid.querySelectorAll(".add-to-cart-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                addToCart(Number(btn.dataset.id));
            });
        });

        productGrid.querySelectorAll(".wishlist-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                toggleWishlist(btn, Number(btn.dataset.id));
            });
        });

    }, 450);
}

// ─────────────────────────────────────────────────────────────
// FILTERING & SORTING
// ─────────────────────────────────────────────────────────────

function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();

    let result = products.filter(p => {
        const matchSearch   = p.name.toLowerCase().includes(query) ||
                              p.category.toLowerCase().includes(query);
        const matchCategory = currentCategory === "all" || p.category === currentCategory;
        return matchSearch && matchCategory;
    });

    // Sort
    if (currentSort === "price-asc")  result.sort((a, b) => a.price - b.price);
    if (currentSort === "price-desc") result.sort((a, b) => b.price - a.price);
    if (currentSort === "name-asc")   result.sort((a, b) => a.name.localeCompare(b.name));

    renderProducts(result);
}

/** Filter by category pill */
function filterCategory(category) {
    currentCategory = category;
    filterBtns.forEach(b => b.classList.remove("active"));
    document.getElementById(`filter-${category}`)?.classList.add("active");
    applyFilters();
}

// ─────────────────────────────────────────────────────────────
// CART
// ─────────────────────────────────────────────────────────────

function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const existing = cartItems.find(i => i.id === id);
    if (existing) {
        existing.qty = (existing.qty || 1) + 1;
    } else {
        cartItems.push({ ...product, qty: 1 });
    }

    updateCartUI();
    showToast(`"${product.name}" added to cart!`);
    bumpBadge();
}

function removeFromCart(id) {
    cartItems = cartItems.filter(i => i.id !== id);
    updateCartUI();
}

function updateCartUI() {
    const total = cartItems.reduce((sum, i) => sum + i.price * (i.qty || 1), 0);
    const itemCount = cartItems.reduce((sum, i) => sum + (i.qty || 1), 0);

    // Badge
    cartBadge.textContent = itemCount;

    // Sidebar items
    if (cartItems.length === 0) {
        cartItems_el.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-bag fa-3x"></i>
                <p>Your cart is empty</p>
                <span>Add some items to get started!</span>
            </div>`;
        cartFooter.style.display = "none";
    } else {
        cartItems_el.innerHTML = "";
        cartItems.forEach(item => {
            const row = document.createElement("div");
            row.className = "cart-item";
            row.innerHTML = `
                <img class="cart-item-img" src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${fmt(item.price)} × ${item.qty || 1}</div>
                </div>
                <button class="cart-item-remove" data-id="${item.id}" title="Remove" aria-label="Remove ${item.name}">
                    <i class="fas fa-times"></i>
                </button>`;
            cartItems_el.appendChild(row);
        });

        // Bind remove buttons
        cartItems_el.querySelectorAll(".cart-item-remove").forEach(btn => {
            btn.addEventListener("click", () => removeFromCart(Number(btn.dataset.id)));
        });

        cartFooter.style.display = "flex";
        cartTotal_el.textContent = fmt(total);
    }
}

function bumpBadge() {
    cartBadge.classList.remove("bump");
    requestAnimationFrame(() => {
        cartBadge.classList.add("bump");
        setTimeout(() => cartBadge.classList.remove("bump"), 300);
    });
}

function openCart()  { cartOpen = true;  cartSidebar.classList.add("open");  cartBackdrop.classList.add("active"); document.body.style.overflow = "hidden"; }
function closeCart() { cartOpen = false; cartSidebar.classList.remove("open"); cartBackdrop.classList.remove("active"); document.body.style.overflow = ""; }

// ─────────────────────────────────────────────────────────────
// WISHLIST
// ─────────────────────────────────────────────────────────────

function toggleWishlist(btn, id) {
    if (wishlist.has(id)) {
        wishlist.delete(id);
        btn.classList.remove("active");
        btn.innerHTML = `<i class="far fa-heart"></i>`;
        showToast("Removed from wishlist");
    } else {
        wishlist.add(id);
        btn.classList.add("active");
        btn.innerHTML = `<i class="fas fa-heart"></i>`;
        showToast("Added to wishlist ♥");
    }
}

// ─────────────────────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────────────────────

function showToast(message) {
    clearTimeout(toastTimer);
    toastMsg.textContent = message;
    toast.classList.add("show");
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}

// ─────────────────────────────────────────────────────────────
// SEARCH BAR TOGGLE
// ─────────────────────────────────────────────────────────────

const searchOverlay = document.getElementById("searchOverlay");

function openSearch() {
    searchOpen = true;
    searchOverlay.classList.add("open");
    setTimeout(() => searchInput.focus(), 200);
}

function closeSearch() {
    searchOpen = false;
    searchOverlay.classList.remove("open");
}

// ─────────────────────────────────────────────────────────────
// NAVBAR SCROLL EFFECT
// ─────────────────────────────────────────────────────────────

window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 30);
}, { passive: true });

// ─────────────────────────────────────────────────────────────
// EVENT LISTENERS
// ─────────────────────────────────────────────────────────────

// Search
document.getElementById("searchToggle").addEventListener("click", () => {
    searchOpen ? closeSearch() : openSearch();
});

searchInput.addEventListener("input", applyFilters);

searchClear.addEventListener("click", () => {
    searchInput.value = "";
    closeSearch();
    applyFilters();
});

searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSearch();
});

// Category filters
filterBtns.forEach(btn => {
    btn.addEventListener("click", () => filterCategory(btn.dataset.category));
});

// Sort
sortSelect.addEventListener("change", () => {
    currentSort = sortSelect.value;
    applyFilters();
});

// Cart
document.getElementById("cartToggle").addEventListener("click", () => {
    cartOpen ? closeCart() : openCart();
});
document.getElementById("cartClose").addEventListener("click", closeCart);
cartBackdrop.addEventListener("click", closeCart);

// Mobile nav
hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    navLinks.classList.toggle("open");
    document.body.style.overflow = navLinks.classList.contains("open") ? "hidden" : "";
});

// Close mobile nav when a link is clicked
navLinks.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
        hamburger.classList.remove("open");
        navLinks.classList.remove("open");
        document.body.style.overflow = "";
    });
});

// Keyboard ESC to close cart
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeCart();
        closeSearch();
    }
});

// ─────────────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────────────
renderProducts(products);