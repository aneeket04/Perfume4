/* Navigation, wishlist, drawers, misc UI */
(function (E) {
  E.getWishlist = function () {
    try {
      return JSON.parse(localStorage.getItem(E.WISHLIST_KEY) || "[]");
    } catch {
      return [];
    }
  };

  E.isWishlisted = function (id) {
    return E.getWishlist().includes(id);
  };

  E.toggleWishlist = function (id) {
    let list = E.getWishlist();
    if (list.includes(id)) list = list.filter((x) => x !== id);
    else list = [...list, id];
    localStorage.setItem(E.WISHLIST_KEY, JSON.stringify(list));
    E.updateWishlistBadge();
    E.showToast(list.includes(id) ? "Saved to wishlist" : "Removed from wishlist");
  };

  E.updateWishlistBadge = function () {
    const el = document.getElementById("wishlistCount");
    if (el) el.textContent = E.getWishlist().length;
  };

  E.openQuickDrawer = function (productId) {
    const product = E.perfumes.find((p) => p.id === productId);
    const drawer = document.getElementById("quickDrawer");
    const body = document.getElementById("quickDrawerBody");
    if (!product || !drawer || !body) {
      if (product) E.addToCart(productId, 50);
      return;
    }
    let size = 50;
    const profile = getScentProfile(product.id);
    const img = E.getSafeProductImage(product);
    const fallback = E.buildFallbackImage("Perfume");
    body.innerHTML = `
      <img src="${img}" alt="${product.name}" class="quick-drawer__img" width="120" height="120"
        onerror="this.onerror=null;this.src='${fallback}';" />
      <h3>${product.name}</h3>
      <p class="quick-drawer__meta">${profile.family} · ${product.category}</p>
      <p class="price price--lg" id="quickDrawerPrice">${E.formatINR(E.getVariantPrice(product, 50))}</p>
      <div class="size-select" role="group">
        <button type="button" class="size-btn" data-qsize="5">5 ml</button>
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
        if (priceEl) priceEl.textContent = E.formatINR(E.getVariantPrice(product, size));
      });
    });
    document.getElementById("quickDrawerAdd")?.addEventListener("click", () => E.addToCart(product.id, size));
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
  };

  E.closeQuickDrawer = function () {
    const drawer = document.getElementById("quickDrawer");
    if (drawer) {
      drawer.classList.remove("is-open");
      drawer.setAttribute("aria-hidden", "true");
    }
  };

  E.setupQuickDrawer = function () {
    document.getElementById("quickDrawerClose")?.addEventListener("click", E.closeQuickDrawer);
    document.getElementById("quickDrawerBackdrop")?.addEventListener("click", E.closeQuickDrawer);
  };

  E.setupMobileNav = function () {
    const toggle = document.getElementById("navToggle");
    const nav = document.getElementById("siteNav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  };

  E.setupHeaderScroll = function () {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  };

  E.setupReveal = function () {
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
  };

  E.setupFeedbackForm = function () {
    const feedbackForm = document.getElementById("feedbackForm");
    const feedbackStatus = document.getElementById("feedbackStatus");
    if (!feedbackForm || !feedbackStatus) return;
    feedbackForm.addEventListener("submit", (event) => {
      event.preventDefault();
      feedbackStatus.textContent = "Thank you for your feedback. We appreciate your response.";
      feedbackForm.reset();
    });
  };

  E.injectSharedNav = function () {
    const navWrap = document.querySelector(".nav-wrap");
    if (!navWrap || document.getElementById("navToggle")) return;
    const actions = navWrap.querySelector(".nav-actions");
    if (!actions) return;
    const wish = document.createElement("a");
    wish.href = "wishlist.html";
    wish.className = "wishlist-pill";
    wish.innerHTML = `♥ <span id="wishlistCount">0</span>`;
    actions.insertBefore(wish, actions.firstChild);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "nav-toggle";
    btn.id = "navToggle";
    btn.setAttribute("aria-label", "Open menu");
    btn.setAttribute("aria-expanded", "false");
    btn.innerHTML = "<span></span><span></span><span></span>";
    const nav = navWrap.querySelector("nav");
    if (nav) nav.id = "siteNav";
    navWrap.insertBefore(btn, navWrap.querySelector("nav"));
    E.updateWishlistBadge();
  };
})(window.Eclat);
