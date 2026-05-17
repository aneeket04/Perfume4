/* Product grid, filters, search */
(function (E) {
  E.getActiveFilters = function () {
    return {
      searchTerm: (document.getElementById("searchInput")?.value || "").toLowerCase(),
      category: document.getElementById("categoryFilter")?.value || "all",
      gender: document.getElementById("genderFilter")?.value || "all",
      family: document.getElementById("familyFilter")?.value || "all",
      sort: document.getElementById("sortFilter")?.value || "featured"
    };
  };

  E.filterPerfumes = function (filters) {
    let list = E.perfumes.filter((item) => {
      const profile = getScentProfile(item.id);
      const matchSearch = item.name.toLowerCase().includes(filters.searchTerm);
      const matchCategory = filters.category === "all" || item.category === filters.category;
      const matchGender = filters.gender === "all" || item.gender === filters.gender;
      const matchFamily = filters.family === "all" || profile.family === filters.family;
      return matchSearch && matchCategory && matchGender && matchFamily;
    });
    switch (filters.sort) {
      case "price-asc": list = [...list].sort((a, b) => a.price - b.price); break;
      case "price-desc": list = [...list].sort((a, b) => b.price - a.price); break;
      case "name": list = [...list].sort((a, b) => a.name.localeCompare(b.name)); break;
      default: break;
    }
    return list;
  };

  E.renderProductCard = function (item, index) {
    const profile = getScentProfile(item.id);
    const primary = E.getSafeProductImage(item);
    const hover = item.hoverImage || E.buildPerfumeHoverImage(item.id);
    const fallback = E.buildFallbackImage("Perfume");
    const wishlisted = E.isWishlisted(item.id);
    return `
    <article class="product-card" style="--delay:${index * 40}ms" data-animate data-id="${item.id}">
      <button type="button" class="wishlist-btn ${wishlisted ? "is-active" : ""}" data-wish="${item.id}" aria-label="Wishlist">♥</button>
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
          <span class="badge badge--sample">5 ml sample</span>
        </div>
        <div class="price-row">
          <span class="price">From ${E.formatINR(E.getVariantPrice(item, 5))}</span>
          <div class="card-actions">
            <button class="btn btn--ghost btn--sm" type="button" data-quick="${item.id}">Quick</button>
            <button class="btn btn--sm" data-id="${item.id}" type="button">Add</button>
          </div>
        </div>
        <a href="product.html?id=${item.id}" class="details-link">Explore scent →</a>
      </div>
    </article>`;
  };

  E.renderProducts = function () {
    const grid = document.getElementById("productsGrid");
    if (!grid) return;
    const filtered = E.filterPerfumes(E.getActiveFilters());
    const resultsCount = document.getElementById("resultsCount");
    if (resultsCount) {
      resultsCount.textContent = `${filtered.length} fragrance${filtered.length === 1 ? "" : "s"} · prices in INR`;
    }
    grid.style.minHeight = `${grid.offsetHeight}px`;
    grid.classList.add("is-updating");
    grid.innerHTML = filtered.map((item, i) => E.renderProductCard(item, i)).join("");
    requestAnimationFrame(() => {
      grid.classList.remove("is-updating");
      grid.style.minHeight = "";
      grid.querySelectorAll("[data-animate]").forEach((el, i) => {
        setTimeout(() => el.classList.add("is-visible"), i * 35);
      });
    });
    grid.querySelectorAll("button[data-id], button[data-quick]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        E.openQuickDrawer(Number(btn.dataset.id || btn.dataset.quick));
      });
    });
    grid.querySelectorAll("[data-wish]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        E.toggleWishlist(Number(btn.dataset.wish));
        E.renderProducts();
      });
    });
  };

  E.setCategoryFilter = function (value) {
    const categoryFilter = document.getElementById("categoryFilter");
    if (categoryFilter) categoryFilter.value = value;
    document.querySelectorAll(".category-pill").forEach((pill) => {
      pill.classList.toggle("is-active", pill.dataset.category === value);
    });
    E.renderProducts();
  };
  window.setCategoryFilter = E.setCategoryFilter;

  E.setupCategoryPills = function () {
    document.querySelectorAll(".category-pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        E.setCategoryFilter(pill.dataset.category || "all");
        document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
    document.querySelectorAll(".family-pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        const familyFilter = document.getElementById("familyFilter");
        const val = pill.dataset.family || "all";
        if (familyFilter) familyFilter.value = val;
        document.querySelectorAll(".family-pill").forEach((p) => p.classList.toggle("is-active", p.dataset.family === val));
        E.renderProducts();
      });
    });
  };

  E.setupProductControls = function () {
    const debouncedRender = E.debounce(E.renderProducts);
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      searchInput.addEventListener("input", () => {
        E.updateSearchSuggestions();
        debouncedRender();
      });
      searchInput.addEventListener("focus", E.updateSearchSuggestions);
    }
    ["categoryFilter", "genderFilter", "familyFilter", "sortFilter"].forEach((id) => {
      document.getElementById(id)?.addEventListener("change", E.renderProducts);
    });
  };

  E.updateSearchSuggestions = function () {
    const box = document.getElementById("searchSuggestions");
    const input = document.getElementById("searchInput");
    if (!box || !input) return;
    const term = input.value.toLowerCase().trim();
    if (term.length < 1) {
      box.hidden = true;
      return;
    }
    const matches = E.perfumes.filter((p) => p.name.toLowerCase().includes(term)).slice(0, 6);
    if (!matches.length) {
      box.hidden = true;
      return;
    }
    box.hidden = false;
    box.innerHTML = matches.map((p) => `
      <button type="button" class="search-suggestion" data-goto="${p.id}">
        <span>${p.name}</span>
        <small>${p.category} · ${E.formatINR(p.price)}</small>
      </button>`).join("");
    box.querySelectorAll("[data-goto]").forEach((btn) => {
      btn.addEventListener("click", () => {
        window.location.href = `product.html?id=${btn.dataset.goto}`;
      });
    });
  };

  E.renderRecentlyViewed = function () {
    const section = document.getElementById("recentlyViewedSection");
    const grid = document.getElementById("recentlyViewedGrid");
    if (!section || !grid) return;
    let ids = [];
    try { ids = JSON.parse(localStorage.getItem(E.RECENT_KEY) || "[]"); } catch { /* */ }
    const items = ids.map((id) => E.perfumes.find((p) => p.id === id)).filter(Boolean);
    if (!items.length) { section.hidden = true; return; }
    section.hidden = false;
    const fallback = E.buildFallbackImage("Perfume");
    grid.innerHTML = items.map((item) => `
      <a href="product.html?id=${item.id}" class="recent-card">
        <img src="${E.getSafeProductImage(item)}" alt="" width="80" height="100" loading="lazy"
          onerror="this.onerror=null;this.src='${fallback}';" />
        <span>${item.name}</span>
        <small>${E.formatINR(item.price)}</small>
      </a>`).join("");
  };

  E.trackRecentlyViewed = function (productId) {
    try {
      let ids = JSON.parse(localStorage.getItem(E.RECENT_KEY) || "[]");
      ids = [productId, ...ids.filter((id) => id !== productId)].slice(0, 4);
      localStorage.setItem(E.RECENT_KEY, JSON.stringify(ids));
    } catch { /* */ }
  };
})(window.Eclat);
