import { calculateCartQuantity, getCart, resetCart} from "../../data/cart.js";
import { getProductById } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import { deliveryOptions } from "../../data/deliveryOptions.js";
import { addOrder } from "../../data/orders.js";

const taxRate = 0.1;

export function updatePlaceOrderButton() {
  const btn = document.querySelector(".js-place-order-button");
  if (!btn) return;

  if (calculateCartQuantity() === 0) {
    btn.disabled = true;
    btn.classList.add('payment-buttons-disabled');
  }
  else {
    btn.disabled = false;
    btn.classList.remove('payment-buttons-disabled');
  }
}

export function renderPaymentSummary() {
  const paymentSummaryEl = document.querySelector(".js-payment-summary");
  if (!paymentSummaryEl) return;

  const cart = getCart();
  const summary = calculatePaymentSummary(cart);

  const paymentSummaryHTML = `
    <div class="payment-summary-title">
      Order Summary
    </div>

    <div class="payment-summary-row">
      <div>Items (${calculateCartQuantity()}):</div>
      <div class="payment-summary-money">$${formatCurrency(
        summary.itemsTotal
      )}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">$${formatCurrency(
        summary.shippingTotal
      )}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$${formatCurrency(
        summary.totalBeforeTax
      )}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$${formatCurrency(summary.tax)}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">$${formatCurrency(summary.total)}</div>
    </div>

    <button class="place-order-button js-place-order-button button-primary">
      Place your order
    </button>
  `;

  paymentSummaryEl.innerHTML = paymentSummaryHTML;
}

function calculatePaymentSummary(cart) {
  const itemsTotal = Object.entries(cart).reduce(
    (sum, [productId, item]) =>
      sum + item.quantity * getProductById(productId).priceCents,
    0
  );

  const shippingTotal = Object.values(cart).reduce(
    (sum, item) => sum + deliveryOptions[item.deliveryOptionId].priceCents,
    0
  );

  const totalBeforeTax = itemsTotal + shippingTotal;
  const tax = Math.round(totalBeforeTax * taxRate);
  const total = totalBeforeTax + tax;

  return {
    itemsTotal,
    shippingTotal,
    totalBeforeTax,
    tax,
    total
  };
}

export function initPaymentSummaryEvents() {
  const btn = document.querySelector(".js-place-order-button");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    try {
      await placeOrder(getCart());
      resetCart();
      window.location.href = "orders.html";
    } catch (err) {
      alert(err.message);
    } 
  });
}

export async function placeOrder(cart) {
  const cartArray = Object.entries(cart).map(([id, cartItem]) => {
    return {
      productId: id,
      quantity: cartItem.quantity,
      deliveryOptionId: cartItem.deliveryOptionId,
    };
  });

  const response = await fetch("https://supersimplebackend.dev/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cart: cartArray,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to place order");
  }
  const order = await response.json();
  addOrder(order);

  return order;
}
