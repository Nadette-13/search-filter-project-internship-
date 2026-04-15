/* ============================================================
   NZIMA FASHION STORE — shop.js
   Features: search, category filter, sort, cart, toast,
             wishlist, navbar scroll effect, skeleton loader,
             URL param category pre-filter
   ============================================================ */

'use strict';

// ── Auth Guard ────────────────────────────────────────────────
(function authGuard() {
    const user = localStorage.getItem('nzima_current_user');
    if (!user) {
        sessionStorage.setItem('nzima_redirect', 'shop.html');
        window.location.href = 'auth.html';
    }
})();

// ── Current User ──────────────────────────────────────────────
const currentUser = JSON.parse(localStorage.getItem('nzima_current_user') || 'null');

function injectUserNav() {
    if (!currentUser) return;
    const actions = document.querySelector('.nav-actions');
    if (!actions) return;

    // Build user pill + logout
    const userPill = document.createElement('div');
    userPill.className = 'user-pill';
    userPill.id = 'userPill';

    const initial = currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U';
    userPill.innerHTML = `
        <div class="user-avatar">${initial}</div>
        <span class="user-name">${currentUser.name.split(' ')[0]}</span>
        <div class="user-dropdown" id="userDropdown">
            <div class="dropdown-header">
                <div class="user-avatar-lg">${initial}</div>
                <div>
                    <div class="dropdown-name">${currentUser.name}</div>
                    <div class="dropdown-email">${currentUser.email}</div>
                </div>
            </div>
            <div class="dropdown-divider"></div>
            <a href="index.html" class="dropdown-item"><i class="fas fa-home"></i> Home</a>
            <button class="dropdown-item logout-item" id="logoutBtn"><i class="fas fa-right-from-bracket"></i> Sign Out</button>
        </div>`;

    // Insert before hamburger
    const hamburger = actions.querySelector('.hamburger');
    actions.insertBefore(userPill, hamburger);

    // Toggle dropdown
    userPill.addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('userDropdown').classList.toggle('open');
    });

    document.addEventListener('click', () => {
        document.getElementById('userDropdown')?.classList.remove('open');
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('nzima_current_user');
        window.location.href = 'auth.html';
    });
}

injectUserNav();


// ── Product Data ─────────────────────────────────────────────
const products = [
    // ─── SHOES ───────────────────────────────────────────────
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
        image: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&q=80",
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
        image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80",
        rating: 4.4,
        reviews: 98
    },
    {
        id: 5,
        name: "New Balance 990v5",
        category: "shoes",
        price: 185,
        originalPrice: 210,
        badge: "sale",
        image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80",
        rating: 4.7,
        reviews: 321
    },
    {
        id: 6,
        name: "Converse Chuck Taylor",
        category: "shoes",
        price: 65,
        originalPrice: null,
        badge: "new",
        image: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=600&q=80",
        rating: 4.5,
        reviews: 456
    },
    {
        id: 7,
        name: "Vans Old Skool",
        category: "shoes",
        price: 70,
        originalPrice: 85,
        badge: "sale",
        image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&q=80",
        rating: 4.6,
        reviews: 389
    },
    {
        id: 8,
        name: "Reebok Classic Leather",
        category: "shoes",
        price: 80,
        originalPrice: null,
        badge: null,
        image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&q=80",
        rating: 4.3,
        reviews: 145
    },

    // ─── CLOTHES ─────────────────────────────────────────────
    {
        id: 9,
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
        id: 10,
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
        id: 11,
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
        id: 12,
        name: "Silk Evening Dress",
        category: "clothes",
        price: 135,
        originalPrice: 180,
        badge: "hot",
        image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80",
        rating: 4.8,
        reviews: 176
    },
    {
        id: 13,
        name: "Ralph Lauren Polo Shirt",
        category: "clothes",
        price: 95,
        originalPrice: null,
        badge: "new",
        image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80",
        rating: 4.6,
        reviews: 267
    },
    {
        id: 14,
        name: "Gucci Floral Blazer",
        category: "clothes",
        price: 450,
        originalPrice: 600,
        badge: "sale",
        image: "https://images.unsplash.com/photo-1507034589631-9433cc6bc453?w=600&q=80",
        rating: 4.9,
        reviews: 88
    },
    {
        id: 15,
        name: "Nike Dri-FIT Tech Fleece",
        category: "clothes",
        price: 110,
        originalPrice: null,
        badge: null,
        image: "https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=600&q=80",
        rating: 4.5,
        reviews: 334
    },
    {
        id: 16,
        name: "Floral Summer Sundress",
        category: "clothes",
        price: 58,
        originalPrice: 80,
        badge: "sale",
        image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80",
        rating: 4.4,
        reviews: 210
    },

    // ─── ACCESSORIES ─────────────────────────────────────────
    {
        id: 17,
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
        id: 18,
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
        id: 19,
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
        id: 20,
        name: "Luxury Leather Watch",
        category: "accessories",
        price: 320,
        originalPrice: 400,
        badge: "hot",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
        rating: 4.9,
        reviews: 445
    },
    {
        id: 21,
        name: "Designer Leather Belt",
        category: "accessories",
        price: 72,
        originalPrice: null,
        badge: "new",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
        rating: 4.4,
        reviews: 156
    },
    {
        id: 22,
        name: "Quilted Crossbody Bag",
        category: "accessories",
        price: 165,
        originalPrice: 220,
        badge: "sale",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80",
        rating: 4.7,
        reviews: 203
    },
    {
        id: 23,
        name: "Crystal Drop Earrings",
        category: "accessories",
        price: 38,
        originalPrice: null,
        badge: null,
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80",
        rating: 4.6,
        reviews: 87
    },
    {
        id: 24,
        name: "Wool Knit Beanie",
        category: "accessories",
        price: 28,
        originalPrice: null,
        badge: "new",
        image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600&q=80",
        rating: 4.3,
        reviews: 134
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
let currentSearch   = "";

// ── DOM References ────────────────────────────────────────────
const productGrid   = document.getElementById("productList");
const searchInput   = document.getElementById("searchInput");
const inlineSearch  = document.getElementById("inlineSearch");
const searchClear   = document.getElementById("searchClear");
const filterBtns    = document.querySelectorAll(".filter-btn");
const sortSelect    = document.getElementById("sortSelect");
const cartBadge     = document.getElementById("cartBadge");
const cartItems_el  = document.getElementById("cartItems");
const cartFooter    = document.getElementById("cartFooter");
const cartTotal_el  = document.getElementById("cartTotal");
const cartSidebar   = document.getElementById("cartSidebar");
const cartBackdrop  = document.getElementById("cartBackdrop");
const productCount  = document.getElementById("productCount");
const navbar        = document.getElementById("navbar");
const hamburger     = document.getElementById("hamburger");
const navLinks      = document.getElementById("navLinks");
const toast         = document.getElementById("toast");
const toastMsg      = document.getElementById("toastMsg");
const searchOverlay = document.getElementById("searchOverlay");

// ─────────────────────────────────────────────────────────────
// RENDER
// ─────────────────────────────────────────────────────────────

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

function buildStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    let html = "";
    for (let i = 0; i < full; i++)  html += "★";
    if (half)                        html += "½";
    for (let i = full + (half ? 1 : 0); i < 5; i++) html += "☆";
    return html;
}

const fmt = (n) => `$${n.toLocaleString()}`;

function renderProducts(items) {
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
                    <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80'">
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

    }, 350);
}

// ─────────────────────────────────────────────────────────────
// FILTERING & SORTING
// ─────────────────────────────────────────────────────────────

function applyFilters() {
    const query = currentSearch.trim().toLowerCase();

    let result = products.filter(p => {
        const matchSearch   = !query ||
                              p.name.toLowerCase().includes(query) ||
                              p.category.toLowerCase().includes(query);
        const matchCategory = currentCategory === "all" || p.category === currentCategory;
        return matchSearch && matchCategory;
    });

    if (currentSort === "price-asc")  result.sort((a, b) => a.price - b.price);
    if (currentSort === "price-desc") result.sort((a, b) => b.price - a.price);
    if (currentSort === "name-asc")   result.sort((a, b) => a.name.localeCompare(b.name));

    renderProducts(result);
}

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

function updateQty(id, delta) {
    const item = cartItems.find(i => i.id === id);
    if (!item) return;
    item.qty = Math.max(1, (item.qty || 1) + delta);
    updateCartUI();
}

function updateCartUI() {
    const total     = cartItems.reduce((sum, i) => sum + i.price * (i.qty || 1), 0);
    const itemCount = cartItems.reduce((sum, i) => sum + (i.qty || 1), 0);

    cartBadge.textContent = itemCount;

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
                <img class="cart-item-img" src="${item.image}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&q=80'">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${fmt(item.price)}</div>
                    <div class="cart-qty-controls">
                        <button class="qty-btn decrease" data-id="${item.id}" aria-label="Decrease quantity">−</button>
                        <span class="qty-val">${item.qty || 1}</span>
                        <button class="qty-btn increase" data-id="${item.id}" aria-label="Increase quantity">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" data-id="${item.id}" title="Remove" aria-label="Remove ${item.name}">
                    <i class="fas fa-times"></i>
                </button>`;
            cartItems_el.appendChild(row);
        });

        cartItems_el.querySelectorAll(".cart-item-remove").forEach(btn => {
            btn.addEventListener("click", () => removeFromCart(Number(btn.dataset.id)));
        });

        cartItems_el.querySelectorAll(".qty-btn.decrease").forEach(btn => {
            btn.addEventListener("click", () => updateQty(Number(btn.dataset.id), -1));
        });

        cartItems_el.querySelectorAll(".qty-btn.increase").forEach(btn => {
            btn.addEventListener("click", () => updateQty(Number(btn.dataset.id), 1));
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

function openCart()  {
    cartOpen = true;
    cartSidebar.classList.add("open");
    cartBackdrop.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeCart() {
    cartOpen = false;
    cartSidebar.classList.remove("open");
    cartBackdrop.classList.remove("active");
    document.body.style.overflow = "";
}

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
// SEARCH BAR TOGGLE (top icon)
// ─────────────────────────────────────────────────────────────

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
// NAVBAR SCROLL
// ─────────────────────────────────────────────────────────────

window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 30);
}, { passive: true });

// ─────────────────────────────────────────────────────────────
// EVENT LISTENERS
// ─────────────────────────────────────────────────────────────

// Search toggle (top icon bar)
document.getElementById("searchToggle").addEventListener("click", () => {
    searchOpen ? closeSearch() : openSearch();
});

// Overlay search input
searchInput.addEventListener("input", () => {
    currentSearch = searchInput.value;
    // Mirror to inline search
    if (inlineSearch) inlineSearch.value = searchInput.value;
    applyFilters();
});

// Inline search input (always visible on shop page)
if (inlineSearch) {
    inlineSearch.addEventListener("input", () => {
        currentSearch = inlineSearch.value;
        // Mirror to overlay search
        searchInput.value = inlineSearch.value;
        applyFilters();
    });
}

searchClear.addEventListener("click", () => {
    searchInput.value = "";
    if (inlineSearch) inlineSearch.value = "";
    currentSearch = "";
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

// Checkout button
document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (cartItems.length === 0) return;
    showToast("Proceeding to checkout… 🛍");
    // Future: redirect to checkout page
});

// Mobile nav
hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    navLinks.classList.toggle("open");
    document.body.style.overflow = navLinks.classList.contains("open") ? "hidden" : "";
});

navLinks.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
        hamburger.classList.remove("open");
        navLinks.classList.remove("open");
        document.body.style.overflow = "";
    });
});

// Keyboard ESC
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeCart();
        closeSearch();
    }
});

// ─────────────────────────────────────────────────────────────
// URL PARAM: pre-select category from landing page links
// ─────────────────────────────────────────────────────────────

function initFromURL() {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("cat");
    if (cat && ["shoes", "clothes", "accessories"].includes(cat)) {
        filterCategory(cat);
    } else {
        renderProducts(products);
    }
}

// ─────────────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────────────
initFromURL();
