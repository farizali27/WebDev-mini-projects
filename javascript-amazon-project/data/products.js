let products = [];
let productsById = {};
let loadPromise = null;

export async function loadProducts() {
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const response = await fetch("https://supersimplebackend.dev/products");
    if (!response.ok) {
      throw new Error(`Failed to load products: ${response.status}`);
    }

    const data = await response.json();

    data.forEach(deepFreeze);

    products = data;
    productsById = Object.freeze(
      Object.fromEntries(data.map((p) => [p.id, p]))
    );

    console.log("products loaded");
  })();

  return loadPromise;
}

export function getProductById(id) {
  return productsById[id] ?? null;
}

export function getAllProducts() {
  if (!products.length) {
    throw new Error("Products not loaded yet");
  }
  return [...products];
}

function deepFreeze(obj) {
  Object.freeze(obj);
  Object.values(obj).forEach((value) => {
    if (value && typeof value === "object" && !Object.isFrozen(value)) {
      deepFreeze(value);
    }
  });
  return obj;
}
