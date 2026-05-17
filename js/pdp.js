/* Product detail page */
(function (E) {
  let pdpSelectedSize = 50;

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

  E.renderScentAccordWheel = function (productId) {
    const p = getScentProfile(productId);
    return `
      <div class="accord-wheel" aria-label="Scent accord wheel">
        <div class="accord-wheel__ring">
          <div class="accord-wheel__segment accord-wheel__segment--top"></div>
          <div class="accord-wheel__segment accord-wheel__segment--heart"></div>
          <div class="accord-wheel__segment accord-wheel__segment--base"></div>
          <div class="accord-wheel__center"><span>${p.family}</span><small>Accord</small></div>
        </div>
        <ul class="accord-wheel__legend">
          <li><span class="dot dot--top"></span> Top · ${p.top.slice(0, 2).join(", ")}</li>
          <li><span class="dot dot--heart"></span> Heart · ${p.heart.slice(0, 2).join(", ")}</li>
          <li><span class="dot dot--base"></span> Base · ${p.base.slice(0, 2).join(", ")}</li>
        </ul>
      </div>`;
  };

  E.renderScentPyramid = function (productId) {
    const profile = getScentProfile(productId);
    return `
      <section class="scent-pyramid" aria-label="Scent profile">
        <h3 class="section-title">Scent Profile</h3>
        <p class="scent-mood"><span class="family-badge">${profile.family}</span> · ${profile.mood}</p>
        ${E.renderScentAccordWheel(productId)}
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
  };

  E.renderSimilarProducts = function (productId) {
    const similar = E.getSimilarProducts(productId, 4);
    if (!similar.length) return "";
    const fallback = E.buildFallbackImage("Perfume");
    return `
      <section class="similar-products">
        <h3 class="section-title">Similar scents</h3>
        <div class="similar-products__grid">
          ${similar.map((p) => `
            <a href="product.html?id=${p.id}" class="similar-card">
              <img src="${E.getSafeProductImage(p)}" alt="" width="72" height="90" loading="lazy"
                onerror="this.onerror=null;this.src='${fallback}';" />
              <span>${p.name}</span>
              <small>${E.formatINR(E.getVariantPrice(p, 50))}</small>
            </a>`).join("")}
        </div>
      </section>`;
  };

  E.getProductFromUrl = function () {
    const id = Number(new URLSearchParams(window.location.search).get("id"));
    return id ? E.perfumes.find((item) => item.id === id) || null : null;
  };

  E.updatePdpPrice = function (product) {
    const priceEl = document.getElementById("pdpPrice");
    if (priceEl) priceEl.textContent = E.formatINR(E.getVariantPrice(product, pdpSelectedSize));
    const hint = document.getElementById("pdpSizeHint");
    if (!hint) return;
    [5, 50, 100].forEach((s) => {
      const active = pdpSelectedSize === s;
      const span = hint.querySelector(`[data-size-hint="${s}"]`);
      if (span) span.classList.toggle("is-active", active);
    });
    hint.innerHTML = [5, 50, 100].map((s) => {
      const active = pdpSelectedSize === s;
      return `<span class="size-hint ${active ? "is-active" : ""}" data-size-hint="${s}">${s} ml · ${E.formatINR(E.getVariantPrice(product, s))}</span>`;
    }).join('<span class="size-hint-sep">|</span>');
  };

  E.setupPdpGallery = function (product) {
    const main = document.getElementById("pdpMainImage");
    const thumbs = document.querySelectorAll(".pdp-thumb");
    if (!main) return;
    thumbs.forEach((btn) => {
      btn.addEventListener("click", () => {
        thumbs.forEach((t) => t.classList.remove("is-active"));
        btn.classList.add("is-active");
        main.src = btn.dataset.src;
        main.alt = btn.dataset.alt || product.name;
      });
    });
  };

  E.renderProductDetail = function () {
    const productDetail = document.getElementById("productDetail");
    if (!productDetail) return;
    const product = E.getProductFromUrl();
    if (!product) {
      productDetail.innerHTML = `<div class="info-card empty-state"><h2>Fragrance not found</h2>
        <p>Return to the collection and choose a scent that speaks to you.</p>
        <a class="btn" href="index.html">Browse collection</a></div>`;
      return;
    }
    pdpSelectedSize = 50;
    const profile = getScentProfile(product.id);
    const cartQty = E.getCart().filter((i) => i.id === product.id).reduce((s, i) => s + i.qty, 0);
    const primary = E.getSafeProductImage(product);
    const alternate = product.hoverImage || E.buildPerfumeHoverImage(product.id);
    const fallback = E.buildFallbackImage("Perfume Photo");

    productDetail.innerHTML = `
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="index.html">Home</a><span>/</span>
        <a href="index.html#products">${product.category}</a><span>/</span>
        <span aria-current="page">${product.name}</span>
      </nav>
      <article class="product-detail-layout">
        <div class="product-detail-gallery">
          <div class="product-detail-image-wrap">
            <img id="pdpMainImage" src="${primary}" alt="${product.name}" class="product-detail-image"
              width="480" height="480" decoding="async"
              onerror="this.onerror=null;this.src='${fallback}';" />
          </div>
          <div class="pdp-thumbs" role="list">
            <button type="button" class="pdp-thumb is-active" data-src="${primary}" data-alt="${product.name}" aria-label="Bottle view">Bottle</button>
            <button type="button" class="pdp-thumb" data-src="${alternate}" data-alt="${product.name} alternate view" aria-label="Alternate view">Alt</button>
          </div>
        </div>
        <div class="product-detail-info">
          <p class="eyebrow">${product.category} · ${product.gender}</p>
          <h2>${product.name}</h2>
          <p class="product-tagline">${profile.mood}</p>
          <p class="price price--lg" id="pdpPrice"></p>
          <p class="price-variant-hint" id="pdpSizeHint"></p>
          <p class="product-desc">Try a <strong>5 ml decant</strong> before committing to a full bottle. All sizes update price instantly.</p>
          
          <div class="size-select" role="group" aria-label="Bottle size">
            <button type="button" class="size-btn" data-size="5" aria-pressed="false">5 ml sample</button>
            <button type="button" class="size-btn is-active" data-size="50" aria-pressed="true">50 ml</button>
            <button type="button" class="size-btn" data-size="100" aria-pressed="false">100 ml</button>
          </div>
          <p class="cart-qty-line">In cart: <strong id="pdpCartQty">${cartQty}</strong></p>
          <div class="product-detail-actions">
            <button class="btn" id="addCurrentProduct" type="button">Add to Cart</button>
            <button class="btn btn--outline" type="button" id="toggleWishlistPdp" data-wish-pdp="${product.id}">
              ${E.isWishlisted(product.id) ? "♥ Saved" : "♡ Save"}
            </button>
            <a class="btn btn-muted" href="index.html">Continue Shopping</a>
          </div>
          ${E.renderScentPyramid(product.id)}
          ${E.renderSimilarProducts(product.id)}
        </div>
      </article>
      <div class="pdp-sticky-bar" id="pdpStickyBar">
        <span class="pdp-sticky-bar__price" id="pdpStickyPrice"></span>
        <button type="button" class="btn btn--sm" id="pdpStickyAdd">Add to Cart</button>
      </div>`;

    document.getElementById("addCurrentProduct")?.addEventListener("click", () => E.addToCart(product.id, pdpSelectedSize));
    document.getElementById("pdpStickyAdd")?.addEventListener("click", () => E.addToCart(product.id, pdpSelectedSize));
    document.getElementById("toggleWishlistPdp")?.addEventListener("click", (e) => {
      E.toggleWishlist(product.id);
      e.currentTarget.textContent = E.isWishlisted(product.id) ? "♥ Saved" : "♡ Save";
    });
    document.querySelectorAll(".size-btn[data-size]").forEach((btn) => {
      btn.addEventListener("click", () => {
        pdpSelectedSize = Number(btn.dataset.size);
        document.querySelectorAll(".size-btn[data-size]").forEach((b) => {
          const active = Number(b.dataset.size) === pdpSelectedSize;
          b.classList.toggle("is-active", active);
          b.setAttribute("aria-pressed", active ? "true" : "false");
        });
        E.updatePdpPrice(product);
        const sticky = document.getElementById("pdpStickyPrice");
        if (sticky) sticky.textContent = E.formatINR(E.getVariantPrice(product, pdpSelectedSize));
      });
    });
    E.updatePdpPrice(product);
    E.setupPdpGallery(product);
    const sticky = document.getElementById("pdpStickyPrice");
    if (sticky) sticky.textContent = E.formatINR(E.getVariantPrice(product, pdpSelectedSize));
    E.trackRecentlyViewed(product.id);
  };
})(window.Eclat);
