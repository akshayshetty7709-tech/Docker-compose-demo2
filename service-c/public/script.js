let allProducts = [];
let activeFilter = "all";
let cartCount = 0;

const grid = document.getElementById("productGrid");
const toast = document.getElementById("toast");
const cartCountEl = document.getElementById("cartCount");

const artStyles = [
  "linear-gradient(160deg,#f4e3d3,#e3c9ab)",
  "linear-gradient(160deg,#dfe6f5,#b9c6e8)",
  "linear-gradient(160deg,#e6ded0,#c9bda3)",
  "linear-gradient(160deg,#f0dede,#dcb9b9)",
  "linear-gradient(160deg,#dbe8e0,#b7d0c1)",
  "linear-gradient(160deg,#e9e2f2,#c9b8e0)"
];

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 1800);
}

function render() {
  const filtered = activeFilter === "all"
    ? allProducts
    : allProducts.filter(p => p.category === activeFilter);

  const sort = document.getElementById("sortSelect").value;
  const sorted = [...filtered].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    return 0;
  });

  grid.innerHTML = sorted.map((p, i) => `
    <article class="product-card">
      <div class="product-media">
        <div class="product-art" style="background:${artStyles[i % artStyles.length]}">${p.name}</div>
        <button class="wishlist-btn" aria-label="Save to wishlist">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0112 6a5.5 5.5 0 019.5 6c-2.5 4.5-9.5 9-9.5 9z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
        </button>
        <div class="add-cart-slide" data-name="${p.name}">Add to cart — $${p.price.toFixed(2)}</div>
      </div>
      <div class="product-info">
        <p class="product-name">${p.name}</p>
        <div class="product-meta">
          <span class="product-category">${p.category}</span>
          <span class="product-price">$${p.price.toFixed(2)}</span>
        </div>
        <div class="swatches">
          ${p.colors.map((c, ci) => `<span class="swatch ${ci === 0 ? 'selected' : ''}" style="background:${c}"></span>`).join("")}
        </div>
      </div>
    </article>
  `).join("");

  grid.querySelectorAll(".add-cart-slide").forEach(el => {
    el.addEventListener("click", () => {
      cartCount++;
      cartCountEl.textContent = cartCount;
      showToast(`Added "${el.dataset.name}" to cart`);
    });
  });

  grid.querySelectorAll(".swatch").forEach(sw => {
    sw.addEventListener("click", (e) => {
      e.currentTarget.parentElement.querySelector(".selected")?.classList.remove("selected");
      e.currentTarget.classList.add("selected");
    });
  });
}

document.getElementById("filters").addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-chip");
  if (!btn) return;
  document.querySelector(".filter-chip.active")?.classList.remove("active");
  btn.classList.add("active");
  activeFilter = btn.dataset.filter;
  render();
});

document.getElementById("sortSelect").addEventListener("change", render);

fetch("/api/products")
  .then(res => res.json())
  .then(data => { allProducts = data; render(); })
  .catch(() => {
    grid.innerHTML = `<p style="color:#656c85">Couldn't load products. Is the API running?</p>`;
  });
