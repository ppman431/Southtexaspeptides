const PRODUCTS = [
  {
    id: "glp3r-25",
    name: "GLP3-R 10mg",
    short: "GLP-3R Appetite & Metabolic Peptide - Not for human consumption",
    purity: "99%+ purity",
    price: 75.0,
    tag: "Featured",
    badges: ["Research", "HPLC 99%"],
    ref: "GLP3-R-01",
    img: "GLP310.png",
    soldOut: false
  },
  {
    id: "glp3r-50",
    name: "GLP3-R 20mg",
    short: "GLP-3R Appetite & Metabolic Peptide - Not for human consumption",
    purity: "99%+ purity",
    price: 100.0,
    tag: "Featured",
    badges: ["Research", "HPLC 99%"],
    ref: "GLP3-R-01",
    img: "GLP320.png",
    soldOut: false
  },
  {
    id: "Cjc1295",
    name: "Cjc1295-Ipamorelin (no DAC) 10mg",
    short: "Cjc-Ipamorelin Growth Hormone-Releasing Hormone - Not for human consumption",
    purity: "99%+ purity",
    price: 75.0,
    tag: "Featured",
    badges: ["Research", "HPLC 99%"],
    ref: "CJC1295",
    img: "CJC.png",
    soldOut: false
  },
  {
    id: "GHKCu",
    name: "GHK-Cu 100mg",
    short: "Copper peptide studied for collagen and tissue repair signaling - Vial - Not for human consumption",
    purity: "99%+ purity",
    price: 50.0,
    tag: "Featured",
    badges: ["Research", "HPLC 99%"],
    ref: "GHK-CU",
    img: "GHK.png",
    soldOut: false
  },
  {
    id: "Klow",
    name: "Klow",
    short: "Peptide studied for tissue repair, inflammation reduction, and recovery support - Vial - Not for human consumption",
    purity: "99%+ purity",
    price: 100.0,
    tag: "Featured",
    badges: ["Research", "HPLC 99%"],
    ref: "KLOW",
    img: "KLOW.png",
    soldOut: true
  },
  {
    id: "GHRP-6",
    name: "GHRP-6 10mg",
    short: "A synthetic hexapeptide that stimulates the pituitary gland to release growth hormone (GH) - Not for human consumption",
    purity: "99%+ purity",
    price: 50.0,
    tag: "Featured",
    badges: ["Research", "HPLC 99%"],
    ref: "GHRP-6",
    img: "GHRP.png",
    soldOut: false
  },
  {
    id: "Nad+",
    name: "Nad+ 100mg",
    short: "Boosts cellular energy (ATP), supports DNA repair, reduces inflammation, and may improve metabolism and cognitive function - Not for human consumption",
    purity: "99%+ purity",
    price: 75.0,
    tag: "Featured",
    badges: ["Research", "HPLC 99%"],
    ref: "NAD+",
    img: "Nad.png",
    soldOut: true
  }
];

const els = {
  year: document.getElementById("year"),
  grid: document.getElementById("productGrid"),
  search: document.getElementById("searchInput"),
  cartDrawer: document.getElementById("cartDrawer"),
  openCartBtn: document.getElementById("openCartBtn"),
  closeCartBtn: document.getElementById("closeCartBtn"),
  closeCartOverlay: document.getElementById("closeCartOverlay"),
  cartCount: document.getElementById("cartCount"),
  cartItems: document.getElementById("cartItems"),
  cartTotal: document.getElementById("cartTotal"),
  cartSub: document.getElementById("cartSub"),
  checkoutBtn: document.getElementById("checkoutBtn"),
  hamburgerBtn: document.getElementById("hamburgerBtn"),
  mobileMenu: document.getElementById("mobileMenu")
};

const CART_KEY = "jcpeps_cart_v1";

function money(n) {
  return `$${n.toFixed(2)}`;
}

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function cartCount(cart) {
  return Object.values(cart).reduce((a, b) => a + b, 0);
}

function cartTotal(cart) {
  let total = 0;
  for (const [id, qty] of Object.entries(cart)) {
    const p = PRODUCTS.find((x) => x.id === id);
    if (p) total += p.price * qty;
  }
  return total;
}

function getCheckoutItems(cart) {
  const items = [];

  for (const [id, qty] of Object.entries(cart)) {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p || qty <= 0) continue;

    items.push({
      id: p.id,
      name: p.name,
      quantity: qty,
      price: Math.round(p.price * 100)
    });
  }

  return items;
}

function renderProducts(list) {
  if (!els.grid) return;

  els.grid.innerHTML = "";

  list.forEach((p) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="card__media">
        <div class="tag">${p.soldOut ? "Sold Out" : p.tag}</div>
        <div class="productimg">
          <img src="${p.img}" alt="${p.name}" style="width:100%;height:100%;object-fit:contain;">
        </div>
      </div>
      <div class="card__body">
        <div class="badgeRow">
          ${p.badges.map((b) => `<span class="badge">${b}</span>`).join("")}
        </div>
        <h3 class="card__title">${p.name}</h3>
        <p class="card__desc">${p.short}</p>
        <div class="card__meta">${p.purity}</div>
      <div class="card__foot">
  <div class="price">${money(p.price)}</div>
  ${
    p.soldOut
      ? `<button class="addbtn soldoutbtn" disabled>Sold Out</button>`
      : `<button class="addbtn" data-add="${p.id}">
           <span aria-hidden="true">🛒</span> Add
         </button>`
  }
</div>
      </div>
    `;
    els.grid.appendChild(card);
  });

  els.grid.querySelectorAll("[data-add]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-add");
      addToCart(id, 1);
      openCart();
    });
  });
}

function renderCart() {
  const cart = loadCart();
  const count = cartCount(cart);

  if (els.cartCount) els.cartCount.textContent = String(count);
  if (els.cartSub) els.cartSub.textContent = `${count} item${count === 1 ? "" : "s"}`;
  if (els.cartTotal) els.cartTotal.textContent = money(cartTotal(cart));

  if (!els.cartItems) return;

  const entries = Object.entries(cart);
  if (entries.length === 0) {
    els.cartItems.innerHTML = `
      <p style="color:rgba(31,36,48,.65); line-height:1.7; margin:14px 0;">
        Your cart is empty. Add a product to see it here.
      </p>
    `;
    return;
  }

  els.cartItems.innerHTML = "";

  for (const [id, qty] of entries) {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) continue;

    const row = document.createElement("div");
    row.className = "cartitem";
    row.innerHTML = `
      <div class="cartthumb">STP</div>
      <div class="cartinfo">
        <div class="cartname">${p.name}</div>
        <div class="cartmeta">${money(p.price)} • ${p.purity}</div>
        <div class="cartrow">
          <div class="qty" aria-label="Quantity controls">
            <button data-dec="${p.id}" aria-label="Decrease quantity">−</button>
            <span>${qty}</span>
            <button data-inc="${p.id}" aria-label="Increase quantity">+</button>
          </div>
          <button class="remove" data-remove="${p.id}">Remove</button>
        </div>
      </div>
    `;
    els.cartItems.appendChild(row);
  }

  els.cartItems.querySelectorAll("[data-inc]").forEach((b) => {
    b.addEventListener("click", () => addToCart(b.getAttribute("data-inc"), 1));
  });

  els.cartItems.querySelectorAll("[data-dec]").forEach((b) => {
    b.addEventListener("click", () => addToCart(b.getAttribute("data-dec"), -1));
  });

  els.cartItems.querySelectorAll("[data-remove]").forEach((b) => {
    b.addEventListener("click", () => removeFromCart(b.getAttribute("data-remove")));
  });
}

function addToCart(id, delta) {
  const cart = loadCart();
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  saveCart(cart);
  renderCart();
}

function removeFromCart(id) {
  const cart = loadCart();
  delete cart[id];
  saveCart(cart);
  renderCart();
}

function openCart() {
  if (!els.cartDrawer) return;
  els.cartDrawer.classList.add("is-open");
  els.cartDrawer.setAttribute("aria-hidden", "false");
  renderCart();
}

function closeCart() {
  if (!els.cartDrawer) return;
  els.cartDrawer.classList.remove("is-open");
  els.cartDrawer.setAttribute("aria-hidden", "true");
}

function setActiveNav() {
  const hash = location.hash || "#home";
  document.querySelectorAll(".nav__link").forEach((a) => {
    a.classList.toggle("is-active", a.getAttribute("href") === hash);
  });
}

async function handleCheckout() {
  const cart = loadCart();
  const items = getCheckoutItems(cart);

  if (items.length === 0) {
    alert("Your cart is empty.");
    return;
  }

 if (!BACKEND_URL) {
  alert("Backend URL is missing.");
  return;
}

  try {
    if (els.checkoutBtn) {
      els.checkoutBtn.disabled = true;
      els.checkoutBtn.textContent = "Redirecting...";
    }

    const response = await fetch(`${BACKEND_URL}/create-checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ items })
    });

    if (!response.ok) {
      throw new Error("Checkout request failed.");
    }

    const data = await response.json();

    if (!data.checkoutUrl) {
      throw new Error("No checkout URL returned.");
    }

    window.location.href = data.checkoutUrl;
  } catch (error) {
    console.error(error);
    alert("There was a problem starting checkout. Make sure your backend server is running.");
  } finally {
    if (els.checkoutBtn) {
      els.checkoutBtn.disabled = false;
      els.checkoutBtn.textContent = "Checkout";
    }
  }
}

function init() {
  if (els.year) els.year.textContent = new Date().getFullYear();

  renderProducts(PRODUCTS);
  renderCart();
  setActiveNav();

  if (els.search) {
    els.search.addEventListener("input", (e) => {
      const q = e.target.value.trim().toLowerCase();
      const filtered = PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.short.toLowerCase().includes(q) ||
          p.ref.toLowerCase().includes(q)
      );
      renderProducts(filtered);
    });
  }

  if (els.openCartBtn) els.openCartBtn.addEventListener("click", openCart);
  if (els.closeCartBtn) els.closeCartBtn.addEventListener("click", closeCart);
  if (els.closeCartOverlay) els.closeCartOverlay.addEventListener("click", closeCart);

  if (els.checkoutBtn) {
    els.checkoutBtn.addEventListener("click", handleCheckout);
  }

  window.addEventListener("hashchange", setActiveNav);

  if (els.hamburgerBtn && els.mobileMenu) {
    els.hamburgerBtn.addEventListener("click", () => {
      const expanded = els.hamburgerBtn.getAttribute("aria-expanded") === "true";
      els.hamburgerBtn.setAttribute("aria-expanded", String(!expanded));
      els.mobileMenu.setAttribute("aria-hidden", String(expanded));
      els.mobileMenu.style.display = expanded ? "none" : "block";
    });

    els.mobileMenu.style.display = "none";
  }
}

init();
