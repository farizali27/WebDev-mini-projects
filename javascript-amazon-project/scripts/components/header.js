import { calculateCartQuantity } from "../../data/cart.js";

export function renderCartQuantity() {
  const el = document.querySelector(".js-cart-quantity");
  if (!el) return;
  el.textContent = `${calculateCartQuantity()}`;
}

export function initSearchBarEvents() {
  const searchBtn = document.querySelector('.js-search-button');
  const searchInput = document.querySelector('.js-search-bar');
  if(!searchBtn || !searchInput) return;

  searchBtn.addEventListener("click", handleSearch);

  searchInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter") handleSearch();
  });

  function handleSearch() {
    console.log('hello');
    const query = searchInput.value.trim();
    if (!query) {
      window.location.href = `amazon.html`;
      return;  
    }
    window.location.href = `amazon.html?search=${encodeURIComponent(query)}`;
  }
}
