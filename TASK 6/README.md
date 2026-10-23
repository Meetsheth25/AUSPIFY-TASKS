# Task 6 (Advanced) — Nexus Cart E-Commerce Application

An e-commerce shopping cart web application built with **HTML5**, **Vanilla CSS3**, and **Vanilla JavaScript (ES6+)**.

---

## 1. Directory & Workspace Isolation

- **Isolated Directory**: `m:/Mit/INTERNSHIP/AUSPIFY/TASK 6/`
- **Zero Root Modifications**: Tasks 1 through 5 and all parent directory files were preserved untouched.
- **Zero Framework / Zero Dependency**: Runs natively in any modern web browser without build tools, external product APIs, or external frameworks.

---

## 2. File Structure

```text
TASK 6/
├── assets/
│   └── products/
│       ├── backpack.svg
│       ├── bomber.svg
│       ├── charger.svg
│       ├── coffeemaker.svg
│       ├── desklamp.svg
│       ├── diffuser.svg
│       ├── headphones.svg
│       ├── joggers.svg
│       ├── keyboard.svg
│       ├── leather-watch.svg
│       ├── linen-shirt.svg
│       ├── smartwatch.svg
│       ├── sunglasses.svg
│       ├── tshirt.svg
│       ├── tumbler.svg
│       └── wallet.svg
├── index.html        # Semantic HTML5 page structure and accessible dialogs
├── style.css         # Modern design system, responsive styles, and themes
├── script.js         # Modular Vanilla JavaScript ES6+ application logic
├── test_suite.js     # Automated verification test suite
├── server.js         # Lightweight local HTTP static file server
└── README.md         # Comprehensive project documentation
```

---

## 3. Implemented Features

### Product Catalog
- **16 Predefined Products** across 4 categories:
  - *Electronics* (Headphones, Smartwatch, Keyboard, GaN Charger)
  - *Accessories* (Leather Watch, Aviator Sunglasses, RFID Wallet, Backpack)
  - *Clothing* (Supima T-Shirt, Bomber Jacket, Athletic Joggers, Linen Shirt)
  - *Home & Lifestyle* (Pour-Over Coffee Set, Ambient Desk Lamp, Insulated Tumbler, Aroma Diffuser)
- **Product Details**: Unique ID, Title, Category, Description, Price (INR), local SVG asset, Stock availability count, and promotional Badges (*Bestseller*, *Popular*, *New*, *Trending*, *Out of Stock*).
- **Format Consistency**: Prices formatted via `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })`.
- **Search & Filter**: Real-time debounced search bar, category filter pills, "In Stock Only" toggle, and multi-option sort dropdown (Price Low-to-High, High-to-Low, Name A-Z, Stock Availability).

### Shopping Cart & Drawer
- **Slide-out Cart Drawer**: Accessible drawer with smooth slide animation and backdrop.
- **Quantity & Stock Management**:
  - Increments and decrements with boundary limits.
  - Prevents quantities below 1.
  - Enforces available stock limits; disables the `+` control when maximum stock is reached.
  - Directly editable input with validation and automatic clamping.
- **Line & Cart Totals**:
  - $\text{Line Total} = \text{Unit Price} \times \text{Quantity}$
  - $\text{Subtotal} = \sum \text{Line Totals}$
- **Shipping Rule**: Fixed ₹99 shipping for subtotals under ₹999; **FREE Shipping** for subtotals $\ge$ ₹999.
- **Dynamic Free Shipping Progress Bar**: Visually indicates amount remaining to unlock free delivery.
- **Promo Coupon System**:
  - `SAVE10`: 10% discount off subtotal.
  - `WELCOME50`: Flat ₹50 discount.
- **Empty Cart State**: Clear feedback with a quick "Explore Catalog" action.
- **Clear Cart**: Safe two-step confirmation modal before cart wipe.

### Local Storage Persistence
- Versioned storage key: `task6_shopping_cart_v1`.
- Auto-saves after every cart mutation.
- Schema validation and catalog reconciliation on startup:
  - Omits items missing from the catalog.
  - Clamps quantities to active product stock.
  - Recovers gracefully from corrupted or malformed data without crashing.

### Simulated Checkout Flow
- Modal dialog with order item review and breakdown.
- Form field validation:
  - Full Name (required, min 2 chars).
  - Email Address (RFC-compliant regex).
  - Indian Mobile Number (10 digits starting with 6-9).
  - Street Address, City, and 6-digit PIN code.
- Prevents duplicate clicks with button lock and simulation spinner.
- Order confirmation receipt with unique reference (`ORD-YYYY-XXXXXX`), customer details, item breakdown, and simulation disclaimer.
- Cart auto-clears upon successful order completion.

### Modern Design System
- Dark mode default with light mode toggle (`task6_theme_v1` persistence).
- Toast notification system for user feedback.
- Accessible ARIA attributes, semantic landmarks, and full keyboard navigation (e.g. `ESC` closes modals/drawer).

---

## 4. How to Run

### Option A: Open directly in browser
Double-click `index.html` in File Explorer or open it in any modern browser.

### Option B: Run via local Node server
```bash
node server.js
```
Then visit `http://localhost:8086/` in your browser.

### Option C: Run automated tests
```bash
node test_suite.js
```

---

## 5. Verification Checklist Results

| # | Item | Status |
|---|------|--------|
| 1 | Application loads without JS console errors | Passed |
| 2 | All 16 products render correctly | Passed |
| 3 | Search and category filtering work | Passed |
| 4 | Price, name, and stock sorting work | Passed |
| 5 | Adding product to cart works | Passed |
| 6 | Adding same product increments quantity | Passed |
| 7 | Cart quantities update correctly | Passed |
| 8 | Quantity controls enforce stock limits | Passed |
| 9 | Removing an item updates cart and totals | Passed |
| 10 | Clearing cart requires confirmation | Passed |
| 11 | Subtotal calculations are correct | Passed |
| 12 | Shipping rules applied correctly (₹99 or Free $\ge$ ₹999) | Passed |
| 13 | Final totals update after every cart change | Passed |
| 14 | Empty cart displays zero totals | Passed |
| 15 | Cart data persists after page reload | Passed |
| 16 | Malformed LocalStorage data handled gracefully | Passed |
| 17 | Invalid checkout details rejected with inline messages | Passed |
| 18 | Cancelling checkout preserves cart | Passed |
| 19 | Successful simulated checkout generates reference & clears cart | Passed |
| 20 | Duplicate submissions prevented during checkout | Passed |
| 21 | Product images and fallback behavior work | Passed |
| 22 | Responsive across desktop, tablet, and mobile | Passed |
| 23 | Keyboard navigation (`ESC`), focus states, and labels work | Passed |
| 24 | All displayed prices formatted consistently in INR | Passed |
| 25 | No files outside Task 6 modified | Passed |
