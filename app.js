function buildPerfumeImage(id) {
  const safeId = String(id).padStart(2, "0");
  return `assets/images/${safeId}.optimized.jpg`;
}

function buildFallbackImage(name) {
  const safeName = encodeURIComponent(name);
  return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='640' height='640'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%231d1d27'/><stop offset='100%' stop-color='%230f0f14'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g)'/><text x='50%' y='46%' dominant-baseline='middle' text-anchor='middle' font-family='Segoe UI, Arial, sans-serif' font-size='34' fill='%23e0b15f'>Image Missing</text><text x='50%' y='56%' dominant-baseline='middle' text-anchor='middle' font-family='Segoe UI, Arial, sans-serif' font-size='22' fill='%23f5f5f8'>${safeName}</text></svg>`;
}

function getSafeProductImage(product) {
  return product.image || buildPerfumeImage(product.id);
}

function productImageAttrs(product) {
  const src = getSafeProductImage(product);
  const fallback = buildFallbackImage("Perfume Photo");
  return `src="${src}" alt="${product.name}" width="400" height="400" loading="lazy" decoding="async" data-product-id="${product.id}" onerror="this.onerror=null;this.src='${fallback}';"`;
}

const perfumes = [
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

function debounce(fn, ms = 220) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toast.classList.remove("is-visible"), 2800);
}

function addToCart(productId, silent) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);
  if (existing) existing.qty += 1;
  else cart.push({ id: productId, qty: 1 });
  saveCart(cart);
  updateCartSummary();
  const pdpQty = document.getElementById("pdpCartQty");
  if (pdpQty) {
    const item = getCart().find((e) => e.id === productId);
    pdpQty.textContent = item ? item.qty : 0;
  }
  if (!silent) {
    const perfume = perfumes.find((p) => p.id === productId);
    showToast(perfume ? `${perfume.name} added to cart` : "Added to cart");
  }
}

function removeFromCart(productId) {
  saveCart(getCart().filter((item) => item.id !== productId));
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
  ["cartCount", "headerCartCount", "stickyCartCount"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = count;
  });
  const cartTotal = document.getElementById("cartTotal");
  const stickyCartTotal = document.getElementById("stickyCartTotal");
  if (cartTotal) cartTotal.textContent = total.toFixed(2);
  if (stickyCartTotal) stickyCartTotal.textContent = total.toFixed(2);
  const stickyCart = document.getElementById("stickyCart");
  if (stickyCart) stickyCart.classList.toggle("is-visible", count > 0);
}

function getActiveFilters() {
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const genderFilter = document.getElementById("genderFilter");
  return {
    searchTerm: (searchInput?.value || "").toLowerCase(),
    category: categoryFilter?.value || "all",
    gender: genderFilter?.value || "all"
  };
}

function filterPerfumes(filters) {
  return perfumes.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(filters.searchTerm);
    const matchCategory = filters.category === "all" || item.category === filters.category;
    const matchGender = filters.gender === "all" || item.gender === filters.gender;
    return matchSearch && matchCategory && matchGender;
  });
}

function renderNoteLayer(label, notes, layerClass) {
  const chips = notes.map((note) => `
    <span class="note-chip" tabindex="0">
      ${note}
      <span class="note-tooltip" role="tooltip">${label} note — ${note}</span>
    </span>
  `).join("");
  return `
    <div class="scent-layer ${layerClass}">
      <div class="scent-layer__label">
        <span class="scent-layer__dot"></span>
        <strong>${label}</strong>
        <small>Notes</small>
      </div>
      <div class="scent-layer__notes">${chips}</div>
    </div>
  `;
}

function renderScentPyramid(productId) {
  const profile = getScentProfile(productId);
  return `
    <section class="scent-pyramid" aria-label="Scent profile">
      <h3 class="section-title">Scent Profile</h3>
      <p class="scent-mood">${profile.mood}</p>
      <div class="scent-pyramid__visual">
        <div class="pyramid-tier pyramid-tier--top">
          <span>Top</span>
          <p>${profile.top.slice(0, 2).join(" · ")}</p>
        </div>
        <div class="pyramid-tier pyramid-tier--heart">
          <span>Heart</span>
          <p>${profile.heart.slice(0, 2).join(" · ")}</p>
        </div>
        <div class="pyramid-tier pyramid-tier--base">
          <span>Base</span>
          <p>${profile.base.slice(0, 2).join(" · ")}</p>
        </div>
      </div>
      ${renderNoteLayer("Top", profile.top, "scent-layer--top")}
      ${renderNoteLayer("Heart", profile.heart, "scent-layer--heart")}
      ${renderNoteLayer("Base", profile.base, "scent-layer--base")}
      <div class="scent-meta">
        <div class="scent-meta__item">
          <span>Longevity</span>
          <strong>${profile.longevity}</strong>
        </div>
        <div class="scent-meta__item">
          <span>Projection</span>
          <strong>${profile.sillage}</strong>
        </div>
      </div>
    </section>
  `;
}

function renderProductCard(item, index) {
  const profile = getScentProfile(item.id);
  const preview = profile.top[0] || "Fresh";
  return `
    <article class="product-card" style="--delay:${index * 45}ms" data-animate>
      <a href="product.html?id=${item.id}" class="product-card__media">
        <img ${productImageAttrs(item)} />
        <span class="product-card__overlay">View details</span>
      </a>
      <div class="product-body">
        <h4><a href="product.html?id=${item.id}">${item.name}</a></h4>
        <p class="product-card__notes">${preview} · ${profile.mood}</p>
        <div class="badge-row">
          <span class="badge">${item.category}</span>
          <span class="badge badge--gender">${item.gender}</span>
        </div>
        <div class="price-row">
          <span class="price">$${item.price}</span>
          <button class="btn btn--sm" data-id="${item.id}" type="button">Add</button>
        </div>
        <a href="product.html?id=${item.id}" class="details-link">Explore scent →</a>
      </div>
    </article>
  `;
}

function renderProducts() {
  const grid = document.getElementById("productsGrid");
  if (!grid) return;

  const resultsCount = document.getElementById("resultsCount");
  const filtered = filterPerfumes(getActiveFilters());

  if (resultsCount) resultsCount.textContent = `${filtered.length} fragrance${filtered.length === 1 ? "" : "s"} curated for you`;

  grid.classList.add("is-updating");
  grid.innerHTML = filtered.map((item, i) => renderProductCard(item, i)).join("");

  requestAnimationFrame(() => {
    grid.classList.remove("is-updating");
    grid.querySelectorAll("[data-animate]").forEach((el, i) => {
      setTimeout(() => el.classList.add("is-visible"), i * 40);
    });
  });

  grid.querySelectorAll("button[data-id]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      addToCart(Number(btn.dataset.id));
    });
  });
}

function setCategoryFilter(value) {
  const categoryFilter = document.getElementById("categoryFilter");
  if (categoryFilter) categoryFilter.value = value;
  document.querySelectorAll(".category-pill").forEach((pill) => {
    pill.classList.toggle("is-active", pill.dataset.category === value);
  });
  renderProducts();
}

function setupCategoryPills() {
  document.querySelectorAll(".category-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      setCategoryFilter(pill.dataset.category || "all");
      document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function getProductFromUrl() {
  const id = Number(new URLSearchParams(window.location.search).get("id"));
  return id ? perfumes.find((item) => item.id === id) || null : null;
}

function renderProductDetail() {
  const productDetail = document.getElementById("productDetail");
  if (!productDetail) return;

  const product = getProductFromUrl();
  if (!product) {
    productDetail.innerHTML = `
      <div class="info-card empty-state">
        <h2>Fragrance not found</h2>
        <p>Return to the collection and choose a scent that speaks to you.</p>
        <a class="btn" href="index.html">Browse collection</a>
      </div>`;
    return;
  }

  const profile = getScentProfile(product.id);
  const cartItem = getCart().find((item) => item.id === product.id);
  const currentQty = cartItem ? cartItem.qty : 0;
  const imgSrc = getSafeProductImage(product);
  const fallback = buildFallbackImage("Perfume Photo");

  productDetail.innerHTML = `
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="index.html">Home</a>
      <span>/</span>
      <a href="index.html#products">${product.category}</a>
      <span>/</span>
      <span aria-current="page">${product.name}</span>
    </nav>
    <article class="product-detail-layout">
      <div class="product-detail-gallery">
        <div class="product-detail-image-wrap">
          <img src="${imgSrc}" alt="${product.name}" class="product-detail-image"
            width="480" height="480" decoding="async"
            onerror="this.onerror=null;this.src='${fallback}';" />
        </div>
      </div>
      <div class="product-detail-info">
        <p class="eyebrow">${product.category} · ${product.gender}</p>
        <h2>${product.name}</h2>
        <p class="product-tagline">${profile.mood}</p>
        <p class="price price--lg">$${product.price}</p>
        <p class="product-desc">A curated ${product.gender.toLowerCase()} fragrance with lasting presence. Explore the full pyramid below before you add to cart.</p>
        <div class="size-select" role="group" aria-label="Size">
          <button type="button" class="size-btn is-active" data-size="50">50 ml</button>
          <button type="button" class="size-btn" data-size="100">100 ml</button>
        </div>
        <p class="cart-qty-line">In cart: <strong id="pdpCartQty">${currentQty}</strong></p>
        <div class="product-detail-actions">
          <button class="btn" id="addCurrentProduct" type="button">Add to Cart</button>
          <a class="btn btn--outline" href="checkout.html">Buy Now</a>
          <a class="btn btn-muted" href="index.html">Continue Shopping</a>
        </div>
        ${renderScentPyramid(product.id)}
      </div>
    </article>
  `;

  document.getElementById("addCurrentProduct")?.addEventListener("click", () => addToCart(product.id));
  document.querySelectorAll(".size-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".size-btn").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
    });
  });
}

function setupProductControls() {
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const genderFilter = document.getElementById("genderFilter");
  const debouncedRender = debounce(renderProducts);

  if (searchInput) searchInput.addEventListener("input", debouncedRender);
  [categoryFilter, genderFilter].forEach((el) => {
    if (el) el.addEventListener("change", () => {
      document.querySelectorAll(".category-pill").forEach((pill) => {
        pill.classList.toggle("is-active", pill.dataset.category === (categoryFilter?.value || "all"));
      });
      renderProducts();
    });
  });

  document.getElementById("closeModal")?.addEventListener("click", closeImageModal);
  document.getElementById("imageModal")?.addEventListener("click", (e) => {
    if (e.target.id === "imageModal") closeImageModal();
  });
}

function closeImageModal() {
  document.getElementById("imageModal")?.classList.add("hidden");
}

function renderCheckoutItems() {
  const checkoutItems = document.getElementById("checkoutItems");
  const checkoutTotal = document.getElementById("checkoutTotal");
  if (!checkoutItems || !checkoutTotal) return;

  const cart = getCart();
  if (!cart.length) {
    checkoutItems.innerHTML = `<p class="empty-cart-msg">Your cart is empty. <a href="index.html#products">Discover fragrances</a></p>`;
    checkoutTotal.textContent = "0.00";
    return;
  }

  let total = 0;
  checkoutItems.innerHTML = cart.map((item) => {
    const perfume = perfumes.find((p) => p.id === item.id);
    if (!perfume) return "";
    total += perfume.price * item.qty;
    const thumb = getSafeProductImage(perfume);
    const fallback = buildFallbackImage("Perfume");
    return `
      <div class="checkout-item">
        <div class="checkout-item__info">
          <img src="${thumb}" alt="" width="56" height="56" loading="lazy" class="checkout-thumb"
            onerror="this.onerror=null;this.src='${fallback}';" />
          <div>
            <strong>${perfume.name}</strong><br />
            <small>${perfume.category} · $${perfume.price}</small><br />
            <small>Qty: ${item.qty}</small>
          </div>
        </div>
        <div class="checkout-actions">
          <button type="button" onclick="updateQty(${item.id}, 1)">+</button>
          <button type="button" onclick="updateQty(${item.id}, -1)">−</button>
          <button class="remove-btn" type="button" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
      </div>`;
  }).join("");

  checkoutTotal.textContent = total.toFixed(2);
}

function setupCheckoutForm() {
  const checkoutForm = document.getElementById("checkoutForm");
  const orderStatus = document.getElementById("orderStatus");
  if (!checkoutForm || !orderStatus) return;

  checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!getCart().length) {
      orderStatus.textContent = "Add items to cart before placing your order.";
      return;
    }
    orderStatus.textContent = "Order placed successfully. Thank you for shopping with Éclat.";
    checkoutForm.reset();
    saveCart([]);
    renderCheckoutItems();
    updateCartSummary();
    showToast("Order confirmed — thank you!");
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

function setupHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function setupReveal() {
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("is-visible");
        observer.unobserve(e.target);
      }
    }),
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  setupProductControls();
  setupCategoryPills();
  renderProductDetail();
  renderCheckoutItems();
  setupCheckoutForm();
  setupFeedbackForm();
  updateCartSummary();
  setupHeaderScroll();
  setupReveal();
});
