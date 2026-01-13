import { loadProducts } from "../data/products.js";
import {renderOrderSummary, initOrderSummaryEvents} from "./checkout/orderSummary.js";
import { initPaymentSummaryEvents, renderPaymentSummary, updatePlaceOrderButton } from "./checkout/paymentSummary.js";

initPage();

function renderCheckout() {
  renderOrderSummary();
  renderPaymentSummary();
  updatePlaceOrderButton();
}

async function initPage() {
  try {
    await loadProducts();
  } catch (err) {
    console.error(err);
    return;
  }

  renderCheckout();
  initOrderSummaryEvents(handleOrderSummaryEvent);
  initPaymentSummaryEvents();
}

function handleOrderSummaryEvent(event) {
  if(event.type === "cart-updated") renderCheckout();
}