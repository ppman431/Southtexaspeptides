const PRODUCTS = [
  {
    id: "glp3r-25",
    name: "GLP3-R 2.5mg",
    short: "GLP-3R Appetite & Metabolic Peptide - Injection",
    purity: "99%+ purity",
    price: 25.00,
    tag: "Featured",
    badges: ["Research", "HPLC 99%"],
    ref: "GLP3-R-01"
  },
  {
    id: "glp3r-50",
    name: "GLP-3R 5.0mg",
    short: "GLP-3R Appetite & Metabolic Peptide - Injection",
    purity: "99%+ purity",
    price: 37.50,
    tag: "Featured",
    badges: ["Research", "HPLC 99%"],
    ref: "GLP3-R-01"
  },
  {
    id: "glp3r-75",
    name: "GLP-3R 7.5mg",
    short: "GLP-3R Appetite & Metabolic Peptide - Injection",
    purity: "99%+ purity",
    price: 50.00,
    tag: "Featured",
    badges: ["Research", "HPLC 99%"],
    ref: "GLP3-R-01"
  }
  const PRODUCTS = [
  {
    id: "item-1",
    name: "Product 1",
    short: "Short product description here.",
    purity: "99%+ purity",
    price: 25.00,
    tag: "Featured",
    badges: ["Research", "HPLC 99%"],
    ref: "STP-01"
  },
  {
    id: "item-2",
    name: "Product 2",
    short: "Short product description here.",
    purity: "99%+ purity",
    price: 37.50,
    tag: "Featured",
    badges: ["Research", "HPLC 99%"],
    ref: "STP-02"
  },
  {
    id: "item-3",
    name: "Product 3",
    short: "Short product description here.",
    purity: "99%+ purity",
    price: 50.00,
    tag: "Featured",
    badges: ["Research", "HPLC 99%"],
    ref: "STP-03"
  },
  {
    id: "item-4",
    name: "Product 4",
    short: "Short product description here.",
    purity: "99%+ purity",
    price: 65.00,
    tag: "Featured",
    badges: ["Research", "HPLC 99%"],
    ref: "STP-04"
  },
  {
    id: "item-5",
    name: "Product 5",
    short: "Short product description here.",
    purity: "99%+ purity",
    price: 75.00,
    tag: "Featured",
    badges: ["Research", "HPLC 99%"],
    ref: "STP-05"
  },
  {
    id: "item-6",
    name: "Product 6",
    short: "Short product description here.",
    purity: "99%+ purity",
    price: 100.00,
    tag: "Featured",
    badges: ["Research", "HPLC 99%"],
    ref: "STP-06"
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
  mobileMenu: document.getElementById("mobileMenu"),
};

const CART_KEY = "jcpeps_cart_v1";

function money(n){ return `$${n.toFixed(2)}`; }

function loadCart(){
  try{
    const raw = localStorage.getItem(CART_KEY);
    if(!raw) return {};
    return JSON.parse(raw);
  }catch{
    return {};
  }
}
function saveCart(cart){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
function cartCount(cart){
  return Object.values(cart).reduce((a,b)=>a+b,0);
}
function cartTotal(cart){
  let total = 0;
  for(const [id, qty] of Object.entries(cart)){
    const p = PRODUCTS.find(x=>x.id===id);
    if(p) total += p.price * qty;
  }
  return total;
}

function renderProducts(list){
  els.grid.innerHTML = "";
  list.forEach(p=>{
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="card__media">
        <div class="tag">${p.tag}</div>
        <div class="productimg">
          <div style="text-align:center; line-height:1.1">
            <div style="font-size:12px; opacity:.9">J&C PEPTIDES</div>
            <div style="font-size:22px; margin-top:10px">${p.ref}</div>
          </div>
        </div>
      </div>
      <div class="card__body">
        <div class="badgeRow">
          ${p.badges.map(b=>`<span class="badge">${b}</span>`).join("")}
        </div>
        <h3 class="card__title">${p.name}</h3>
        <p class="card__desc">${p.short}</p>
        <div class="card__meta">${p.purity}</div>
        <div class="card__foot">
          <div class="price">${money(p.price)}</div>
          <button class="addbtn" data-add="${p.id}">
            <span aria-hidden="true">🛒</span> Add
          </button>
        </div>
      </div>
    `;
    els.grid.appendChild(card);
  });

  els.grid.querySelectorAll("[data-add]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = btn.getAttribute("data-add");
      addToCart(id, 1);
      openCart();
    });
  });
}

function renderCart(){
  const cart = loadCart();
  const count = cartCount(cart);
  els.cartCount.textContent = String(count);
  els.cartSub.textContent = `${count} item${count===1?"":"s"}`;
  els.cartTotal.textContent = money(cartTotal(cart));

  const entries = Object.entries(cart);
  if(entries.length === 0){
    els.cartItems.innerHTML = `<p style="color:rgba(234,240,255,.65); line-height:1.7; margin:14px 0;">
      Your cart is empty. Add a product to see it here.
    </p>`;
    return;
  }

  els.cartItems.innerHTML = "";
  for(const [id, qty] of entries){
    const p = PRODUCTS.find(x=>x.id===id);
    if(!p) continue;

    const row = document.createElement("div");
    row.className = "cartitem";
    row.innerHTML = `
      <div class="cartthumb">J&C</div>
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

  els.cartItems.querySelectorAll("[data-inc]").forEach(b=>{
    b.addEventListener("click", ()=> addToCart(b.getAttribute("data-inc"), 1));
  });
  els.cartItems.querySelectorAll("[data-dec]").forEach(b=>{
    b.addEventListener("click", ()=> addToCart(b.getAttribute("data-dec"), -1));
  });
  els.cartItems.querySelectorAll("[data-remove]").forEach(b=>{
    b.addEventListener("click", ()=> removeFromCart(b.getAttribute("data-remove")));
  });
}

function addToCart(id, delta){
  const cart = loadCart();
  cart[id] = (cart[id] || 0) + delta;
  if(cart[id] <= 0) delete cart[id];
  saveCart(cart);
  renderCart();
}
function removeFromCart(id){
  const cart = loadCart();
  delete cart[id];
  saveCart(cart);
  renderCart();
}

function openCart(){
  els.cartDrawer.classList.add("is-open");
  els.cartDrawer.setAttribute("aria-hidden", "false");
  renderCart();
}
function closeCart(){
  els.cartDrawer.classList.remove("is-open");
  els.cartDrawer.setAttribute("aria-hidden", "true");
}

function setActiveNav(){
  const hash = location.hash || "#home";
  document.querySelectorAll(".nav__link").forEach(a=>{
    a.classList.toggle("is-active", a.getAttribute("href") === hash);
  });
}

function init(){
  els.year.textContent = new Date().getFullYear();
  renderProducts(PRODUCTS);
  renderCart();
  setActiveNav();

  els.search.addEventListener("input", (e)=>{
    const q = e.target.value.trim().toLowerCase();
    const filtered = PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.short.toLowerCase().includes(q) ||
      p.ref.toLowerCase().includes(q)
    );
    renderProducts(filtered);
  });

  els.openCartBtn.addEventListener("click", openCart);
  els.closeCartBtn.addEventListener("click", closeCart);
  els.closeCartOverlay.addEventListener("click", closeCart);

  els.checkoutBtn.addEventListener("click", ()=>{
    alert("Demo checkout — to accept real payments, connect Stripe/Shopify later.");
  });

  window.addEventListener("hashchange", setActiveNav);

  // Mobile menu toggle
  els.hamburgerBtn.addEventListener("click", ()=>{
    const expanded = els.hamburgerBtn.getAttribute("aria-expanded") === "true";
    els.hamburgerBtn.setAttribute("aria-expanded", String(!expanded));
    els.mobileMenu.setAttribute("aria-hidden", String(expanded));
    els.mobileMenu.style.display = expanded ? "none" : "block";
  });

  // default mobile menu hidden
  els.mobileMenu.style.display = "none";
}

init();
