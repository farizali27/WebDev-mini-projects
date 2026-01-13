import { getOrders } from "../data/orders.js";
import { updateCart } from "../data/cart.js";
import { getProductById, loadProducts } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
import { initSearchBarEvents, renderCartQuantity } from "./components/header.js";

initPage();

async function initPage() {
  try {
    await loadProducts();
  } catch (err) {
    console.error(err);
  }
  renderCartQuantity();
  renderOrdersGrid();
  bindEvents();
  initSearchBarEvents();
}

function renderOrdersGrid() {
  const orders = getOrders();
  const ordersGridEl = document.querySelector(".js-orders-grid");
  if (!ordersGridEl) return;

  const ordersHTML = orders
    .map((order) => {
      return `
      <div class="order-container">
        ${orderToHTML(order)}
      </div>
    `;
    })
    .join("");

  ordersGridEl.innerHTML = ordersHTML;
}

function orderToHTML(order) {
  const orderHTML = `
  <div class="order-header">
    <div class="order-header-left-section">
      <div class="order-date">
        <div class="order-header-label">Order Placed:</div>
        <div>${getDate(order.orderTime)}</div>
      </div>
      <div class="order-total">
        <div class="order-header-label">Total:</div>
        <div>$${formatCurrency(order.totalCostCents)}</div>
      </div>
    </div>

    <div class="order-header-right-section">
      <div class="order-header-label">Order ID:</div>
      <div>${order.id}</div>
    </div>
  </div>

  <div class="order-details-grid">
    ${productsListHTML(order.products, order.id)}
  </div>
  `;

  return orderHTML;
}

function productsListHTML(products, orderId) {
  return products.map((item) => {
    const product = getProductById(item.productId);
    if(!product) return "";
    return `
    <div class="product-image-container">
      <img src="${product.image}">
    </div>

    <div class="product-details js-product-details" data-product-id="${product.id}">
      <div class="product-name">
        ${product.name}
      </div>
      <div class="product-delivery-date">
        Arriving on: ${getDate(item.estimatedDeliveryTime)}
      </div>
      <div class="product-quantity">
        Quantity: ${item.quantity}
      </div>
      <button class="buy-again-button js-buy-again-button button-primary">
        <img class="buy-again-icon" src="images/icons/buy-again.png">
        <span class="buy-again-message">Buy it again</span>
        <span class="buy-again-success">√ Added </span>
      </button>
    </div>

    <div class="product-actions">
      <a href="tracking.html?orderId=${orderId}&productId=${product.id}">
        <button class="track-package-button button-secondary">
          Track package
        </button>
      </a>
    </div>
    `;
  }).join("")
}

function getDate(isoDate) {
  const date = new Date(isoDate);
  const month = date.toLocaleString("en-US", { month: "long" });
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;
}

function bindEvents() {
  const grid = document.querySelector('.js-orders-grid');
  if(!grid) return;

  grid.addEventListener('click', (e) => {
    const btn = e.target.closest(".js-buy-again-button");
    if(!btn) return;

    const productEl = btn.closest(".js-product-details");
    if(!productEl) return;

    const productId = productEl.dataset.productId;
    
    updateCart(productId, 1);
    renderCartQuantity();
    showAddedMessage(btn);
  });
}

const messageTimeout = new WeakMap();
function showAddedMessage(btn) {
  const previousId = messageTimeout.get(btn);
  if(previousId) clearTimeout(previousId);

  btn.classList.add('added-to-cart');
  const timeoutId = setTimeout(() => {
    btn.classList.remove('added-to-cart');
  }, 2000);

  messageTimeout.set(btn, timeoutId);
}