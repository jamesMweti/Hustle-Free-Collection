(() => {
  const KEY = "HustleFree_cart_v1";
  const ORDERS_KEY = "campusmart_demo_orders_v1";
  const products = () => window.HustleFreeProducts || [];
  const format = n => window.HustleFreeProductsFormat ? window.HustleFreeProducts(n) : `KSh ${n}`;
  function readCart() {
    try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
  }
  function writeCart(cart) { localStorage.setItem(KEY, JSON.stringify(cart)); updateCount(); }
  function updateCount() {
    const cart = readCart();
    const count = Object.values(cart).reduce((sum, qty) => sum + Number(qty || 0), 0);
    document.querySelectorAll("#cartCount").forEach(el => el.textContent = count);
  }
  function add(id) { const cart = readCart(); cart[id] = (cart[id] || 0) + 1; writeCart(cart); }
  function setQty(id, qty) { const cart = readCart(); if (qty <= 0) delete cart[id]; else cart[id] = qty; writeCart(cart); renderCart(); }
  function remove(id) { const cart = readCart(); delete cart[id]; writeCart(cart); renderCart(); }
  function cartEntries() {
    const cart = readCart();
    return Object.entries(cart).map(([id,qty]) => {
      const product = products().find(p => p.id === Number(id));
      return product ? {...product, qty:Number(qty)} : null;
    }).filter(Boolean);
  }
  function subtotal(items = cartEntries()) { return items.reduce((sum,p) => sum + p.price*p.qty, 0); }
  
function renderCart() {
  const root = document.getElementById("cartContent");
  if (!root) return;

  const items = cartEntries();

  if (!items.length) {
    root.innerHTML = `
      <div class="empty-state">
        <span>🛒</span>
        <h2>Your cart is empty</h2>
        <p>Please visit our Product Catalogue and choose your products.</p>
        <a class="btn btn-primary" href="products.html">
          Explore catalogue
        </a>
      </div>`;
    return;
  }

  root.innerHTML = `
    <div class="cart-items">
      ${items.map(p => `
        <div class="cart-row">

          <img
            class="cart-product-image"
            src="${p.image || 'images/placeholder.png'}"
            alt="${p.name}"
            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
          >

          

          <div class="cart-product-details">
            <h3>${p.name}</h3>
            <p>${format(p.price)} each</p>

            <div class="quantity-controls">
              <button data-qty="${p.id}" data-change="-1"
                aria-label="Decrease ${p.name} quantity">−</button>

              <strong>${p.qty}</strong>

              <button data-qty="${p.id}" data-change="1"
                aria-label="Increase ${p.name} quantity">+</button>

              <button class="remove-btn" data-remove="${p.id}">
                Remove
              </button>
            </div>
          </div>

          <strong class="cart-item-price">
            ${format(p.price * p.qty)}
          </strong>

        </div>
      `).join("")}
    </div>

    <aside class="order-summary">
      <h2>Order summary</h2>

      <div class="summary-line">
        <span>Subtotal</span>
        <strong>${format(subtotal(items))}</strong>
      </div>

      <div class="summary-line">
        <span>Delivery</span>
        <span>Calculated separately</span>
      </div>

      <div class="summary-line summary-total">
        <span>Total</span>
        <strong>${format(subtotal(items))}</strong>
      </div>

      <a class="btn btn-primary" href="checkout.html">
        Confirm your Picks
      </a>

      <a class="text-link" href="products.html"
        style="display:block;text-align:center;margin-top:14px">
        Keep shopping
      </a>
    </aside>
  `;

  root.querySelectorAll("[data-qty]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.qty);
      const currentQty = readCart()[id] || 0;

      setQty(id, currentQty + Number(btn.dataset.change));
    });
  });

  root.querySelectorAll("[data-remove]").forEach(btn => {
    btn.addEventListener("click", () => {
      remove(Number(btn.dataset.remove));
    });
  });
}

  function renderCheckout() {
    const root = document.getElementById("checkoutContent");
    if (!root) return;
    const items = cartEntries();
    if (!items.length) { root.innerHTML = `<div class="empty-state"><span>🛒</span><h2>You have picked nothing.</h2><p>Please explore our catalogue and add your products.</p><a class="btn btn-primary" href="products.html">Explore Catalogue →</a></div>`; return; }
    root.innerHTML = `<div class="checkout-grid"><form class="checkout-form" id="checkoutForm"><h2>Delivery details</h2><label class="form-field">Full name<input name="name" required autocomplete="name" placeholder="Your full name"></label><label class="form-field">Email address<input name="email" type="email" required autocomplete="email" placeholder="you@example.com"></label><label class="form-field">Delivery Location<input name="location" required placeholder="Your delivery point"></label><label class="form-field">Phone number (optional)<input name="phone" type="tel" placeholder="e.g. 07XX XXX XXX"></label><button class="btn btn-primary" type="submit">Place Your Order</button><p class="info">Please ensure you provide your correct details for easier and correct delivery. Thank you!</p></form><aside class="order-summary"><h2>Your order</h2>${items.map(p=>`<div class="summary-line"><span> ${p.name} × ${p.qty}</span><strong>${format(p.price*p.qty)}</strong></div>`).join("")}<div class="summary-line summary-total"><span>Total Price</span><strong>${format(subtotal(items))}</strong></div></aside></div>`;
    root.querySelector("#checkoutForm").addEventListener("submit", e => {
      e.preventDefault();
      const form = new FormData(e.currentTarget);
      const order = {reference:"CM-" + Date.now().toString().slice(-7),name:form.get("name"),email:form.get("email"),location:form.get("location"),total:subtotal(items),items:items.map(p=>({id:p.id,name:p.name,qty:p.qty,price:p.price})),date:new Date().toISOString()};
      let orders=[]; try {orders=JSON.parse(localStorage.getItem(ORDERS_KEY)||"[]")} catch {}
      orders.push(order); localStorage.setItem(ORDERS_KEY,JSON.stringify(orders)); localStorage.removeItem(KEY); updateCount();
      root.innerHTML = `<div class="success-panel"><h2>Congratulations. Your order placement was successful!</h2><p>Thank You, ${escapeHTML(order.name)}. We are looking forward to shopping with you again.</p><p><strong>Order reference: ${order.reference}</strong></p><p>Total Price: <strong>${format(order.total)}</strong></p><a class="btn btn-primary" href="products.html">Back to shopping →</a></div>`;
    });
  }
  function escapeHTML(s) { return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
  window.HustleFreeCart = {add,updateCount,read:readCart};
  document.addEventListener("DOMContentLoaded", () => { updateCount(); renderCart(); renderCheckout(); });
})();
