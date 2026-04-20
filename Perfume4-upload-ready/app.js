const perfumes = [
  // Designer perfumes (10)
  { id: 1, name: "Dior Sauvage", category: "Designer", gender: "Men", price: 129, image: "https://source.unsplash.com/600x600/?dior,sauvage,perfume,bottle" },
  { id: 2, name: "Chanel Bleu de Chanel", category: "Designer", gender: "Men", price: 135, image: "https://source.unsplash.com/600x600/?chanel,bleu,de,parfum,bottle" },
  { id: 3, name: "YSL Libre", category: "Designer", gender: "Women", price: 118, image: "https://source.unsplash.com/600x600/?ysl,libre,perfume,bottle" },
  { id: 4, name: "Gucci Bloom", category: "Designer", gender: "Women", price: 112, image: "https://source.unsplash.com/600x600/?gucci,bloom,perfume,bottle" },
  { id: 5, name: "Armani Acqua di Gio", category: "Designer", gender: "Men", price: 120, image: "https://source.unsplash.com/600x600/?armani,acqua,di,gio,perfume" },
  { id: 6, name: "Prada Paradoxe", category: "Designer", gender: "Women", price: 124, image: "https://source.unsplash.com/600x600/?prada,paradoxe,perfume,bottle" },
  { id: 7, name: "Versace Eros", category: "Designer", gender: "Men", price: 110, image: "https://source.unsplash.com/600x600/?versace,eros,perfume,bottle" },
  { id: 8, name: "Lancôme La Vie Est Belle", category: "Designer", gender: "Women", price: 122, image: "https://source.unsplash.com/600x600/?lancome,la,vie,est,belle,perfume" },
  { id: 9, name: "Tom Ford Black Orchid", category: "Designer", gender: "Unisex", price: 149, image: "https://source.unsplash.com/600x600/?tom,ford,black,orchid,perfume" },
  { id: 10, name: "Givenchy Gentleman", category: "Designer", gender: "Men", price: 108, image: "https://source.unsplash.com/600x600/?givenchy,gentleman,perfume,bottle" },

  // Niche perfumes (10)
  { id: 11, name: "Creed Aventus", category: "Niche", gender: "Men", price: 310, image: "https://source.unsplash.com/600x600/?creed,aventus,perfume,bottle" },
  { id: 12, name: "Maison Francis Kurkdjian Baccarat Rouge 540", category: "Niche", gender: "Unisex", price: 355, image: "https://source.unsplash.com/600x600/?baccarat,rouge,540,perfume,bottle" },
  { id: 13, name: "Byredo Gypsy Water", category: "Niche", gender: "Unisex", price: 265, image: "https://source.unsplash.com/600x600/?byredo,gypsy,water,perfume,bottle" },
  { id: 14, name: "Le Labo Santal 33", category: "Niche", gender: "Unisex", price: 289, image: "https://source.unsplash.com/600x600/?le,labo,santal,33,perfume" },
  { id: 15, name: "Amouage Reflection Woman", category: "Niche", gender: "Women", price: 295, image: "https://source.unsplash.com/600x600/?amouage,reflection,woman,perfume" },
  { id: 16, name: "Frederic Malle Portrait of a Lady", category: "Niche", gender: "Women", price: 320, image: "https://source.unsplash.com/600x600/?frederic,malle,portrait,of,a,lady,perfume" },
  { id: 17, name: "Xerjoff Naxos", category: "Niche", gender: "Men", price: 275, image: "https://source.unsplash.com/600x600/?xerjoff,naxos,perfume,bottle" },
  { id: 18, name: "Roja Parfums Elysium", category: "Niche", gender: "Men", price: 335, image: "https://source.unsplash.com/600x600/?roja,elysium,perfume,bottle" },
  { id: 19, name: "Parfums de Marly Delina", category: "Niche", gender: "Women", price: 300, image: "https://source.unsplash.com/600x600/?delina,parfums,de,marly,perfume" },
  { id: 20, name: "Diptyque Tam Dao", category: "Niche", gender: "Unisex", price: 210, image: "https://source.unsplash.com/600x600/?diptyque,tam,dao,perfume,bottle" },

  // Middle Eastern fragrances (10)
  { id: 21, name: "Lattafa Khamrah", category: "Middle Eastern", gender: "Unisex", price: 59, image: "https://source.unsplash.com/600x600/?lattafa,khamrah,perfume,bottle" },
  { id: 22, name: "Rasasi Hawas", category: "Middle Eastern", gender: "Men", price: 68, image: "https://source.unsplash.com/600x600/?rasasi,hawas,perfume,bottle" },
  { id: 23, name: "Ajmal Aristocrat", category: "Middle Eastern", gender: "Women", price: 72, image: "https://source.unsplash.com/600x600/?ajmal,aristocrat,perfume,bottle" },
  { id: 24, name: "Afnan 9PM", category: "Middle Eastern", gender: "Men", price: 65, image: "https://source.unsplash.com/600x600/?afnan,9pm,perfume,bottle" },
  { id: 25, name: "Swiss Arabian Shaghaf Oud", category: "Middle Eastern", gender: "Unisex", price: 78, image: "https://source.unsplash.com/600x600/?swiss,arabian,shaghaf,oud,perfume" },
  { id: 26, name: "Armaf Club de Nuit Intense", category: "Middle Eastern", gender: "Men", price: 70, image: "https://source.unsplash.com/600x600/?armaf,club,de,nuit,intense,perfume" },
  { id: 27, name: "Nabeel Touch Me", category: "Middle Eastern", gender: "Women", price: 55, image: "https://source.unsplash.com/600x600/?nabeel,touch,me,perfume,bottle" },
  { id: 28, name: "Al Haramain Amber Oud Gold", category: "Middle Eastern", gender: "Unisex", price: 85, image: "https://source.unsplash.com/600x600/?al,haramain,amber,oud,gold,perfume" },
  { id: 29, name: "Mancera Instant Crush", category: "Middle Eastern", gender: "Unisex", price: 145, image: "https://source.unsplash.com/600x600/?mancera,instant,crush,perfume,bottle" },
  { id: 30, name: "Lattafa Yara", category: "Middle Eastern", gender: "Women", price: 52, image: "https://source.unsplash.com/600x600/?lattafa,yara,perfume,bottle" }
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
      <img src="${item.image}" alt="${item.name}" data-product-id="${item.id}" />
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
      <img src="${product.image}" alt="${product.name}" class="product-detail-image" />
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
