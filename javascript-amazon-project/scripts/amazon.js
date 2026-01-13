import { updateCart } from "../data/cart.js";
import { getAllProducts, loadProducts } from "../data/products.js";
import { initSearchBarEvents, renderCartQuantity } from "./components/header.js";
import { formatCurrency } from "./utils/money.js";

initPage();

async function initPage() {
  try {
    await loadProducts();
  } catch (err) {
    console.error(err);
    return;
  }

  renderProductsGrid();
  bindEvents();
  renderCartQuantity();
  initSearchBarEvents();
}

function renderProductsGrid() {
  const grid = document.querySelector(".js-products-grid");
  if (!grid) return;

  const url = new URL(window.location);
  const searchInput = url.searchParams.get("search");
  document.querySelector('.js-search-bar').value = searchInput;
  const products = (searchInput === null) ? getAllProducts() : filterProducts(searchInput);

  if(!products.length) {
    grid.innerHTML = '<div class="empty-results-message"> No products matched your search</div>';
    return;
  }

  const productsHTML = products
    .map((product) => productToHTML(product))
    .join("");
  grid.innerHTML = productsHTML;
}

function filterProducts(searchInput) {
  searchInput = searchInput.toLowerCase();
  return getAllProducts().filter((product) => {
    const nameMatch = product.name.toLowerCase().includes(searchInput);
    const keywordMatch = product.keywords.some(keyword => keyword.toLowerCase().includes(searchInput));

    return nameMatch || keywordMatch;
  });
}

function bindEvents() {
  const grid = document.querySelector(".js-products-grid");
  grid.addEventListener("click", (e) => {
    const button = e.target.closest(".js-add-to-cart-button");
    if (!button) return;

    const productEl = button.closest(".product-container");
    if (!productEl) return;

    const productId = productEl.dataset.productId;

    const quantity = Number(
      productEl.querySelector(".js-quantity-selector").value
    );

    updateCart(productId, quantity);
    renderCartQuantity();
    showAddedMessage(productEl);
  });
}

function productToHTML(product) {
  return `
  <div class="product-container" data-product-id="${product.id}">
    <div class="product-image-container">
      <img class="product-image"
        src="${product.image}">
    </div>

    <div class="product-name limit-text-to-2-lines">
      ${product.name}
    </div>

    <div class="product-rating-container">
      <img class="product-rating-stars"
        src="images/ratings/rating-${product.rating.stars * 10}.png">
      <div class="product-rating-count link-primary">
        ${product.rating.count}
      </div>
    </div>

    <div class="product-price">
      $${formatCurrency(product.priceCents)}
    </div>

    <div class="product-quantity-container">
      <select class="js-quantity-selector">
        ${renderQuantityOptions()};
      </select>
    </div>

    <div class="product-spacer"></div>

    <div class="added-to-cart js-added-to-cart">
      <img src="images/icons/checkmark.png">
      Added
    </div>

    <button class="add-to-cart-button button-primary js-add-to-cart-button">
      Add to Cart
    </button>
  </div>
`;
}

function renderQuantityOptions() {
  return Array.from(
    { length: 10 },
    (_, i) =>
      `<option ${i === 0 ? "selected" : ""} value='${i + 1}'>${i + 1}</option>`
  ).join("");
}

const addedMessageTimeouts = new WeakMap();
function showAddedMessage(productEl) {
  const el = productEl.querySelector(".js-added-to-cart");
  if(!el) return;

  const previousId = addedMessageTimeouts.get(el);

  if (previousId) clearTimeout(previousId);

  el.classList.add("added-to-cart-visible");

  const timeoutId = setTimeout(() => {
    el.classList.remove("added-to-cart-visible");
  }, 2000);
  addedMessageTimeouts.set(el, timeoutId);
}
