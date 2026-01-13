# Amazon Frontend Clone (Vanilla JavaScript)

A frontend-only Amazon-like e-commerce clone built with vanilla JavaScript, HTML, and CSS.
This project focuses on frontend architecture, state management, and real-world UI flows rather than frameworks.

It started as a tutorial-based project but was significantly refactored to follow best practices and improve structure, correctness, and maintainability.

## Features
- Product listing loaded from a backend API
- Search functionality with URL-based state
- Cart management (add, remove, update quantity, delivery options)
- Checkout flow with order placement
- Orders history page
- Order tracking page with progress indicator
- Persistent state using localStorage
- Fully modular JavaScript (ES Modules)
- Defensive state handling and immutability
- Unit tests for core business logic

## Pages
- `amazon.html` – product listing & search
- `checkout.html` - order summary and payment summary
- `orders.html` - order history
- `tracking.html` - order tracking for a specific product

## Tech Stack
- HTML
- CSS
- Vanilla Javascript(ES6+)
- Jasminne for testing

## Project Structure
```
data/       # owns application state and persistence
  cart.js
  products.js
  orders.js
  deliveryOptions.js

scripts/    # page controllers and UI logic
  checkout/
    orderSummary.js
    paymentSummary.js

  components/ # resuable UI behavior
    header.js

  utils/      # helper modules
    money.js

  amazon.js
  checkout.js
  ordersPage.js
  tracking.js

styles/
  ...

tests/
  ...

amazon.html
checkout.html
ordersPage.html
tracking.html
```