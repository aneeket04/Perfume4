function buildPerfumeImage(id) {
  // Use optimized local files for faster load on GitHub Pages.
  const safeId = String(id).padStart(2, "0");
  return `assets/images/${safeId}.optimized.jpg`;
}

function buildFallbackImage(name) {
  const safeName = encodeURIComponent(name);
  return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='640' height='640'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%231d1d27'/><stop offset='100%' stop-color='%230f0f14'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g)'/><text x='50%' y='46%' dominant-baseline='middle' text-anchor='middle' font-family='Segoe UI, Arial, sans-serif' font-size='34' fill='%23e0b15f'>Image Missing</text><text x='50%' y='56%' dominant-baseline='middle' text-anchor='middle' font-family='Segoe UI, Arial, sans-serif' font-size='22' fill='%23f5f5f8'>${safeName}</text><text x='50%' y='64%' dominant-baseline='middle' text-anchor='middle' font-family='Segoe UI, Arial, sans-serif' font-size='16' fill='%23bfc3d1'>Upload assets/images/${safeName}.jpg</text></svg>`;
}

function getSafeProductImage(product) {
  return product.image || buildPerfumeImage(product.id);
}

const perfumes = [
  // Designer perfumes (10)
  { id: 1, name: "Dior Sauvage", category: "Designer", gender: "Men", price: 129, image: buildPerfumeImage(1) },
  { id: 2, name: "Chanel Bleu de Chanel", category: "Designer", gender: "Men", price: 135, image: buildPerfumeImage(2) },
  { id: 3, name: "YSL Libre", category: "Designer", gender: "Women", price: 118, image: buildPerfumeImage(3) },
  { id: 4, name: "Gucci Bloom", category: "Designer", gender: "Women", price: 112, image: buildPerfumeImage(4) },
  { id: 5, name: "Armani Acqua di Gio", category: "Designer", gender: "Men", price: 120, image: buildPerfumeImage(5) },
  { id: 6, name: "Prada Paradoxe", category: "Designer", gender: "Women", price: 124, image: buildPerfumeImage(6) },
  { id: 7, name: "Versace Eros", category: "Designer", gender: "Men", price: 110, image: buildPerfumeImage(7) },
  { id: 8, name: "Lancôme La Vie Est Belle", category: "Designer", gender: "Women", price: 122, image: buildPerfumeImage(8) },
  { id: 9, name: "Tom Ford Black Orchid", category: "Designer", gender: "Unisex", price: 149, image: buildPerfumeImage(9) },
  { id: 10, name: "Givenchy Gentleman", category: "Designer", gender: "Men", price: 108, image: buildPerfumeImage(10) },

  // Niche perfumes (10)
  { id: 11, name: "Creed Aventus", category: "Niche", gender: "Men", price: 310, image: buildPerfumeImage(11) },
  { id: 12, name: "Maison Francis Kurkdjian Baccarat Rouge 540", category: "Niche", gender: "Unisex", price: 355, image: buildPerfumeImage(12) },
  { id: 13, name: "Byredo Gypsy Water", category: "Niche", gender: "Unisex", price: 265, image: buildPerfumeImage(13) },
  { id: 14, name: "Le Labo Santal 33", category: "Niche", gender: "Unisex", price: 289, image: buildPerfumeImage(14) },
  { id: 15, name: "Amouage Reflection Woman", category: "Niche", gender: "Women", price: 295, image: buildPerfumeImage(15) },
  { id: 16, name: "Frederic Malle Portrait of a Lady", category: "Niche", gender: "Women", price: 320, image: buildPerfumeImage(16) },
  { id: 17, name: "Xerjoff Naxos", category: "Niche", gender: "Men", price: 275, image: buildPerfumeImage(17) },
  { id: 18, name: "Roja Parfums Elysium", category: "Niche", gender: "Men", price: 335, image: buildPerfumeImage(18) },
  { id: 19, name: "Parfums de Marly Delina", category: "Niche", gender: "Women", price: 300, image: buildPerfumeImage(19) },
  { id: 20, name: "Diptyque Tam Dao", category: "Niche", gender: "Unisex", price: 210, image: buildPerfumeImage(20) },

  // Middle Eastern fragrances (10)
  { id: 21, name: "Lattafa Khamrah", category: "Middle Eastern", gender: "Unisex", price: 59, image: buildPerfumeImage(21) },
  { id: 22, name: "Rasasi Hawas", category: "Middle Eastern", gender: "Men", price: 68, image: buildPerfumeImage(22) },
  { id: 23, name: "Ajmal Aristocrat", category: "Middle Eastern", gender: "Women", price: 72, image: buildPerfumeImage(23) },
  { id: 24, name: "Afnan 9PM", category: "Middle Eastern", gender: "Men", price: 65, image: buildPerfumeImage(24) },
  { id: 25, name: "Swiss Arabian Shaghaf Oud", category: "Middle Eastern", gender: "Unisex", price: 78, image: buildPerfumeImage(25) },
  { id: 26, name: "Armaf Club de Nuit Intense", category: "Middle Eastern", gender: "Men", price: 70, image: buildPerfumeImage(26) },
  { id: 27, name: "Nabeel Touch Me", category: "Middle Eastern", gender: "Women", price: 55, image: buildPerfumeImage(27) },
  { id: 28, name: "Al Haramain Amber Oud Gold", category: "Middle Eastern", gender: "Unisex", price: 85, image: buildPerfumeImage(28) },
  { id: 29, name: "Mancera Instant Crush", category: "Middle Eastern", gender: "Unisex", price: 145, image: buildPerfumeImage(29) },
  { id: 30, name: "Lattafa Yara", category: "Middle Eastern", gender: "Women", price: 52, image: buildPerfumeImage(30) }
];

const CART_KEY = "aromaVaultCart";

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(productId) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: productId, qty: 1 });
  }
  saveCart(cart);
  updateCartSummary();
  renderProductDetail();
}

function removeFromCart(productId) {
  const next = getCart().filter((item) => item.id !== productId);
  saveCart(next);
  updateCartSummary();
  renderCheckoutItems();
}

function updateQty(productId, delta) {
  const cart = getCart();
  const item = cart.find((entry) => entry.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(productId);
    return;
  }
  saveCart(cart);
  updateCartSummary();
  renderCheckoutItems();
}

function cartStats() {
  const cart = getCart();
  let count = 0;
  let total = 0;
  cart.forEach((item) => {
    const perfume = perfumes.find((p) => p.id === item.id);
    if (perfume) {
      count += item.qty;
      total += perfume.price * item.qty;
    }
  });
  return { count, total };
}

function updateCartSummary() {
  const { count, total } = cartStats();
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");
  if (cartCount) cartCount.textContent = count;
  if (cartTotal) cartTotal.textContent = total.toFixed(2);
}

function renderProducts() {
  const grid = document.getElementById("productsGrid");
  if (!grid) return;

  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const genderFilter = document.getElementById("genderFilter");
  const resultsCount = document.getElementById("resultsCount");

  const searchTerm = (searchInput?.value || "").toLowerCase();
  const category = categoryFilter?.value || "all";
  const gender = genderFilter?.value || "all";

  const filtered = perfumes.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(searchTerm);
    const matchCategory = category === "all" || item.category === category;
    const matchGender = gender === "all" || item.gender === gender;
    return matchSearch && matchCategory && matchGender;
  });

  resultsCount.textContent = `${filtered.length} perfume(s) found`;

  grid.innerHTML = filtered.map((item) => `
    <article class="product-card">
      <img src="${getSafeProductImage(item)}" alt="${item.name}" data-product-id="${item.id}" onerror="this.onerror=null;this.src='${buildFallbackImage("Perfume Photo")}';" />
      <div class="product-body">
        <h4>${item.name}</h4>
        <div class="badge-row">
          <span class="badge">${item.category}</span>
          <span class="badge">${item.gender}</span>
        </div>
        <div class="price-row">
          <span class="price">$${item.price}</span>
          <button class="btn" data-id="${item.id}">Add to Cart</button>
        </div>
        <a href="product.html?id=${item.id}" class="details-link">View Product / Buy</a>
      </div>
    </article>
  `).join("");

  grid.querySelectorAll("button[data-id]").forEach((btn) => {
    btn.addEventListener("click", () => addToCart(Number(btn.dataset.id)));
  });

  grid.querySelectorAll("img[data-product-id]").forEach((img) => {
    img.addEventListener("click", () => {
      window.location.href = `product.html?id=${img.dataset.productId}`;
    });
  });
}

function getProductFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));
  if (!id) return null;
  return perfumes.find((item) => item.id === id) || null;
}

function renderProductDetail() {
  const productDetail = document.getElementById("productDetail");
  if (!productDetail) return;

  const product = getProductFromUrl();
  if (!product) {
    productDetail.innerHTML = `
      <div class="info-card">
        <h2>Product not found</h2>
        <p>Please return to the home page and select a perfume.</p>
        <a class="btn" href="index.html">Back to Home</a>
      </div>
    `;
    return;
  }

  const cart = getCart();
  const cartItem = cart.find((item) => item.id === product.id);
  const currentQty = cartItem ? cartItem.qty : 0;

  productDetail.innerHTML = `
    <article class="product-detail-layout">
      <img src="${getSafeProductImage(product)}" alt="${product.name}" class="product-detail-image" onerror="this.onerror=null;this.src='${buildFallbackImage("Perfume Photo")}';" />
      <div class="product-detail-info">
        <h2>${product.name}</h2>
        <p><span class="badge">${product.category}</span> <span class="badge">${product.gender}</span></p>
        <p class="price">$${product.price}</p>
        <p>Premium fragrance with long-lasting projection and curated notes for modern perfume lovers.</p>
        <p>Current quantity in cart: <strong>${currentQty}</strong></p>
        <div class="product-detail-actions">
          <button class="btn" id="addCurrentProduct">Add to Cart</button>
          <a class="btn" href="checkout.html">Buy Now</a>
          <a class="btn btn-muted" href="index.html">Continue Shopping</a>
        </div>
      </div>
    </article>
  `;

  const addBtn = document.getElementById("addCurrentProduct");
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      addToCart(product.id);
    });
  }
}

function openImageModal(imageSrc, title) {
  const modal = document.getElementById("imageModal");
  const modalImage = document.getElementById("modalImage");
  const modalTitle = document.getElementById("modalTitle");
  if (!modal || !modalImage || !modalTitle) return;
  modalImage.src = imageSrc;
  modalTitle.textContent = title;
  modal.classList.remove("hidden");
}

function closeImageModal() {
  const modal = document.getElementById("imageModal");
  if (modal) modal.classList.add("hidden");
}

function setupProductControls() {
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const genderFilter = document.getElementById("genderFilter");
  const closeModal = document.getElementById("closeModal");
  const imageModal = document.getElementById("imageModal");

  [searchInput, categoryFilter, genderFilter].forEach((el) => {
    if (el) el.addEventListener("input", renderProducts);
    if (el && el.tagName === "SELECT") {
      el.addEventListener("change", renderProducts);
    }
  });

  if (closeModal) closeModal.addEventListener("click", closeImageModal);
  if (imageModal) {
    imageModal.addEventListener("click", (event) => {
      if (event.target.id === "imageModal") closeImageModal();
    });
  }
}

function renderCheckoutItems() {
  const checkoutItems = document.getElementById("checkoutItems");
  const checkoutTotal = document.getElementById("checkoutTotal");
  if (!checkoutItems || !checkoutTotal) return;

  const cart = getCart();
  if (cart.length === 0) {
    checkoutItems.innerHTML = "<p>Your cart is empty. Add perfumes from the home page.</p>";
    checkoutTotal.textContent = "0.00";
    return;
  }

  let total = 0;
  checkoutItems.innerHTML = cart.map((item) => {
    const perfume = perfumes.find((p) => p.id === item.id);
    if (!perfume) return "";
    total += perfume.price * item.qty;
    return `
      <div class="checkout-item">
        <div>
          <strong>${perfume.name}</strong><br />
          <small>${perfume.category} | ${perfume.gender} | $${perfume.price}</small><br />
          <small>Qty: ${item.qty}</small>
        </div>
        <div class="checkout-actions">
          <button onclick="updateQty(${item.id}, 1)">+</button>
          <button onclick="updateQty(${item.id}, -1)">-</button>
          <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
      </div>
    `;
  }).join("");

  checkoutTotal.textContent = total.toFixed(2);
}

function setupCheckoutForm() {
  const checkoutForm = document.getElementById("checkoutForm");
  const orderStatus = document.getElementById("orderStatus");
  if (!checkoutForm || !orderStatus) return;

  checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const cart = getCart();
    if (cart.length === 0) {
      orderStatus.textContent = "Add items to cart before placing your order.";
      return;
    }

    orderStatus.textContent = "Order placed successfully. Thank you for shopping with Éclat.";
    checkoutForm.reset();
    saveCart([]);
    renderCheckoutItems();
    updateCartSummary();
  });
}

function setupFeedbackForm() {
  const feedbackForm = document.getElementById("feedbackForm");
  const feedbackStatus = document.getElementById("feedbackStatus");
  if (!feedbackForm || !feedbackStatus) return;

  feedbackForm.addEventListener("submit", (event) => {
    event.preventDefault();
    feedbackStatus.textContent = "Thank you for your feedback. We appreciate your response.";
    feedbackForm.reset();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  setupProductControls();
  renderProductDetail();
  renderCheckoutItems();
  setupCheckoutForm();
  setupFeedbackForm();
  updateCartSummary();
});
