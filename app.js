/* Éclat — core storefront logic (INR, variants, checkout, browsing) */

const CART_KEY = "aromaVaultCart";
const FREE_SHIPPING_THRESHOLD = 4999;
const SHIPPING_FLAT = 149;
const EXPRESS_DELIVERY_FEE = 199;
const SIZE_MULTIPLIER = { 50: 1, 100: 1.75 };
const RECENT_KEY = "eclatRecentlyViewed";

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

function formatINR(amount) {
  return inrFormatter.format(Math.round(amount));
}

function buildPerfumeImage(id) {
  const safeId = String(id).padStart(2, "0");
  return `assets/images/${safeId}.optimized.jpg`;
}

function buildPerfumeHoverImage(id) {
  const safeId = String(id).padStart(2, "0");
  return `assets/images/${safeId}.lifestyle.optimized.jpg`;
}

function buildFallbackImage(name) {
  const safeName = encodeURIComponent(name);
  return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='640' height='640'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%231d1d27'/><stop offset='100%' stop-color='%230f0f14'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g)'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='28' fill='%23d4a853'>${safeName}</text></svg>`;
}

function getSafeProductImage(product) {
  return product.image || buildPerfumeImage(product.id);
}

function getVariantPrice(product, size = 50) {
  const mult = SIZE_MULTIPLIER[size] || 1;
  return Math.round(product.price * mult);
}

function cartLineKey(id, size) {
  return `${id}-${size}`;
}

function debounce(fn, ms = 220) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

/* Base catalog prices = 50ml INR (premium India retail / clone tier) */
const perfumes = [
  { id: 1, name: "Dior Sauvage", category: "Designer", gender: "Men", price: 5999, image: buildPerfumeImage(1) },
  { id: 2, name: "Chanel Bleu de Chanel", category: "Designer", gender: "Men", price: 6299, image: buildPerfumeImage(2) },
  { id: 3, name: "YSL Libre", category: "Designer", gender: "Women", price: 5499, image: buildPerfumeImage(3) },
  { id: 4, name: "Gucci Bloom", category: "Designer", gender: "Women", price: 5299, image: buildPerfumeImage(4) },
  { id: 5, name: "Armani Acqua di Gio", category: "Designer", gender: "Men", price: 5599, image: buildPerfumeImage(5) },
  { id: 6, name: "Prada Paradoxe", category: "Designer", gender: "Women", price: 5699, image: buildPerfumeImage(6) },
  { id: 7, name: "Versace Eros", category: "Designer", gender: "Men", price: 4999, image: buildPerfumeImage(7) },
  { id: 8, name: "Lancôme La Vie Est Belle", category: "Designer", gender: "Women", price: 5599, image: buildPerfumeImage(8) },
  { id: 9, name: "Tom Ford Black Orchid", category: "Designer", gender: "Unisex", price: 6999, image: buildPerfumeImage(9) },
  { id: 10, name: "Givenchy Gentleman", category: "Designer", gender: "Men", price: 4899, image: buildPerfumeImage(10) },
  { id: 11, name: "Creed Aventus", category: "Niche", gender: "Men", price: 14999, image: buildPerfumeImage(11) },
  { id: 12, name: "Maison Francis Kurkdjian Baccarat Rouge 540", category: "Niche", gender: "Unisex", price: 17999, image: buildPerfumeImage(12) },
  { id: 13, name: "Byredo Gypsy Water", category: "Niche", gender: "Unisex", price: 12999, image: buildPerfumeImage(13) },
  { id: 14, name: "Le Labo Santal 33", category: "Niche", gender: "Unisex", price: 13999, image: buildPerfumeImage(14) },
  { id: 15, name: "Amouage Reflection Woman", category: "Niche", gender: "Women", price: 14299, image: buildPerfumeImage(15) },
  { id: 16, name: "Frederic Malle Portrait of a Lady", category: "Niche", gender: "Women", price: 15499, image: buildPerfumeImage(16) },
  { id: 17, name: "Xerjoff Naxos", category: "Niche", gender: "Men", price: 13499, image: buildPerfumeImage(17) },
  { id: 18, name: "Roja Parfums Elysium", category: "Niche", gender: "Men", price: 15999, image: buildPerfumeImage(18) },
  { id: 19, name: "Parfums de Marly Delina", category: "Niche", gender: "Women", price: 14499, image: buildPerfumeImage(19) },
  { id: 20, name: "Diptyque Tam Dao", category: "Niche", gender: "Unisex", price: 10999, image: buildPerfumeImage(20) },
  { id: 21, name: "Lattafa Khamrah", category: "Middle Eastern", gender: "Unisex", price: 1899, image: buildPerfumeImage(21) },
  { id: 22, name: "Rasasi Hawas", category: "Middle Eastern", gender: "Men", price: 2199, image: buildPerfumeImage(22) },
  { id: 23, name: "Ajmal Aristocrat", category: "Middle Eastern", gender: "Women", price: 2299, image: buildPerfumeImage(23) },
  { id: 24, name: "Afnan 9PM", category: "Middle Eastern", gender: "Men", price: 1999, image: buildPerfumeImage(24) },
  { id: 25, name: "Swiss Arabian Shaghaf Oud", category: "Middle Eastern", gender: "Unisex", price: 2499, image: buildPerfumeImage(25) },
  { id: 26, name: "Armaf Club de Nuit Intense", category: "Middle Eastern", gender: "Men", price: 2199, image: buildPerfumeImage(26) },
  { id: 27, name: "Nabeel Touch Me", category: "Middle Eastern", gender: "Women", price: 1799, image: buildPerfumeImage(27) },
  { id: 28, name: "Al Haramain Amber Oud Gold", category: "Middle Eastern", gender: "Unisex", price: 2799, image: buildPerfumeImage(28) },
  { id: 29, name: "Mancera Instant Crush", category: "Middle Eastern", gender: "Unisex", price: 4499, image: buildPerfumeImage(29) },
  { id: 30, name: "Lattafa Yara", category: "Middle Eastern", gender: "Women", price: 1699, image: buildPerfumeImage(30) }
];

function normalizeCart(cart) {
  return cart.map((item) => ({
    id: item.id,
    qty: item.qty,
    size: item.size === 100 ? 100 : 50
  }));
}

function getCart() {
  try {
    return normalizeCart(JSON.parse(localStorage.getItem(CART_KEY) || "[]"));
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(normalizeCart(cart)));
}

function findCartItem(cart, id, size) {
  return cart.find((item) => item.id === id && item.size === size);
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toast.classList.remove("is-visible"), 3000);
}

function addToCart(productId, size = 50, silent = false) {
  const cart = getCart();
  const existing = findCartItem(cart, productId, size);
  if (existing) existing.qty += 1;
  else cart.push({ id: productId, qty: 1, size });
  saveCart(cart);
  updateCartSummary();
  refreshCheckoutSummary();
  const pdpQty = document.getElementById("pdpCartQty");
  if (pdpQty) {
    const totalForProduct = cart.filter((e) => e.id === productId).reduce((s, e) => s + e.qty, 0);
    pdpQty.textContent = totalForProduct;
  }
  if (!silent) {
    const perfume = perfumes.find((p) => p.id === productId);
    showToast(perfume ? `${perfume.name} (${size} ml) added` : "Added to cart");
  }
  closeQuickDrawer();
}

function removeFromCart(productId, size = 50) {
  saveCart(getCart().filter((item) => !(item.id === productId && item.size === size)));
  updateCartSummary();
  renderCheckoutItems();
  refreshCheckoutSummary();
}

function updateQty(productId, size, delta) {
  const cart = getCart();
  const item = findCartItem(cart, productId, size);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(productId, size);
    return;
  }
  saveCart(cart);
  updateCartSummary();
  renderCheckoutItems();
  refreshCheckoutSummary();
}

window.updateQty = updateQty;
window.removeFromCart = removeFromCart;

function getDeliveryMode() {
  const selected = document.querySelector('input[name="delivery"]:checked');
  return selected?.value === "express" ? "express" : "standard";
}

function getExpressDeliveryFee(subtotal) {
  if (subtotal === 0) return 0;
  return getDeliveryMode() === "express" ? EXPRESS_DELIVERY_FEE : 0;
}

function computeOrderTotals(cart) {
  let subtotal = 0;
  let count = 0;
  cart.forEach((item) => {
    const perfume = perfumes.find((p) => p.id === item.id);
    if (!perfume) return;
    const line = getVariantPrice(perfume, item.size) * item.qty;
    subtotal += line;
    count += item.qty;
  });
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FLAT;
  const delivery = getExpressDeliveryFee(subtotal);
  return { subtotal, shipping, delivery, total: subtotal + shipping + delivery, count };
}

function cartStats() {
  return computeOrderTotals(getCart());
}

function updateCartSummary() {
  const { count, total } = cartStats();
  ["cartCount", "headerCartCount", "stickyCartCount"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = count;
  });
  const formatted = formatINR(total);
  ["cartTotal", "stickyCartTotal"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = formatted;
  });
  const stickyCart = document.getElementById("stickyCart");
  if (stickyCart) stickyCart.classList.toggle("is-visible", count > 0);
  updateShippingProgress();
}

function updateShippingProgress() {
  const wrap = document.getElementById("shippingProgress");
  const fill = document.getElementById("shippingProgressFill");
  const text = document.getElementById("shippingProgressText");
  if (!wrap || !fill || !text) return;

  const { subtotal, count } = cartStats();
  if (!count) {
    wrap.hidden = true;
    return;
  }
  wrap.hidden = false;
  const pct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  fill.style.width = `${pct}%`;
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
  text.textContent = remaining > 0
    ? `Add ${formatINR(remaining)} more for free shipping`
    : "You've unlocked free shipping on this order";
}

function getActiveFilters() {
  return {
    searchTerm: (document.getElementById("searchInput")?.value || "").toLowerCase(),
    category: document.getElementById("categoryFilter")?.value || "all",
    gender: document.getElementById("genderFilter")?.value || "all",
    family: document.getElementById("familyFilter")?.value || "all",
    sort: document.getElementById("sortFilter")?.value || "featured"
  };
}

function filterPerfumes(filters) {
  let list = perfumes.filter((item) => {
    const profile = getScentProfile(item.id);
    const matchSearch = item.name.toLowerCase().includes(filters.searchTerm);
    const matchCategory = filters.category === "all" || item.category === filters.category;
    const matchGender = filters.gender === "all" || item.gender === filters.gender;
    const matchFamily = filters.family === "all" || profile.family === filters.family;
    return matchSearch && matchCategory && matchGender && matchFamily;
  });

  switch (filters.sort) {
    case "price-asc":
      list = [...list].sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      list = [...list].sort((a, b) => b.price - a.price);
      break;
    case "name":
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      break;
  }
  return list;
}

function renderNoteLayer(label, notes, layerClass) {
  const chips = notes.map((note) => `
    <span class="note-chip" tabindex="0">${note}
      <span class="note-tooltip" role="tooltip">${label} — ${note}</span>
    </span>`).join("");
  return `
    <div class="scent-layer ${layerClass}">
      <div class="scent-layer__label"><span class="scent-layer__dot"></span><strong>${label}</strong><small>Notes</small></div>
      <div class="scent-layer__notes">${chips}</div>
    </div>`;
}

function renderScentAccordWheel(productId) {
  const p = getScentProfile(productId);
  return `
    <div class="accord-wheel" aria-label="Scent accord wheel">
      <div class="accord-wheel__ring">
        <div class="accord-wheel__segment accord-wheel__segment--top" title="Top notes"></div>
        <div class="accord-wheel__segment accord-wheel__segment--heart" title="Heart notes"></div>
        <div class="accord-wheel__segment accord-wheel__segment--base" title="Base notes"></div>
        <div class="accord-wheel__center">
          <span>${p.family}</span>
          <small>Accord</small>
        </div>
      </div>
      <ul class="accord-wheel__legend">
        <li><span class="dot dot--top"></span> Top · ${p.top.slice(0, 2).join(", ")}</li>
        <li><span class="dot dot--heart"></span> Heart · ${p.heart.slice(0, 2).join(", ")}</li>
        <li><span class="dot dot--base"></span> Base · ${p.base.slice(0, 2).join(", ")}</li>
      </ul>
    </div>`;
}

function renderScentPyramid(productId) {
  const profile = getScentProfile(productId);
  return `
    <section class="scent-pyramid" aria-label="Scent profile">
      <h3 class="section-title">Scent Profile</h3>
      <p class="scent-mood"><span class="family-badge">${profile.family}</span> · ${profile.mood}</p>
      ${renderScentAccordWheel(productId)}
      <div class="scent-pyramid__visual">
        <div class="pyramid-tier pyramid-tier--top"><span>Top</span><p>${profile.top.slice(0, 2).join(" · ")}</p></div>
        <div class="pyramid-tier pyramid-tier--heart"><span>Heart</span><p>${profile.heart.slice(0, 2).join(" · ")}</p></div>
        <div class="pyramid-tier pyramid-tier--base"><span>Base</span><p>${profile.base.slice(0, 2).join(" · ")}</p></div>
      </div>
      ${renderNoteLayer("Top", profile.top, "scent-layer--top")}
      ${renderNoteLayer("Heart", profile.heart, "scent-layer--heart")}
      ${renderNoteLayer("Base", profile.base, "scent-layer--base")}
      <div class="scent-meta">
        <div class="scent-meta__item"><span>Longevity</span><strong>${profile.longevity}</strong></div>
        <div class="scent-meta__item"><span>Projection</span><strong>${profile.sillage}</strong></div>
      </div>
    </section>`;
}

function renderProductCard(item, index) {
  const profile = getScentProfile(item.id);
  const primary = getSafeProductImage(item);
  const hover = buildPerfumeHoverImage(item.id);
  const fallback = buildFallbackImage("Perfume");
  const fromPrice = formatINR(item.price);

  return `
    <article class="product-card" style="--delay:${index * 40}ms" data-animate data-id="${item.id}">
      <a href="product.html?id=${item.id}" class="product-card__media">
        <img class="product-card__img product-card__img--primary" src="${primary}" alt="${item.name}"
          width="400" height="500" loading="lazy" decoding="async"
          onerror="this.onerror=null;this.src='${fallback}';" />
        <img class="product-card__img product-card__img--hover" src="${hover}" alt=""
          width="400" height="500" loading="lazy" decoding="async"
          onerror="this.onerror=null;this.style.display='none';" />
        <div class="product-card__notes-panel">
          <span class="family-badge">${profile.family}</span>
          <p>${profile.top[0]} · ${profile.heart[0]}</p>
          <small>${profile.base[0]}</small>
        </div>
        <span class="product-card__overlay">View details</span>
      </a>
      <div class="product-body">
        <h4><a href="product.html?id=${item.id}">${item.name}</a></h4>
        <p class="product-card__notes">${profile.family} · ${profile.mood}</p>
        <div class="badge-row">
          <span class="badge">${item.category}</span>
          <span class="badge badge--gender">${item.gender}</span>
        </div>
        <div class="price-row">
          <span class="price">From ${fromPrice}</span>
          <div class="card-actions">
            <button class="btn btn--ghost btn--sm" type="button" data-quick="${item.id}">Quick</button>
            <button class="btn btn--sm" data-id="${item.id}" type="button">Add</button>
          </div>
        </div>
        <a href="product.html?id=${item.id}" class="details-link">Explore scent →</a>
      </div>
    </article>`;
}

function renderProducts() {
  const grid = document.getElementById("productsGrid");
  if (!grid) return;

  const filters = getActiveFilters();
  const filtered = filterPerfumes(filters);
  const resultsCount = document.getElementById("resultsCount");
  if (resultsCount) {
    resultsCount.textContent = `${filtered.length} fragrance${filtered.length === 1 ? "" : "s"} · prices in INR`;
  }

  grid.style.minHeight = `${grid.offsetHeight}px`;
  grid.classList.add("is-updating");
  grid.innerHTML = filtered.map((item, i) => renderProductCard(item, i)).join("");

  requestAnimationFrame(() => {
    grid.classList.remove("is-updating");
    grid.style.minHeight = "";
    grid.querySelectorAll("[data-animate]").forEach((el, i) => {
      setTimeout(() => el.classList.add("is-visible"), i * 35);
    });
  });

  grid.querySelectorAll("button[data-id]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openQuickDrawer(Number(btn.dataset.id));
    });
  });
  grid.querySelectorAll("button[data-quick]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openQuickDrawer(Number(btn.dataset.quick));
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

window.setCategoryFilter = setCategoryFilter;

function setupCategoryPills() {
  document.querySelectorAll(".category-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      setCategoryFilter(pill.dataset.category || "all");
      document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
  document.querySelectorAll(".family-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      const familyFilter = document.getElementById("familyFilter");
      const val = pill.dataset.family || "all";
      if (familyFilter) familyFilter.value = val;
      document.querySelectorAll(".family-pill").forEach((p) => p.classList.toggle("is-active", p.dataset.family === val));
      renderProducts();
    });
  });
}

function getProductFromUrl() {
  const id = Number(new URLSearchParams(window.location.search).get("id"));
  return id ? perfumes.find((item) => item.id === id) || null : null;
}

let pdpSelectedSize = 50;

function updatePdpPrice(product) {
  const priceEl = document.getElementById("pdpPrice");
  if (priceEl) {
    priceEl.textContent = formatINR(getVariantPrice(product, pdpSelectedSize));
    priceEl.dataset.size = String(pdpSelectedSize);
  }
  const hint = document.getElementById("pdpSizeHint");
  if (!hint) return;
  const p50 = getVariantPrice(product, 50);
  const p100 = getVariantPrice(product, 100);
  hint.innerHTML = `
    <span class="size-hint ${pdpSelectedSize === 50 ? "is-active" : ""}">50 ml · ${formatINR(p50)}</span>
    <span class="size-hint-sep">|</span>
    <span class="size-hint ${pdpSelectedSize === 100 ? "is-active" : ""}">100 ml · ${formatINR(p100)}</span>`;
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

  pdpSelectedSize = 50;
  const profile = getScentProfile(product.id);
  const cartQty = getCart().filter((i) => i.id === product.id).reduce((s, i) => s + i.qty, 0);
  const imgSrc = getSafeProductImage(product);
  const fallback = buildFallbackImage("Perfume Photo");
  const price50 = formatINR(getVariantPrice(product, 50));
  const price100 = formatINR(getVariantPrice(product, 100));

  productDetail.innerHTML = `
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="index.html">Home</a><span>/</span>
      <a href="index.html#products">${product.category}</a><span>/</span>
      <span aria-current="page">${product.name}</span>
    </nav>
    <article class="product-detail-layout">
      <div class="product-detail-gallery">
        <div class="product-detail-image-wrap">
          <img src="${imgSrc}" alt="${product.name}" class="product-detail-image" width="480" height="480" decoding="async"
            onerror="this.onerror=null;this.src='${fallback}';" />
        </div>
      </div>
      <div class="product-detail-info">
        <p class="eyebrow">${product.category} · ${product.gender}</p>
        <h2>${product.name}</h2>
        <p class="product-tagline">${profile.mood}</p>
        <p class="price price--lg" id="pdpPrice">${price50}</p>
        <p class="price-variant-hint" id="pdpSizeHint"></p>
        <p class="product-desc">A curated ${product.gender.toLowerCase()} fragrance. Select your bottle size — price updates instantly.</p>
        <div class="size-select" role="group" aria-label="Bottle size">
          <button type="button" class="size-btn is-active" data-size="50" aria-pressed="true">50 ml</button>
          <button type="button" class="size-btn" data-size="100" aria-pressed="false">100 ml</button>
        </div>
        <p class="cart-qty-line">In cart: <strong id="pdpCartQty">${cartQty}</strong></p>
        <div class="product-detail-actions">
          <button class="btn" id="addCurrentProduct" type="button">Add to Cart</button>
          <a class="btn btn--outline" href="checkout.html">Buy Now</a>
          <a class="btn btn-muted" href="index.html">Continue Shopping</a>
        </div>
        ${renderScentPyramid(product.id)}
      </div>
    </article>`;

  document.getElementById("addCurrentProduct")?.addEventListener("click", () => addToCart(product.id, pdpSelectedSize));
  document.querySelectorAll(".size-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      pdpSelectedSize = Number(btn.dataset.size);
      document.querySelectorAll(".size-btn").forEach((b) => {
        const active = Number(b.dataset.size) === pdpSelectedSize;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", active ? "true" : "false");
      });
      updatePdpPrice(product);
    });
  });
  updatePdpPrice(product);
  trackRecentlyViewed(product.id);
}

/* Quick-add drawer */
function openQuickDrawer(productId) {
  const product = perfumes.find((p) => p.id === productId);
  const drawer = document.getElementById("quickDrawer");
  const body = document.getElementById("quickDrawerBody");
  if (!product || !drawer || !body) {
    if (product) addToCart(productId, 50);
    return;
  }

  let size = 50;
  const profile = getScentProfile(product.id);
  const img = getSafeProductImage(product);
  const fallback = buildFallbackImage("Perfume");

  body.innerHTML = `
    <img src="${img}" alt="${product.name}" class="quick-drawer__img" width="120" height="120"
      onerror="this.onerror=null;this.src='${fallback}';" />
    <h3>${product.name}</h3>
    <p class="quick-drawer__meta">${profile.family} · ${product.category}</p>
    <p class="price price--lg" id="quickDrawerPrice">${formatINR(getVariantPrice(product, 50))}</p>
    <div class="size-select" role="group">
      <button type="button" class="size-btn is-active" data-qsize="50">50 ml</button>
      <button type="button" class="size-btn" data-qsize="100">100 ml</button>
    </div>
    <button type="button" class="btn btn--full" id="quickDrawerAdd">Add to Cart</button>
    <a href="product.html?id=${product.id}" class="details-link">Full details →</a>`;

  body.querySelectorAll("[data-qsize]").forEach((btn) => {
    btn.addEventListener("click", () => {
      size = Number(btn.dataset.qsize);
      body.querySelectorAll("[data-qsize]").forEach((b) => b.classList.toggle("is-active", Number(b.dataset.qsize) === size));
      const priceEl = document.getElementById("quickDrawerPrice");
      if (priceEl) priceEl.textContent = formatINR(getVariantPrice(product, size));
    });
  });
  document.getElementById("quickDrawerAdd")?.addEventListener("click", () => addToCart(product.id, size));

  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
}

function closeQuickDrawer() {
  const drawer = document.getElementById("quickDrawer");
  if (drawer) {
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
  }
}

function setupQuickDrawer() {
  document.getElementById("quickDrawerClose")?.addEventListener("click", closeQuickDrawer);
  document.getElementById("quickDrawerBackdrop")?.addEventListener("click", closeQuickDrawer);
}

function setupProductControls() {
  const debouncedRender = debounce(renderProducts);
  document.getElementById("searchInput")?.addEventListener("input", debouncedRender);
  ["categoryFilter", "genderFilter", "familyFilter", "sortFilter"].forEach((id) => {
    document.getElementById(id)?.addEventListener("change", renderProducts);
  });
  document.getElementById("closeModal")?.addEventListener("click", () => {
    document.getElementById("imageModal")?.classList.add("hidden");
  });
}

function renderCheckoutLineItems(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return computeOrderTotals(getCart());

  const cart = getCart();
  if (!cart.length) {
    container.innerHTML = `<p class="empty-cart-msg">Your cart is empty. <a href="index.html#products">Discover fragrances</a></p>`;
    return { subtotal: 0, shipping: 0, total: 0, count: 0 };
  }

  const fallback = buildFallbackImage("Perfume");
  let subtotal = 0;
  container.innerHTML = cart.map((item) => {
    const perfume = perfumes.find((p) => p.id === item.id);
    if (!perfume) return "";
    const unit = getVariantPrice(perfume, item.size);
    const line = unit * item.qty;
    subtotal += line;
    const thumb = getSafeProductImage(perfume);
    return `
      <div class="checkout-line">
        <img src="${thumb}" alt="" width="52" height="52" class="checkout-thumb" loading="lazy"
          onerror="this.onerror=null;this.src='${fallback}';" />
        <div class="checkout-line__info">
          <strong>${perfume.name}</strong>
          <span>${item.size} ml · ${formatINR(unit)} each</span>
        </div>
        <div class="checkout-line__end">
          <span class="checkout-line__price">${formatINR(line)}</span>
          <div class="checkout-actions">
            <button type="button" onclick="updateQty(${item.id}, ${item.size}, 1)" aria-label="Increase">+</button>
            <button type="button" onclick="updateQty(${item.id}, ${item.size}, -1)" aria-label="Decrease">−</button>
            <button class="remove-btn" type="button" onclick="removeFromCart(${item.id}, ${item.size})">Remove</button>
          </div>
          <small>Qty ${item.qty}</small>
        </div>
      </div>`;
  }).join("");

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const delivery = getExpressDeliveryFee(subtotal);
  return { subtotal, shipping, delivery, total: subtotal + shipping + delivery, count: cart.reduce((s, i) => s + i.qty, 0) };
}

function refreshCheckoutSummary() {
  const totals = computeOrderTotals(getCart());
  const subEl = document.getElementById("summarySubtotal");
  const shipEl = document.getElementById("summaryShipping");
  const deliveryRow = document.getElementById("summaryDeliveryRow");
  const deliveryEl = document.getElementById("summaryDelivery");
  const totalEl = document.getElementById("summaryTotal");
  const checkoutTotal = document.getElementById("checkoutTotal");
  if (subEl) subEl.textContent = formatINR(totals.subtotal);
  if (shipEl) shipEl.textContent = totals.shipping === 0 ? "FREE" : formatINR(totals.shipping);
  if (deliveryRow) deliveryRow.hidden = !totals.delivery;
  if (deliveryEl) deliveryEl.textContent = formatINR(totals.delivery);
  if (totalEl) totalEl.textContent = formatINR(totals.total);
  if (checkoutTotal) checkoutTotal.textContent = formatINR(totals.total);

  const shipNote = document.getElementById("shippingNote");
  if (shipNote) {
    const remaining = FREE_SHIPPING_THRESHOLD - totals.subtotal;
    shipNote.textContent = totals.subtotal === 0
      ? `Free shipping on orders above ${formatINR(FREE_SHIPPING_THRESHOLD)}`
      : remaining > 0
        ? `Add ${formatINR(remaining)} more for free shipping`
        : "You've unlocked free shipping";
  }
}

function renderCheckoutItems() {
  renderCheckoutLineItems("checkoutItems");
  renderCheckoutLineItems("checkoutSummaryItems");
  refreshCheckoutSummary();
}

function setupDeliveryOptions() {
  document.querySelectorAll(".delivery-option").forEach((label) => {
    label.addEventListener("click", () => {
      document.querySelectorAll(".delivery-option").forEach((l) => l.classList.remove("is-selected"));
      label.classList.add("is-selected");
      refreshCheckoutSummary();
    });
  });
  document.querySelectorAll('input[name="delivery"]').forEach((radio) => {
    radio.addEventListener("change", refreshCheckoutSummary);
  });
}

function trackRecentlyViewed(productId) {
  try {
    let ids = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    ids = [productId, ...ids.filter((id) => id !== productId)].slice(0, 4);
    localStorage.setItem(RECENT_KEY, JSON.stringify(ids));
  } catch { /* ignore */ }
}

function renderRecentlyViewed() {
  const section = document.getElementById("recentlyViewedSection");
  const grid = document.getElementById("recentlyViewedGrid");
  if (!section || !grid) return;

  let ids = [];
  try {
    ids = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  } catch { /* ignore */ }

  const items = ids.map((id) => perfumes.find((p) => p.id === id)).filter(Boolean);
  if (!items.length) {
    section.hidden = true;
    return;
  }
  section.hidden = false;
  grid.innerHTML = items.map((item) => {
    const img = getSafeProductImage(item);
    const fallback = buildFallbackImage("Perfume");
    return `
      <a href="product.html?id=${item.id}" class="recent-card">
        <img src="${img}" alt="" width="80" height="100" loading="lazy"
          onerror="this.onerror=null;this.src='${fallback}';" />
        <span>${item.name}</span>
        <small>${formatINR(item.price)}</small>
      </a>`;
  }).join("");
}

function setupCheckoutAccordion() {
  const steps = document.querySelectorAll(".checkout-step");
  steps.forEach((step, index) => {
    const head = step.querySelector(".checkout-step__head");
    const body = step.querySelector(".checkout-step__body");
    if (!head || !body) return;

    head.addEventListener("click", () => {
      const isOpen = step.classList.contains("is-open");
      steps.forEach((s) => {
        s.classList.remove("is-open");
        s.querySelector(".checkout-step__body")?.setAttribute("hidden", "");
      });
      if (!isOpen) {
        step.classList.add("is-open");
        body.removeAttribute("hidden");
      }
    });

    if (index === 0) {
      step.classList.add("is-open");
      body.removeAttribute("hidden");
    } else {
      body.setAttribute("hidden", "");
    }
  });

  document.querySelectorAll(".checkout-next").forEach((btn) => {
    btn.addEventListener("click", () => {
      const step = btn.closest(".checkout-step");
      const next = step?.nextElementSibling;
      if (next?.classList.contains("checkout-step")) {
        step.classList.remove("is-open");
        step.querySelector(".checkout-step__body")?.setAttribute("hidden", "");
        next.classList.add("is-open");
        next.querySelector(".checkout-step__body")?.removeAttribute("hidden");
        next.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

function setupCheckoutForm() {
  const checkoutForm = document.getElementById("checkoutForm");
  const orderStatus = document.getElementById("orderStatus");
  const loader = document.getElementById("checkoutLoader");
  if (!checkoutForm) return;

  checkoutForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!getCart().length) {
      if (orderStatus) orderStatus.textContent = "Add items to cart before placing your order.";
      return;
    }

    if (loader) loader.classList.add("is-active");
    if (orderStatus) orderStatus.textContent = "";

    await new Promise((r) => setTimeout(r, 1600));

    if (loader) loader.classList.remove("is-active");
    if (orderStatus) orderStatus.textContent = "Order placed successfully. Thank you for shopping with Éclat.";
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
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  setupProductControls();
  setupCategoryPills();
  setupQuickDrawer();
  renderProductDetail();
  renderCheckoutItems();
  setupCheckoutAccordion();
  setupDeliveryOptions();
  setupCheckoutForm();
  setupFeedbackForm();
  updateCartSummary();
  renderRecentlyViewed();
  setupHeaderScroll();
  setupReveal();
});
