/* Checkout page */
(function (E) {
  E.renderCheckoutLineItems = function (containerId) {
    const container = document.getElementById(containerId);
    if (!container) return E.computeOrderTotals(E.getCart());
    const cart = E.getCart();
    if (!cart.length) {
      container.innerHTML = `<p class="empty-cart-msg">Your cart is empty. <a href="index.html#products">Discover fragrances</a></p>`;
      return { subtotal: 0, shipping: 0, delivery: 0, total: 0, count: 0 };
    }
    const fallback = E.buildFallbackImage("Perfume");
    let subtotal = 0;
    container.innerHTML = cart.map((item) => {
      const perfume = E.perfumes.find((p) => p.id === item.id);
      if (!perfume) return "";
      const unit = E.getVariantPrice(perfume, item.size);
      const line = unit * item.qty;
      subtotal += line;
      return `
        <div class="checkout-line">
          <img src="${E.getSafeProductImage(perfume)}" alt="" width="52" height="52" class="checkout-thumb" loading="lazy"
            onerror="this.onerror=null;this.src='${fallback}';" />
          <div class="checkout-line__info">
            <strong>${perfume.name}</strong>
            <span>${item.size} ml · ${E.formatINR(unit)} each</span>
          </div>
          <div class="checkout-line__end">
            <span class="checkout-line__price">${E.formatINR(line)}</span>
            <div class="checkout-actions">
              <button type="button" onclick="updateQty(${item.id}, ${item.size}, 1)">+</button>
              <button type="button" onclick="updateQty(${item.id}, ${item.size}, -1)">−</button>
              <button class="remove-btn" type="button" onclick="removeFromCart(${item.id}, ${item.size})">Remove</button>
            </div>
            <small>Qty ${item.qty}</small>
          </div>
        </div>`;
    }).join("");
    const shipping = subtotal >= E.FREE_SHIPPING_THRESHOLD ? 0 : E.SHIPPING_FLAT;
    const delivery = E.getExpressDeliveryFee(subtotal);
    return { subtotal, shipping, delivery, total: subtotal + shipping + delivery, count: cart.reduce((s, i) => s + i.qty, 0) };
  };

  E.refreshCheckoutSummary = function () {
    const totals = E.computeOrderTotals(E.getCart());
    const subEl = document.getElementById("summarySubtotal");
    const shipEl = document.getElementById("summaryShipping");
    const deliveryRow = document.getElementById("summaryDeliveryRow");
    const deliveryEl = document.getElementById("summaryDelivery");
    const totalEl = document.getElementById("summaryTotal");
    if (subEl) subEl.textContent = E.formatINR(totals.subtotal);
    if (shipEl) shipEl.textContent = totals.shipping === 0 ? "FREE" : E.formatINR(totals.shipping);
    if (deliveryRow) deliveryRow.hidden = !totals.delivery;
    if (deliveryEl) deliveryEl.textContent = E.formatINR(totals.delivery);
    if (totalEl) totalEl.textContent = E.formatINR(totals.total);
    const shipNote = document.getElementById("shippingNote");
    if (shipNote) {
      const remaining = E.FREE_SHIPPING_THRESHOLD - totals.subtotal;
      shipNote.textContent = totals.subtotal === 0
        ? `Free shipping on orders above ${E.formatINR(E.FREE_SHIPPING_THRESHOLD)}`
        : remaining > 0
          ? `Add ${E.formatINR(remaining)} more for free shipping`
          : "You've unlocked free shipping";
    }
  };

  E.renderCheckoutItems = function () {
    E.renderCheckoutLineItems("checkoutItems");
    E.renderCheckoutLineItems("checkoutSummaryItems");
    E.refreshCheckoutSummary();
  };

  E.setupDeliveryOptions = function () {
    document.querySelectorAll(".delivery-option").forEach((label) => {
      label.addEventListener("click", () => {
        document.querySelectorAll(".delivery-option").forEach((l) => l.classList.remove("is-selected"));
        label.classList.add("is-selected");
        E.refreshCheckoutSummary();
      });
    });
    document.querySelectorAll('input[name="delivery"]').forEach((radio) => {
      radio.addEventListener("change", E.refreshCheckoutSummary);
    });
  };

  E.setupCheckoutAccordion = function () {
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
      } else body.setAttribute("hidden", "");
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
  };

  E.setupCheckoutForm = function () {
    const checkoutForm = document.getElementById("checkoutForm");
    const orderStatus = document.getElementById("orderStatus");
    const loader = document.getElementById("checkoutLoader");
    if (!checkoutForm) return;
    checkoutForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!E.getCart().length) {
        if (orderStatus) orderStatus.textContent = "Add items to cart before placing your order.";
        return;
      }
      if (loader) loader.classList.add("is-active");
      if (orderStatus) orderStatus.textContent = "";
      await new Promise((r) => setTimeout(r, 1600));
      if (loader) loader.classList.remove("is-active");
      if (orderStatus) orderStatus.textContent = "Order placed successfully. Thank you for shopping with Éclat.";
      checkoutForm.reset();
      E.saveCart([]);
      E.renderCheckoutItems();
      E.updateCartSummary();
      E.showToast("Order confirmed — thank you!");
    });
  };
})(window.Eclat);
