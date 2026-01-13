import { getOrderById } from "../data/orders.js";
import { getProductById, loadProducts } from "../data/products.js";
import { initSearchBarEvents, renderCartQuantity } from "./components/header.js";

initPage();

async function initPage() {
  const url = new URL(window.location.href);
  const orderId = url.searchParams.get("orderId");
  const productId = url.searchParams.get("productId");

  try {
    await loadProducts();
  } catch (err) {
    console.error(err);
  }

  const order = getOrderById(orderId);
  if(!order) {
    console.error("Order not found");
    return;
  }
  const item = getItem(order, productId);
  if(!item) {
    console.error("Product not found in order");
    return;
  }

  renderCartQuantity();
  renderTracking(item, order);
  initSearchBarEvents();
}

function getItem(order, productId) {
  return order.products.find((p) => p.productId === productId);
}

function getProgress(isoOT, isoDT) {
  const currentTime = new Date();
  const orderTime = new Date(isoOT);
  const deliveryTime = new Date(isoDT);

  return (currentTime - orderTime)/(deliveryTime - orderTime)*100;
}

function renderTracking(item, order) {
  const el = document.querySelector(".js-order-tracking");
  if (!el) return;

  const product = getProductById(item.productId);
  const progress = getProgress(order.orderTime, item.estimatedDeliveryTime);
  const trackingHTML = `
    <a class="back-to-orders-link link-primary" href="orders.html">
      View all orders
    </a>

    <div class="delivery-date">Arriving on ${getDate(
      item.estimatedDeliveryTime
    )}</div>

    <div class="product-info">${product.name}</div>

    <div class="product-info">Quantity: ${item.quantity}</div>

    <img
      class="product-image"
      src="${product.image}"
    />

    <div class="progress-labels-container">
      <div class="progress-label ${(progress < 50) ? "current-status" : ""}">Preparing</div>
      <div class="progress-label ${(progress >= 50 && progress < 100) ? "current-status" : ""}">Shipped</div>
      <div class="progress-label ${(progress >= 100) ? "current-status" : ""}">Delivered</div>
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar" style="width: ${progress}%"></div>
    </div>
  `;

  el.innerHTML = trackingHTML;
}

function getDate(isoDate) {
  const date = new Date(isoDate);
  const day = date.toLocaleString("en-US", { weekday: "long" });
  const month = date.toLocaleString("en-US", { month: "long" });
  const dayOfMonth = date.getDate();

  return `${day}, ${month} ${dayOfMonth}`;
}
