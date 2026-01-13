let orders = [];
let orderById = {};
let loaded = false;

function ensureLoaded() {
  if (loaded) return;
  orders = JSON.parse(localStorage.getItem('orders')) || [];
  orderById = JSON.parse(localStorage.getItem('orderById')) || {};
  loaded = true;
}

export function addOrder(order) {
  ensureLoaded();
  orders = [order, ...orders];
  orderById[order.id] = order;
  saveToStorage();
}

export function getOrders() {
  ensureLoaded();
  return structuredClone(orders);
}

export function getOrderById(id) {
  ensureLoaded();
  return orderById[id] ?? null;
}

function saveToStorage() {
  localStorage.setItem('orders', JSON.stringify(orders));
  localStorage.setItem('orderById', JSON.stringify(orderById));
}