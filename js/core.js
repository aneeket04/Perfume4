/* Core config, formatting, catalog helpers */
window.Eclat = window.Eclat || {};

Object.assign(window.Eclat, {
  CART_KEY: "aromaVaultCart",
  WISHLIST_KEY: "eclatWishlist",
  RECENT_KEY: "eclatRecentlyViewed",
  FREE_SHIPPING_THRESHOLD: 4999,
  SHIPPING_FLAT: 149,
  EXPRESS_DELIVERY_FEE: 199,
  SIZE_MULTIPLIER: { 5: 0.22, 50: 1, 100: 1.75 },
  VALID_SIZES: [5, 50, 100],
  perfumes: [],

  inrFormatter: new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }),

  formatINR(amount) {
    return this.inrFormatter.format(Math.round(amount));
  },

  buildPerfumeImage(id) {
    const safeId = String(id).padStart(2, "0");
    return `assets/images/${safeId}.optimized.jpg`;
  },

  buildPerfumeHoverImage(id) {
    const safeId = String(id).padStart(2, "0");
    return `assets/images/${safeId}.jpg`;
  },

  buildFallbackImage(name) {
    const safeName = encodeURIComponent(name);
    return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='640' height='640'><rect width='100%' height='100%' fill='%2316161f'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='26' fill='%23d4a853'>${safeName}</text></svg>`;
  },

  normalizeSize(size) {
    const n = Number(size);
    if (n === 5) return 5;
    if (n === 100) return 100;
    return 50;
  },

  getVariantPrice(product, size = 50) {
    const mult = this.SIZE_MULTIPLIER[this.normalizeSize(size)] || 1;
    return Math.round(product.price * mult);
  },

  getSafeProductImage(product) {
    return product.image || this.buildPerfumeImage(product.id);
  },

  debounce(fn, ms = 220) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), ms);
    };
  },

  enrichProduct(raw) {
    return {
      ...raw,
      image: this.buildPerfumeImage(raw.id),
      hoverImage: this.buildPerfumeHoverImage(raw.id)
    };
  },

  async loadCatalog() {
    const res = await fetch("products.json");
    if (!res.ok) throw new Error("Could not load products.json");
    const data = await res.json();
    this.perfumes = data.map((p) => this.enrichProduct(p));
    return this.perfumes;
  },

  getSimilarProducts(productId, limit = 4) {
    const product = this.perfumes.find((p) => p.id === productId);
    if (!product) return [];
    const profile = typeof getScentProfile === "function" ? getScentProfile(productId) : { family: "Fresh" };
    return this.perfumes
      .filter((p) => p.id !== productId)
      .map((p) => {
        const pf = getScentProfile(p.id);
        let score = 0;
        if (pf.family === profile.family) score += 4;
        if (p.category === product.category) score += 2;
        if (p.gender === product.gender || p.gender === "Unisex" || product.gender === "Unisex") score += 1;
        score -= Math.abs(p.price - product.price) / 10000;
        return { p, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((x) => x.p);
  }
});
