import { deliveryOptions } from "./deliveryOptions.js";

const MAX_QTY = 999;

let cart = {};
let loaded = false;

export function resetCartForTests() {
  cart = {};
  loaded = false;
}

export function resetCart() {
  cart = {};
  saveToStorage();
}

function ensureLoaded() {
  if(loaded) return;
  cart = JSON.parse(localStorage.getItem("cart")) ?? {};
  loaded = true;
}

export function getCart() {
  ensureLoaded();
  return structuredClone(cart);
}

export function updateCart(productId, quantity) {
  ensureLoaded();
  if(!isValidQuantity(quantity)) {
    console.warn("invalid quantity passed to updateCart:", quantity);
    return;
  }

  mutate(() => {
    if (cart[productId]) cart[productId].quantity += quantity;
    else {
      cart[productId] = {
        quantity,
        deliveryOptionId: "1",
      };
    }
    cart[productId].quantity = Math.min(cart[productId].quantity, MAX_QTY);
  });
}

export function removeFromCart(productId) {
  ensureLoaded();
  mutate(() => {
    delete cart[productId];
  });
}

export function setItemQuantity(productId, quantity) {
  ensureLoaded();
  if(!cart[productId]) return;
  if(!isValidQuantity(quantity)) {
    console.warn("invalid quantity passed to setItemQuantity:", quantity);
    return;
  }

  mutate(() => {
    cart[productId].quantity = Math.min(quantity, MAX_QTY);
  });
}

export function changeDeliveryOption(productId, deliveryId) {
  ensureLoaded();
  if(!cart[productId]) return;
  if(typeof deliveryId !== 'string' || deliveryOptions[deliveryId] === undefined) return;

  mutate(() => {
    cart[productId].deliveryOptionId = deliveryId;
  });
}

export function calculateCartQuantity() {
  ensureLoaded();
  return Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
}

function mutate(fn) {
  fn();
  saveToStorage();
}

function saveToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function isValidQuantity(value) {
  return Number.isInteger(value) && value > 0;
}