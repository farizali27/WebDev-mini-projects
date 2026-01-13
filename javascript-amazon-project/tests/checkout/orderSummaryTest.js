import { getCart, resetCartForTests } from "../../data/cart.js";
import { loadProducts } from "../../data/products.js";
import {initOrderSummaryEvents, renderOrderSummary} from "../../scripts/checkout/orderSummary.js"

describe("test suite: renderOrderSummary", () => {
  const productId1 = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6';
  const productId2 = '15b6fc6f-327a-4ec4-896f-486349e85a3d';

  beforeAll(async () => {
    await loadProducts();
  });

  beforeEach(() => {
    resetCartForTests();
    spyOn(localStorage, "getItem").and.callFake(() => {
      return JSON.stringify({
        [productId1]: {
          quantity: 2,
          deliveryOptionId: "1"
        },
        [productId2]: {
          quantity: 1,
          deliveryOptionId: "2"
        }
      });
    });

    spyOn(localStorage, "setItem");

    document.querySelector(".js-test-container").innerHTML = `
      <div class="js-order-summary"></div>
    `;

    renderOrderSummary();
  });

  it("displays the cart", () => {
    expect(document.querySelectorAll(".js-cart-item-container").length).toEqual(2);
    expect(document.querySelector(`.js-cart-item-container[data-product-id="${productId1}"]`).querySelector('.js-product-quantity').innerText).toContain('Quantity: 2');
    expect(document.querySelector(`.js-cart-item-container[data-product-id="${productId2}"]`).querySelector('.js-product-quantity').innerText).toContain('Quantity: 1');
  });

  it("removes a product", () => {
    const onChangeSpy = jasmine.createSpy("onChange");

    initOrderSummaryEvents(onChangeSpy);

    document.querySelector(`.js-cart-item-container[data-product-id="${productId1}"] .js-delete-quantity-link`).click();
    renderOrderSummary();

    const cart = getCart();
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    expect(Object.keys(cart)).toEqual([productId2]);
    expect(document.querySelectorAll(".js-cart-item-container").length).toEqual(1);
    expect(document.querySelector(`.js-cart-item-container[data-product-id="${productId1}"]`)).toEqual(null);
    expect(document.querySelector(`.js-cart-item-container[data-product-id="${productId2}"]`)).not.toEqual(null);
  });

  it("changes delivery option", () => {
    const onChangeSpy = jasmine.createSpy("onChange");

    initOrderSummaryEvents(onChangeSpy);
    const id = '3';

    document.querySelector(`.js-cart-item-container[data-product-id="${productId1}"] .js-delivery-option[data-delivery-id="${id}"]`).click();
    renderOrderSummary();

    expect(document.querySelector(`.js-cart-item-container[data-product-id="${productId1}"] .js-delivery-option[data-delivery-id="${id}"] input`).checked).toEqual(true);
    const cart = getCart();
    expect(cart[productId1].deliveryOptionId).toEqual(id);
  });

  afterEach(() => {
    document.querySelector('.js-test-container').innerHTML="";
  })
});