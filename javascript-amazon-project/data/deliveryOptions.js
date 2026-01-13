export const deliveryOptions = {
  '1': {
    deliveryDays: 7,
    priceCents: 0
  },
  '2': {
    deliveryDays: 3,
    priceCents: 499
  },
  '3': {
    deliveryDays: 1,
    priceCents: 999
  }
};

export function getDeliveryOption(deliveryOptionId) {
  return deliveryOptions[deliveryOptionId];
}