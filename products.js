const HUSTLEFREE_PRODUCTS = [
  {id:1,name:"Campus Backpack",category:"Style",price:1200,badge:"Everyone's Pick",description:"Carry your books to lectures and your laptop during leisure.",tone:"style",image:"Backpack.jpg"},
  {id:2,name:"Scientific Calculator",category:"Study",price:900,badge:"Study essential",description:"Stress less as you do your assignments and complex calculations.",tone:"study",image:"Calculator.jpg"},
  {id:3,name:"Wireless Mouse",category:"Tech",price:800,badge:"Electonics",description:"Hasten working on your laptop.",tone:"electronics",image:"mouse.jpg"},
  {id:4,name:"Sneakers",category:"Style",price:1800,badge:"Fresh style",description:"Drip around with the lattest fashion.",tone:"style",image:"sneakers.jpg"},
  {id:5,name:"Wrist Watch",category:"Lifestyle",price:650,badge:"New Arrivals",description:"Save your time and look elegant.",tone:"lifestyle",image:"Watch.jpg"},
  {id:6,name:"Pizza", category:"Snacks",price:650,badge:"Get some snacks",description:"Indulge in the mmm! with a our tasty pizza.",tone:"snacks",image:"Pizza.jpg"},
  {id:7,name:"Laptop", category:"Electronics",price:32000,badge:"Experince first hand moments",description:"Revise clearly, and watch your entertainment on the wide screen.",tone:"electronics",image:"laptop.jpg"}
];

window.HustleFreeProducts = HUSTLEFREE_PRODUCTS;
window.HustleFreeFormat = amount => new Intl.NumberFormat("en-KE",{style:"currency",currency:"KES",maximumFractionDigits:0}).format(amount);

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("productGrid");
  if (!grid) return;
  let activeCategory = "All";
  const search = document.getElementById("productSearch");
  function render() {
    const term = (search?.value || "").trim().toLowerCase();
    const filtered = HUSTLEFREE_PRODUCTS.filter(p =>
      (activeCategory === "All" || p.category === activeCategory) &&
      `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(term)
    );
    grid.innerHTML = filtered.length ? filtered.map(p => `
      <article class="product-card">
        <div class="product-image ${p.tone}">
        <span class="product-badge">${p.badge}</span>
        <img src="${p.image}" alt="${p.name}" class="product-photo">
        </div>
        <div class="product-info"><span class="product-category">${p.category}</span><h3>${p.name}</h3>
        <p class="product-description">${p.description}</p>
        <div class="product-bottom"><span class="product-price">${window.HustleFreeFormat(p.price)}</span>
        <button class="add-btn" data-add="${p.id}" aria-label="Add ${p.name} to cart">+ Add</button></div></div>
      </article>`).join("") : `<div class="empty-state"><h2>No products found</h2><p>Try another search or category.</p></div>`;
  }
  document.getElementById("categoryFilters")?.addEventListener("click", e => {
    const button = e.target.closest("[data-category]");
    if (!button) return;
    activeCategory = button.dataset.category;
    document.querySelectorAll("[data-category]").forEach(b => b.classList.toggle("active", b === button));
    render();
  });
  search?.addEventListener("input", render);
  grid.addEventListener("click", e => {
    const button = e.target.closest("[data-add]");
    if (!button) return;
    if (window.HustleFreeCart) {
      window.HustleFreeCart.add(Number(button.dataset.add));
      const old = button.textContent;
      button.textContent = "✓ Added";
      setTimeout(() => button.textContent = old, 850);
    }
  });
  render();
});
