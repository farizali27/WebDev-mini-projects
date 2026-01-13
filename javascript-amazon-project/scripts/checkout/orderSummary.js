import {
  getCart,
  removeFromCart,
  calculateCartQuantity,
  setItemQuantity,
  changeDeliveryOption,
} from "../../data/cart.js";
import {getProductById} from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import { deliveryOptions } from "../../data/deliveryOptions.js";

export function initOrderSummaryEvents(emit) {
  const orderSummary = document.querySelector(".js-order-summary");
  if (!orderSummary) return;

  orderSummary.addEventListener("click", (e) =>
    handleOrderSummaryClick(e, emit)
  );
}

function handleOrderSummaryClick(e, emit) {
  const el = e.target;
  const updateButton = el.closest(".js-update-quantity-link");
  const deleteButton = el.closest(".js-delete-quantity-link");
  const saveButton = el.closest(".save-quantity-link");
  const deliveryOptionButton = el.closest(".delivery-option");

  if (!deleteButton && !updateButton && !saveButton && !deliveryOptionButton)
    return;

  const container = el.closest(".js-cart-item-container");
  if (!container) return;

  const productId = container.dataset.productId;

  if (updateButton) updateBtnHandler(container);
  else if (deleteButton) removeFromCart(productId);
  else if (saveButton) saveBtnHandler(container);
  else if (deliveryOptionButton) {
    const deliveryId = deliveryOptionButton.dataset.deliveryId;
    changeDeliveryOption(productId, deliveryId);
  }
  if (!updateButton) emit({type: "cart-updated"});
}

function renderEmptyCart() {
  document.querySelector(".js-order-summary").innerHTML = `<div class="empty-cart-message">Your cart is empty</div>
  <a class="button-primary view-products-link" href="amazon.html">View products</a>
  `;

}
export function renderOrderSummary() {
  const orderSummaryEl = document.querySelector(".js-order-summary");
  if(!orderSummaryEl) return;

  const cart = getCart();
  const cartSize = calculateCartQuantity();

  const cartQuantityEl = document.querySelector(".js-return-to-home-link");
  if(cartQuantityEl) cartQuantityEl.innerHTML = `${cartSize} items`;

  if (!cartSize) {
    renderEmptyCart();
    return;
  }

  const orderSummaryHTML = Object.entries(cart)
    .map(([productId, item]) => {
      const product = getProductById(productId);
      const quantity = item.quantity;
      const deliveryId = item.deliveryOptionId;
      const deliveryDate = getDate(deliveryOptions[deliveryId].deliveryDays);

      return `
    <div class="cart-item-container js-cart-item-container" data-product-id="${productId}">
      <div class="delivery-date">
        Delivery date: ${deliveryDate}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${product.image}">

        <div class="cart-item-details">
          <div class="product-name">
            ${product.name}
          </div>
          <div class="product-price">
            $${formatCurrency(product.priceCents)}
          </div>
          <div class="product-quantity js-product-quantity">
            <span>
              Quantity: <span class="quantity-label">${quantity}</span>
            </span>
            <span class="update-quantity-link link-primary js-update-quantity-link">
              Update
            </span>
            <input class="quantity-input" type="number" value="${quantity}">
            <span class="save-quantity-link link-primary">Save</span>
            <span class="delete-quantity-link link-primary js-delete-quantity-link">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          ${deliveryOptionsHTML(productId, deliveryId)}
        </div>
      </div>
    </div>`;
    })
    .join("");
  orderSummaryEl.innerHTML = orderSummaryHTML;
}

function getDate(deliveryDays) {
  const today = dayjs();
  const deliveryDate = today.add(deliveryDays, "days");
  return deliveryDate.format("dddd, MMMM D");
}

function deliveryOptionsHTML(productId, deliveryId) {
  const html = Object.keys(deliveryOptions)
    .map((id) => {
      const dateString = getDate(deliveryOptions[id].deliveryDays);
      const priceString =
        deliveryOptions[id].priceCents === 0
          ? "FREE"
          : `$${formatCurrency(deliveryOptions[id].priceCents)} -`;
      return `
        <div class="delivery-option js-delivery-option" data-delivery-id="${id}">
          <input type="radio"
            ${deliveryId === id ? "checked" : ""}
            class="delivery-option-input js-delivery-option-input"
            name="delivery-option-${productId}">
          <div>
            <div class="delivery-option-date">
              ${dateString}
            </div>
            <div class="delivery-option-price">
              ${priceString} Shipping
            </div>
          </div>
        </div>
    `;
    })
    .join("");
  return html;
}

function saveBtnHandler(container) {
  const productId = container.dataset.productId;
  const quantity = Number(container.querySelector(".quantity-input").value);
  if (!Number.isInteger(quantity) || quantity < 0 || quantity >= 1000) {
    alert("Not a valid quantity");
    return;
  }
  if (quantity === 0) removeFromCart(productId);
  else setItemQuantity(productId, quantity);
}

function updateBtnHandler(container) {
  container.classList.add("is-editing");
}
