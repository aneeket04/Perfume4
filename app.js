/* Éclat — bootstrap */
(async function initEclat() {
  const E = window.Eclat;
  try {
    await E.loadCatalog();
  } catch (err) {
    console.error(err);
    const grid = document.getElementById("productsGrid");
    if (grid) {
      grid.innerHTML = `<p class="empty-cart-msg">Could not load catalog. Please refresh the page.</p>`;
    }
    return;
  }

  E.injectSharedNav();
  E.setupMobileNav();
  E.setupQuickDrawer();
  E.setupQuiz();
  E.setupProductControls();
  E.setupCategoryPills();
  E.renderProducts();
  E.renderProductDetail();
  E.renderCheckoutItems();
  E.setupCheckoutAccordion();
  E.setupDeliveryOptions();
  E.setupCheckoutForm();
  E.setupFeedbackForm();
  E.updateCartSummary();
  E.renderRecentlyViewed();
  E.setupHeaderScroll();
  E.setupReveal();

  document.querySelectorAll("[data-jump-category]").forEach((card) => {
    card.addEventListener("click", () => {
      const cat = card.dataset.jumpCategory;
      const filter = document.getElementById("categoryFilter");
      if (filter) filter.value = cat;
      document.querySelectorAll(".category-pill").forEach((p) => {
        p.classList.toggle("is-active", p.dataset.category === cat);
      });
      E.setCategoryFilter(cat);
      document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
    });
  });
})();
