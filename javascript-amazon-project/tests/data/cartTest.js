import { changeDeliveryOption, getCart, removeFromCart,  resetCartForTests,  updateCart } from "../../data/cart.js";

describe("test suite: updateCart", () => {
  const productId = "e43638ce-6aa0-4b85-b27f-e1d07eb678c6";
  beforeEach(() => {
    resetCartForTests();
    spyOn(localStorage, "setItem");
  });

  it("adds an existing product to cart", () => {
    spyOn(localStorage, "getItem").and.returnValue(
      JSON.stringify({
        [productId]: {
          quantity: 1,
          deliveryOptionId: "1"
        }
      })
    );

    updateCart(productId, 1);

    const cart = getCart();
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith('cart',
      JSON.stringify({
        'e43638ce-6aa0-4b85-b27f-e1d07eb678c6': {
          quantity: 2,
          deliveryOptionId: "1"
        }
      })
    );
    expect(Object.keys(cart).length).toEqual(1);
    expect(cart[productId]).not.toEqual(null);
    expect(cart[productId].quantity).toBe(2);
  });

  it("adds a new product to cart", () => {
    spyOn(localStorage, "getItem").and.returnValue(JSON.stringify({}));

    updateCart(productId, 1);
    
    const cart = getCart();
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith('cart',
      JSON.stringify({
        'e43638ce-6aa0-4b85-b27f-e1d07eb678c6': {
          quantity: 1,
          deliveryOptionId: "1"
        }
      })
    );
    expect(Object.keys(cart).length).toEqual(1);
    expect(cart[productId]).not.toEqual(null);
    expect(cart[productId].quantity).toBe(1);
  });
});

describe("test suite: removeFromCart", () => {
  const productId1 = "e43638ce-6aa0-4b85-b27f-e1d07eb678c6";
  const productId2 = '15b6fc6f-327a-4ec4-896f-486349e85a3d';

  beforeEach(() => {
    resetCartForTests();
    spyOn(localStorage, "setItem");
    spyOn(localStorage, "getItem").and.returnValue(JSON.stringify({
      [productId1]: {
        quantity: 3,
        deliveryOptionId: "1"
      }
    }));
  });

  it("removes item which is in the cart", () => {
    removeFromCart(productId1);
    const cart = getCart();
    expect(Object.keys(cart).length).toEqual(0);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith('cart',JSON.stringify({}));
  });

  it("removes item which is not in the cart", () => {
    removeFromCart(productId2);
    const cart =getCart();
    expect(Object.keys(cart)).toEqual([productId1]);
    expect(cart[productId1].quantity).toEqual(3);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith('cart',JSON.stringify({
      [productId1]: {
        quantity: 3,
        deliveryOptionId: "1"
      }
    }));
  });
});

describe("test suite: changeDeliveryOption", () => {
  const productId1 = "e43638ce-6aa0-4b85-b27f-e1d07eb678c6";
  
  beforeEach(() => {
    resetCartForTests();
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify({
        [productId1]: {
          quantity: 1,
          deliveryOptionId: '1'
        }
      })
    });
  });

  it('updates the delivery option', () => {
    changeDeliveryOption(productId1, '3');
    const cart = getCart();

    expect(cart[productId1].deliveryOptionId).toEqual('3');
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
  });

  it('does nothing if product is not in the cart', () => {
    changeDeliveryOption('does-not-exist', '2');
    expect(localStorage.setItem).toHaveBeenCalledTimes(0);
  });

  it('does nothing if delivery option does not exist', () => {
    changeDeliveryOption(productId1, 'does-not-exist');
    const cart = getCart();
    expect(localStorage.setItem).toHaveBeenCalledTimes(0);
    expect(cart[productId1].deliveryOptionId).toEqual('1');
  });
});

