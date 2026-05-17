/* Cart & order totals */
(function (E) {
  function normalizeCart(cart) {
    return cart.map((item) => ({
      id: item.id,
      qty: item.qty,
      size: E.normalizeSize(item.size)
    }));
  }

  E.getCart = function () {
    try {
      return normalizeCart(JSON.parse(localStorage.getItem(E.CART_KEY) || "[]"));
    } catch {
      return [];
    }
  };

  E.saveCart = function (cart) {
    localStorage.setItem(E.CART_KEY, JSON.stringify(normalizeCart(cart)));
  };

  E.findCartItem = function (cart, id, size) {
    return cart.find((item) => item.id === id && item.size === E.normalizeSize(size));
  };

  E.getDeliveryMode = function () {
    const selected = document.querySelector('input[name="delivery"]:checked');
    return selected?.value === "express" ? "express" : "standard";
  };

  E.getExpressDeliveryFee = function (subtotal) {
    if (subtotal === 0) return 0;
    return E.getDeliveryMode() === "express" ? E.EXPRESS_DELIVERY_FEE : 0;
  };

  E.computeOrderTotals = function (cart) {
    let subtotal = 0;
    let count = 0;
    cart.forEach((item) => {
      const perfume = E.perfumes.find((p) => p.id === item.id);
      if (!perfume) return;
      subtotal += E.getVariantPrice(perfume, item.size) * item.qty;
      count += item.qty;
    });
    const shipping = subtotal >= E.FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : E.SHIPPING_FLAT;
    const delivery = E.getExpressDeliveryFee(subtotal);
    return { subtotal, shipping, delivery, total: subtotal + shipping + delivery, count };
  };

  E.cartStats = function () {
    return E.computeOrderTotals(E.getCart());
  };

  E.showToast = function (message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(E.showToast._timer);
    E.showToast._timer = setTimeout(() => toast.classList.remove("is-visible"), 3000);
  };

  E.addToCart = function (productId, size = 50, silent = false) {
    const cart = E.getCart();
    const s = E.normalizeSize(size);
    const existing = E.findCartItem(cart, productId, s);
    if (existing) existing.qty += 1;
    else cart.push({ id: productId, qty: 1, size: s });
    E.saveCart(cart);
    E.updateCartSummary();
    if (typeof E.refreshCheckoutSummary === "function") E.refreshCheckoutSummary();
    const pdpQty = document.getElementById("pdpCartQty");
    if (pdpQty) {
      pdpQty.textContent = cart.filter((e) => e.id === productId).reduce((sum, e) => sum + e.qty, 0);
    }
    if (!silent) {
      const perfume = E.perfumes.find((p) => p.id === productId);
      E.showToast(perfume ? `${perfume.name} (${s} ml) added` : "Added to cart");
    }
    if (typeof E.closeQuickDrawer === "function") E.closeQuickDrawer();
  };

  E.removeFromCart = function (productId, size = 50) {
    const s = E.normalizeSize(size);
    E.saveCart(E.getCart().filter((item) => !(item.id === productId && item.size === s)));
    E.updateCartSummary();
    if (typeof E.renderCheckoutItems === "function") E.renderCheckoutItems();
    if (typeof E.refreshCheckoutSummary === "function") E.refreshCheckoutSummary();
  };

  E.updateQty = function (productId, size, delta) {
    const cart = E.getCart();
    const s = E.normalizeSize(size);
    const item = E.findCartItem(cart, productId, s);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      E.removeFromCart(productId, s);
      return;
    }
    E.saveCart(cart);
    E.updateCartSummary();
    if (typeof E.renderCheckoutItems === "function") E.renderCheckoutItems();
    if (typeof E.refreshCheckoutSummary === "function") E.refreshCheckoutSummary();
  };

  window.updateQty = E.updateQty;
  window.removeFromCart = E.removeFromCart;

  E.updateShippingProgress = function () {
    const wrap = document.getElementById("shippingProgress");
    const fill = document.getElementById("shippingProgressFill");
    const text = document.getElementById("shippingProgressText");
    if (!wrap || !fill || !text) return;
    const { subtotal, count } = E.cartStats();
    if (!count) {
      wrap.hidden = true;
      return;
    }
    wrap.hidden = false;
    fill.style.width = `${Math.min(100, (subtotal / E.FREE_SHIPPING_THRESHOLD) * 100)}%`;
    const remaining = E.FREE_SHIPPING_THRESHOLD - subtotal;
    text.textContent = remaining > 0
      ? `Add ${E.formatINR(remaining)} more for free shipping`
      : "You've unlocked free shipping on this order";
  };

  E.updateCartSummary = function () {
    const { count, total } = E.cartStats();
    ["cartCount", "headerCartCount", "stickyCartCount"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.textContent = count;
    });
    const formatted = E.formatINR(total);
    ["cartTotal", "stickyCartTotal"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.textContent = formatted;
    });
    const stickyCart = document.getElementById("stickyCart");
    if (stickyCart) stickyCart.classList.toggle("is-visible", count > 0);
    E.updateShippingProgress();
    if (typeof E.updateWishlistBadge === "function") E.updateWishlistBadge();
  };
})(window.Eclat);
