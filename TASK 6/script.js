/**
 * Nexus Cart — Advanced E-Commerce Shopping Cart
 * Task 6 Implementation
 */

(() => {
  'use strict';

  /* ==========================================================================
     1. Canonical Product Catalog (Single Source of Truth)
     ========================================================================== */
  const PRODUCT_CATALOG = [
    {
      id: 'prod-1',
      name: 'Aura Wireless ANC Headphones',
      category: 'Electronics',
      price: 4999,
      stock: 8,
      badge: 'Bestseller',
      image: 'assets/products/headphones.svg',
      description: 'Active hybrid noise cancellation with 40-hour playtime, low-latency gaming mode, and spatial audio.'
    },
    {
      id: 'prod-2',
      name: 'Pulse Pro Smart Fitness Watch',
      category: 'Electronics',
      price: 2499,
      stock: 12,
      badge: 'Popular',
      image: 'assets/products/smartwatch.svg',
      description: 'AMOLED curved display with real-time biometric tracking, SpO2 sensor, and 5ATM water resistance.'
    },
    {
      id: 'prod-3',
      name: 'Apex Mechanical RGB Keyboard',
      category: 'Electronics',
      price: 3799,
      stock: 5,
      badge: 'Trending',
      image: 'assets/products/keyboard.svg',
      description: 'Hot-swappable custom tactile switches with per-key RGB backlighting and aircraft aluminum chassis.'
    },
    {
      id: 'prod-4',
      name: 'VoltFlow 65W GaN Fast Charger',
      category: 'Electronics',
      price: 1499,
      stock: 15,
      badge: 'New',
      image: 'assets/products/charger.svg',
      description: 'Ultra-compact Gallium Nitride 3-port charger compatible with laptops, tablets, and smartphones.'
    },
    {
      id: 'prod-5',
      name: 'Heritage Chronograph Leather Watch',
      category: 'Accessories',
      price: 5499,
      stock: 6,
      badge: 'Popular',
      image: 'assets/products/leather-watch.svg',
      description: 'Handcrafted genuine Italian leather strap with sapphire glass dial and Japanese quartz movement.'
    },
    {
      id: 'prod-6',
      name: 'Horizon Polarized Aviator Sunglasses',
      category: 'Accessories',
      price: 1899,
      stock: 10,
      badge: '',
      image: 'assets/products/sunglasses.svg',
      description: '100% UV400 polarized optics encased in an ultra-lightweight titanium alloy frame.'
    },
    {
      id: 'prod-7',
      name: 'Stealth Slim RFID Blocking Wallet',
      category: 'Accessories',
      price: 899,
      stock: 14,
      badge: 'Bestseller',
      image: 'assets/products/wallet.svg',
      description: 'Aerospace-grade aluminum cardholder with quick-eject trigger and RFID theft shielding.'
    },
    {
      id: 'prod-8',
      name: 'Vanguard Waterproof Laptop Backpack',
      category: 'Accessories',
      price: 2299,
      stock: 7,
      badge: 'Featured',
      image: 'assets/products/backpack.svg',
      description: '25L ergonomic commuter backpack with padded 16-inch laptop sleeve and USB pass-through.'
    },
    {
      id: 'prod-9',
      name: 'Signature Supima Crewneck T-Shirt',
      category: 'Clothing',
      price: 799,
      stock: 20,
      badge: 'Essentials',
      image: 'assets/products/tshirt.svg',
      description: '100% extra-long staple Supima cotton providing unmatched softness, breathability, and durability.'
    },
    {
      id: 'prod-10',
      name: 'Urban Shield All-Weather Bomber',
      category: 'Clothing',
      price: 3499,
      stock: 4,
      badge: 'Limited',
      image: 'assets/products/bomber.svg',
      description: 'Water-repellent insulated technical jacket with thermal fleece lining and storm-resistant collar.'
    },
    {
      id: 'prod-11',
      name: 'AeroFlex Athletic Training Joggers',
      category: 'Clothing',
      price: 1299,
      stock: 9,
      badge: '',
      image: 'assets/products/joggers.svg',
      description: 'Four-way stretch moisture-wicking fabric with concealed zip pockets and tapered ankle cuffs.'
    },
    {
      id: 'prod-12',
      name: 'Coastal Relaxed Pure Linen Shirt',
      category: 'Clothing',
      price: 1699,
      stock: 0,
      badge: 'Out of Stock',
      image: 'assets/products/linen-shirt.svg',
      description: 'Pure French flax linen shirt tailored for effortless breathability and relaxed summer layering.'
    },
    {
      id: 'prod-13',
      name: 'Artisan Ceramic Pour-Over Set',
      category: 'Home & Lifestyle',
      price: 1599,
      stock: 8,
      badge: 'New',
      image: 'assets/products/coffeemaker.svg',
      description: 'Hand-thrown matte ceramic dripper paired with heat-resistant borosilicate glass server.'
    },
    {
      id: 'prod-14',
      name: 'Lumina Smart Ambient Desk Lamp',
      category: 'Home & Lifestyle',
      price: 2199,
      stock: 6,
      badge: 'Trending',
      image: 'assets/products/desklamp.svg',
      description: 'Touch-controlled dual-axis articulating desk light with adjustable color temperature and memory.'
    },
    {
      id: 'prod-15',
      name: 'HydroVault Insulated Steel Tumbler',
      category: 'Home & Lifestyle',
      price: 999,
      stock: 16,
      badge: 'Bestseller',
      image: 'assets/products/tumbler.svg',
      description: 'Double-walled copper-lined vacuum insulation keeping beverages cold for 24h and hot for 12h.'
    },
    {
      id: 'prod-16',
      name: 'ZenMist Ultrasonic Aroma Diffuser',
      category: 'Home & Lifestyle',
      price: 1799,
      stock: 3,
      badge: 'Low Stock',
      image: 'assets/products/diffuser.svg',
      description: 'Whisper-quiet ultrasonic mist generator featuring ambient warm glowing light and auto shutoff.'
    }
  ];

  /* ==========================================================================
     2. Configuration Constants
     ========================================================================== */
  const STORAGE_KEY = 'task6_shopping_cart_v1';
  const THEME_KEY = 'task6_theme_v1';
  const FREE_SHIPPING_THRESHOLD = 999;
  const STANDARD_SHIPPING_FEE = 99;

  const AVAILABLE_COUPONS = {
    'SAVE10': { type: 'percent', value: 10, label: '10% OFF' },
    'WELCOME50': { type: 'flat', value: 50, label: '₹50 OFF' }
  };

  /* ==========================================================================
     3. Application State
     ========================================================================== */
  const state = {
    cart: [],
    selectedCategory: 'all',
    searchQuery: '',
    sortBy: 'featured',
    inStockOnly: false,
    appliedCoupon: null,
    isSubmittingOrder: false
  };

  /* ==========================================================================
     4. Formatting and Helper Utilities
     ========================================================================== */
  const inrFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  });

  const formatINR = (val) => inrFormatter.format(Math.max(0, Math.round(val)));

  const getProductById = (id) => PRODUCT_CATALOG.find((p) => p.id === id);

  const escapeHtml = (str) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  };

  /* ==========================================================================
     5. Toast Notification System
     ========================================================================== */
  const showToast = (message, type = 'info', duration = 3000) => {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const iconSvg = {
      success: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>',
      warning: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>',
      error: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
      info: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
    }[type] || '';

    toast.innerHTML = `
      <span class="toast-icon">${iconSvg}</span>
      <span class="toast-msg">${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  };

  /* ==========================================================================
     6. Calculation Core (Separated from DOM)
     ========================================================================== */
  const calculateCartTotals = () => {
    let subtotal = 0;
    let totalItemsCount = 0;

    for (const item of state.cart) {
      const product = getProductById(item.productId);
      if (product) {
        subtotal += product.price * item.quantity;
        totalItemsCount += item.quantity;
      }
    }

    let discount = 0;
    if (state.appliedCoupon && subtotal > 0) {
      const coupon = AVAILABLE_COUPONS[state.appliedCoupon];
      if (coupon) {
        if (coupon.type === 'percent') {
          discount = Math.round((subtotal * coupon.value) / 100);
        } else if (coupon.type === 'flat') {
          discount = Math.min(subtotal, coupon.value);
        }
      }
    }

    const shipping = subtotal === 0 ? 0 : (subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE);
    const finalTotal = Math.max(0, subtotal - discount + shipping);
    const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

    return {
      subtotal,
      discount,
      shipping,
      finalTotal,
      totalItemsCount,
      remainingForFreeShipping
    };
  };

  /* ==========================================================================
     7. Local Storage Persistence & Reconciliation
     ========================================================================== */
  const saveCartToStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.cart));
    } catch {
      showToast('Notice: Could not persist cart changes to local storage.', 'warning');
    }
  };

  const loadCartFromStorage = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];

      const reconciled = [];
      for (const entry of parsed) {
        if (!entry || typeof entry !== 'object') continue;
        const product = getProductById(entry.productId);
        if (!product || product.stock <= 0) continue;

        const qty = parseInt(entry.quantity, 10);
        if (Number.isInteger(qty) && qty > 0) {
          reconciled.push({
            productId: product.id,
            quantity: Math.min(qty, product.stock)
          });
        }
      }
      return reconciled;
    } catch {
      return [];
    }
  };

  /* ==========================================================================
     8. Cart Mutation Handlers
     ========================================================================== */
  const addToCart = (productId) => {
    const product = getProductById(productId);
    if (!product) return;

    if (product.stock <= 0) {
      showToast(`"${product.name}" is currently out of stock.`, 'warning');
      return;
    }

    const existingIndex = state.cart.findIndex((i) => i.productId === productId);

    if (existingIndex > -1) {
      const currentQty = state.cart[existingIndex].quantity;
      if (currentQty >= product.stock) {
        showToast(`Maximum stock limit of ${product.stock} reached for "${product.name}".`, 'warning');
        return;
      }
      state.cart[existingIndex].quantity += 1;
      showToast(`Updated "${product.name}" quantity to ${state.cart[existingIndex].quantity}.`, 'success');
    } else {
      state.cart.push({ productId, quantity: 1 });
      showToast(`Added "${product.name}" to your cart.`, 'success');
    }

    saveCartToStorage();
    renderCart();
    renderProducts();

    // Trigger visual badge bump
    const badge = document.getElementById('cart-badge');
    if (badge) {
      badge.classList.add('bump');
      setTimeout(() => badge.classList.remove('bump'), 300);
    }
  };

  const updateCartQuantity = (productId, newQuantity) => {
    const product = getProductById(productId);
    if (!product) return;

    const index = state.cart.findIndex((i) => i.productId === productId);
    if (index === -1) return;

    let targetQty = parseInt(newQuantity, 10);
    if (!Number.isInteger(targetQty) || targetQty < 1) {
      targetQty = 1;
      showToast('Quantity must be at least 1.', 'warning');
    } else if (targetQty > product.stock) {
      targetQty = product.stock;
      showToast(`Only ${product.stock} units available in stock.`, 'warning');
    }

    state.cart[index].quantity = targetQty;
    saveCartToStorage();
    renderCart();
    renderProducts();
  };

  const removeFromCart = (productId) => {
    const product = getProductById(productId);
    state.cart = state.cart.filter((i) => i.productId !== productId);
    saveCartToStorage();
    renderCart();
    renderProducts();
    if (product) {
      showToast(`Removed "${product.name}" from your cart.`, 'info');
    }
  };

  const clearEntireCart = () => {
    state.cart = [];
    state.appliedCoupon = null;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignored
    }
    renderCart();
    renderProducts();
    showToast('Shopping cart has been cleared.', 'info');
  };

  /* ==========================================================================
     9. Product Catalog Filtering & Sorting
     ========================================================================== */
  const getFilteredAndSortedProducts = () => {
    let result = PRODUCT_CATALOG.filter((product) => {
      const matchesCategory =
        state.selectedCategory === 'all' || product.category === state.selectedCategory;

      const query = state.searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === '' ||
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);

      const matchesStock = !state.inStockOnly || product.stock > 0;

      return matchesCategory && matchesSearch && matchesStock;
    });

    switch (state.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'stock-desc':
        result.sort((a, b) => b.stock - a.stock);
        break;
      default:
        // Featured / Catalog default order
        break;
    }

    return result;
  };

  /* ==========================================================================
     10. UI Rendering: Product Grid
     ========================================================================== */
  const renderProducts = () => {
    const grid = document.getElementById('products-grid');
    const emptyState = document.getElementById('empty-products-state');
    const countEl = document.getElementById('results-count');
    if (!grid) return;

    const products = getFilteredAndSortedProducts();

    if (countEl) {
      countEl.textContent = `Showing ${products.length} product${products.length === 1 ? '' : 's'}`;
    }

    if (products.length === 0) {
      grid.innerHTML = '';
      if (emptyState) emptyState.hidden = false;
      return;
    }

    if (emptyState) emptyState.hidden = true;

    grid.innerHTML = products.map((product) => {
      const cartItem = state.cart.find((i) => i.productId === product.id);
      const inCartQty = cartItem ? cartItem.quantity : 0;
      const isOutOfStock = product.stock <= 0;
      const isMaxReached = inCartQty >= product.stock && !isOutOfStock;

      let badgeHtml = '';
      if (isOutOfStock) {
        badgeHtml = `<span class="badge-tag badge-out-of-stock">Out of Stock</span>`;
      } else if (product.badge) {
        const badgeClass = `badge-${product.badge.toLowerCase().replace(/\s+/g, '-')}`;
        badgeHtml = `<span class="badge-tag ${badgeClass}">${escapeHtml(product.badge)}</span>`;
      }

      let stockText = '';
      let stockClass = '';
      if (isOutOfStock) {
        stockText = 'Out of Stock';
        stockClass = 'out-of-stock';
      } else if (product.stock <= 3) {
        stockText = `Only ${product.stock} left - Hurry!`;
        stockClass = 'low-stock';
      } else {
        stockText = `In Stock (${product.stock} available)`;
        stockClass = 'in-stock';
      }

      let btnLabel = 'Add to Cart';
      if (isOutOfStock) {
        btnLabel = 'Out of Stock';
      } else if (inCartQty > 0) {
        btnLabel = `In Bag (${inCartQty})`;
      }

      return `
        <article class="product-card" data-product-id="${product.id}">
          <div class="product-media-box">
            ${badgeHtml}
            <img 
              class="product-image" 
              src="${escapeHtml(product.image)}" 
              alt="${escapeHtml(product.name)}"
              loading="lazy"
              onerror="this.onerror=null; this.src='assets/products/headphones.svg';"
            >
          </div>
          <div class="product-body">
            <div class="product-category-row">
              <span class="product-category">${escapeHtml(product.category)}</span>
              <span class="stock-indicator ${stockClass}">${stockText}</span>
            </div>
            <h3 class="product-title">${escapeHtml(product.name)}</h3>
            <p class="product-description">${escapeHtml(product.description)}</p>
            <div class="product-footer">
              <div class="product-price-box">
                <span class="price-label">Price</span>
                <span class="product-price">${formatINR(product.price)}</span>
              </div>
              <button 
                type="button" 
                class="add-to-cart-btn ${inCartQty > 0 ? 'in-cart' : ''}" 
                data-action="add-to-cart" 
                data-product-id="${product.id}"
                ${isOutOfStock || isMaxReached ? 'disabled' : ''}
                aria-label="${btnLabel} - ${escapeHtml(product.name)}"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                <span>${btnLabel}</span>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    renderActiveFilterChips();
  };

  const renderActiveFilterChips = () => {
    const container = document.getElementById('active-filters-chips');
    if (!container) return;

    const chips = [];

    if (state.selectedCategory !== 'all') {
      chips.push(`
        <span class="filter-chip">
          Category: ${escapeHtml(state.selectedCategory)}
          <button type="button" class="filter-chip-remove" data-clear="category" aria-label="Clear category filter">×</button>
        </span>
      `);
    }

    if (state.searchQuery.trim() !== '') {
      chips.push(`
        <span class="filter-chip">
          Query: "${escapeHtml(state.searchQuery)}"
          <button type="button" class="filter-chip-remove" data-clear="search" aria-label="Clear search query">×</button>
        </span>
      `);
    }

    if (state.inStockOnly) {
      chips.push(`
        <span class="filter-chip">
          In Stock Only
          <button type="button" class="filter-chip-remove" data-clear="stock" aria-label="Clear in stock filter">×</button>
        </span>
      `);
    }

    container.innerHTML = chips.join('');
  };

  /* ==========================================================================
     11. UI Rendering: Cart Drawer & Summary
     ========================================================================== */
  const renderCart = () => {
    const itemsContainer = document.getElementById('cart-items-container');
    const emptyState = document.getElementById('empty-cart-state');
    const footer = document.getElementById('cart-footer');
    const badge = document.getElementById('cart-badge');
    const headerSubtotal = document.getElementById('cart-subtotal-header');
    const drawerItemCount = document.getElementById('drawer-item-count');

    const totals = calculateCartTotals();

    // Update Header Indicators
    if (badge) badge.textContent = totals.totalItemsCount;
    if (headerSubtotal) headerSubtotal.textContent = formatINR(totals.subtotal);
    if (drawerItemCount) {
      drawerItemCount.textContent = `${totals.totalItemsCount} item${totals.totalItemsCount === 1 ? '' : 's'}`;
    }

    // Free Shipping Bar
    const thresholdText = document.getElementById('threshold-text');
    const progressFill = document.getElementById('shipping-progress-fill');
    const progressBar = document.getElementById('shipping-progress-bar');

    if (thresholdText && progressFill && progressBar) {
      if (totals.subtotal === 0) {
        thresholdText.textContent = `Add ${formatINR(FREE_SHIPPING_THRESHOLD)} more for FREE delivery`;
        progressFill.style.width = '0%';
        progressBar.setAttribute('aria-valuenow', '0');
      } else if (totals.remainingForFreeShipping > 0) {
        thresholdText.textContent = `Add ${formatINR(totals.remainingForFreeShipping)} more for FREE delivery!`;
        const percentage = Math.min(100, Math.round((totals.subtotal / FREE_SHIPPING_THRESHOLD) * 100));
        progressFill.style.width = `${percentage}%`;
        progressBar.setAttribute('aria-valuenow', percentage);
      } else {
        thresholdText.innerHTML = `<strong>Congratulations!</strong> You unlocked FREE delivery!`;
        progressFill.style.width = '100%';
        progressBar.setAttribute('aria-valuenow', '100');
      }
    }

    // Empty Cart vs Items List
    if (state.cart.length === 0) {
      if (itemsContainer) itemsContainer.innerHTML = '';
      if (emptyState) emptyState.classList.add('active');
      if (footer) footer.style.display = 'none';

      document.getElementById('summary-subtotal').textContent = formatINR(0);
      document.getElementById('summary-shipping').textContent = formatINR(0);
      document.getElementById('summary-total').textContent = formatINR(0);
      return;
    }

    if (emptyState) emptyState.classList.remove('active');
    if (footer) footer.style.display = 'flex';

    if (itemsContainer) {
      itemsContainer.innerHTML = state.cart.map((item) => {
        const product = getProductById(item.productId);
        if (!product) return '';

        const lineTotal = product.price * item.quantity;
        const isMaxQty = item.quantity >= product.stock;

        return `
          <div class="cart-item-card" data-product-id="${product.id}">
            <div class="cart-item-thumb">
              <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" onerror="this.src='assets/products/headphones.svg';">
            </div>
            <div class="cart-item-info">
              <h4 class="cart-item-title" title="${escapeHtml(product.name)}">${escapeHtml(product.name)}</h4>
              <span class="cart-item-unit-price">${formatINR(product.price)} each</span>
              ${isMaxQty ? `<span class="cart-item-stock-warning">Max available stock</span>` : ''}
              
              <div class="cart-qty-wrapper">
                <button 
                  type="button" 
                  class="qty-btn qty-decrease" 
                  data-action="decrease-qty" 
                  data-product-id="${product.id}"
                  ${item.quantity <= 1 ? 'disabled' : ''}
                  aria-label="Decrease quantity"
                >-</button>
                <input 
                  type="number" 
                  class="qty-input" 
                  data-product-id="${product.id}"
                  value="${item.quantity}" 
                  min="1" 
                  max="${product.stock}" 
                  aria-label="Item quantity"
                >
                <button 
                  type="button" 
                  class="qty-btn qty-increase" 
                  data-action="increase-qty" 
                  data-product-id="${product.id}"
                  ${isMaxQty ? 'disabled' : ''}
                  aria-label="Increase quantity"
                >+</button>
              </div>
            </div>
            <div class="cart-item-actions">
              <button 
                type="button" 
                class="cart-item-remove-btn" 
                data-action="remove-item" 
                data-product-id="${product.id}"
                aria-label="Remove ${escapeHtml(product.name)} from cart"
                title="Remove item"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
              <span class="cart-item-line-total">${formatINR(lineTotal)}</span>
            </div>
          </div>
        `;
      }).join('');
    }

    // Summary Breakdown
    document.getElementById('summary-subtotal').textContent = formatINR(totals.subtotal);
    document.getElementById('summary-shipping').textContent = totals.shipping === 0 ? 'FREE' : formatINR(totals.shipping);
    document.getElementById('summary-total').textContent = formatINR(totals.finalTotal);

    const discountRow = document.getElementById('summary-discount-row');
    const discountVal = document.getElementById('summary-discount');
    const discountLabel = document.getElementById('discount-code-label');

    if (discountRow && discountVal && discountLabel) {
      if (state.appliedCoupon && totals.discount > 0) {
        discountRow.hidden = false;
        discountLabel.textContent = state.appliedCoupon;
        discountVal.textContent = `-${formatINR(totals.discount)}`;
      } else {
        discountRow.hidden = true;
      }
    }
  };

  /* ==========================================================================
     12. Drawer & Modal Controller
     ========================================================================== */
  const openCartDrawer = () => {
    document.getElementById('cart-drawer').classList.add('active');
    document.getElementById('cart-backdrop').classList.add('active');
    document.getElementById('cart-drawer').setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeCartDrawer = () => {
    document.getElementById('cart-drawer').classList.remove('active');
    document.getElementById('cart-backdrop').classList.remove('active');
    document.getElementById('cart-drawer').setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const openClearCartModal = () => {
    document.getElementById('clear-cart-modal').classList.add('active');
    document.getElementById('clear-modal-backdrop').classList.add('active');
    document.getElementById('clear-cart-modal').setAttribute('aria-hidden', 'false');
  };

  const closeClearCartModal = () => {
    document.getElementById('clear-cart-modal').classList.remove('active');
    document.getElementById('clear-modal-backdrop').classList.remove('active');
    document.getElementById('clear-cart-modal').setAttribute('aria-hidden', 'true');
  };

  const openCheckoutModal = () => {
    if (state.cart.length === 0) {
      showToast('Your shopping bag is empty.', 'warning');
      return;
    }

    closeCartDrawer();
    renderCheckoutSummary();

    const modal = document.getElementById('checkout-modal');
    const backdrop = document.getElementById('checkout-modal-backdrop');
    modal.classList.add('active');
    backdrop.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus first input
    const firstInput = document.getElementById('checkout-name');
    if (firstInput) setTimeout(() => firstInput.focus(), 150);
  };

  const closeCheckoutModal = () => {
    const modal = document.getElementById('checkout-modal');
    const backdrop = document.getElementById('checkout-modal-backdrop');
    modal.classList.remove('active');
    backdrop.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const openConfirmationModal = (orderData) => {
    closeCheckoutModal();

    document.getElementById('confirmed-order-id').textContent = orderData.orderId;
    document.getElementById('confirmed-order-date').textContent = orderData.date;
    document.getElementById('confirmed-customer-name').textContent = orderData.customer.name;
    document.getElementById('confirmed-customer-address').textContent = `${orderData.customer.address}, ${orderData.customer.city} - ${orderData.customer.pincode}`;
    document.getElementById('confirmed-customer-email').textContent = orderData.customer.email;
    document.getElementById('confirmed-customer-phone').textContent = `+91 ${orderData.customer.phone}`;
    document.getElementById('confirmed-order-total').textContent = formatINR(orderData.totals.finalTotal);

    const itemsContainer = document.getElementById('confirmed-items-list');
    if (itemsContainer) {
      itemsContainer.innerHTML = orderData.items.map((i) => `
        <div class="receipt-item-row">
          <span>${escapeHtml(i.name)} × ${i.quantity}</span>
          <span>${formatINR(i.price * i.quantity)}</span>
        </div>
      `).join('');
    }

    const modal = document.getElementById('confirmation-modal');
    const backdrop = document.getElementById('confirmation-modal-backdrop');
    modal.classList.add('active');
    backdrop.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeConfirmationModal = () => {
    const modal = document.getElementById('confirmation-modal');
    const backdrop = document.getElementById('confirmation-modal-backdrop');
    modal.classList.remove('active');
    backdrop.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  /* ==========================================================================
     13. Checkout Summary & Form Validation
     ========================================================================== */
  const renderCheckoutSummary = () => {
    const totals = calculateCartTotals();
    const itemsList = document.getElementById('checkout-review-items');
    if (!itemsList) return;

    itemsList.innerHTML = state.cart.map((item) => {
      const product = getProductById(item.productId);
      if (!product) return '';
      return `
        <div class="review-item-row">
          <div class="review-item-name" title="${escapeHtml(product.name)}">${escapeHtml(product.name)}</div>
          <div class="review-item-qty">Qty: ${item.quantity}</div>
          <div class="review-item-price">${formatINR(product.price * item.quantity)}</div>
        </div>
      `;
    }).join('');

    document.getElementById('checkout-subtotal').textContent = formatINR(totals.subtotal);
    document.getElementById('checkout-shipping').textContent = totals.shipping === 0 ? 'FREE' : formatINR(totals.shipping);
    document.getElementById('checkout-total').textContent = formatINR(totals.finalTotal);

    const discountRow = document.getElementById('checkout-discount-row');
    const discountVal = document.getElementById('checkout-discount');
    if (discountRow && discountVal) {
      if (state.appliedCoupon && totals.discount > 0) {
        discountRow.hidden = false;
        discountVal.textContent = `-${formatINR(totals.discount)}`;
      } else {
        discountRow.hidden = true;
      }
    }
  };

  const validateCheckoutField = (field) => {
    const value = field.value.trim();
    const errorEl = document.getElementById(`${field.name}-error`);
    let errorMessage = '';

    switch (field.name) {
      case 'name':
        if (!value) {
          errorMessage = 'Full name is required.';
        } else if (value.length < 2) {
          errorMessage = 'Name must be at least 2 characters.';
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          errorMessage = 'Email address is required.';
        } else if (!emailRegex.test(value)) {
          errorMessage = 'Enter a valid email address (e.g. name@example.com).';
        }
        break;
      case 'phone':
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!value) {
          errorMessage = 'Phone number is required.';
        } else if (!phoneRegex.test(value)) {
          errorMessage = 'Enter a valid 10-digit Indian mobile number.';
        }
        break;
      case 'address':
        if (!value) {
          errorMessage = 'Delivery address is required.';
        } else if (value.length < 8) {
          errorMessage = 'Please provide complete house/street details.';
        }
        break;
      case 'city':
        if (!value) {
          errorMessage = 'City is required.';
        }
        break;
      case 'pincode':
        const pinRegex = /^\d{6}$/;
        if (!value) {
          errorMessage = '6-digit PIN code is required.';
        } else if (!pinRegex.test(value)) {
          errorMessage = 'PIN code must be exactly 6 digits.';
        }
        break;
    }

    if (errorEl) errorEl.textContent = errorMessage;
    if (errorMessage) {
      field.classList.add('input-error');
      return false;
    } else {
      field.classList.remove('input-error');
      return true;
    }
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (state.isSubmittingOrder) return;

    if (state.cart.length === 0) {
      showToast('Your cart is empty. Cannot checkout.', 'error');
      closeCheckoutModal();
      return;
    }

    const form = e.target;
    const fields = form.querySelectorAll('input[required]');
    let isValid = true;

    fields.forEach((field) => {
      if (!validateCheckoutField(field)) {
        isValid = false;
      }
    });

    if (!isValid) {
      showToast('Please correct the highlighted fields before placing your order.', 'error');
      return;
    }

    // Simulated Order Submission
    state.isSubmittingOrder = true;
    const submitBtn = document.getElementById('place-order-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const spinner = submitBtn.querySelector('.spinner');

    if (submitBtn) submitBtn.disabled = true;
    if (btnText) btnText.textContent = 'Processing Simulation...';
    if (spinner) spinner.hidden = false;

    setTimeout(() => {
      const orderId = `ORD-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      const orderDate = new Intl.DateTimeFormat('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(new Date());

      const totals = calculateCartTotals();
      const orderItems = state.cart.map((item) => {
        const prod = getProductById(item.productId);
        return {
          id: prod.id,
          name: prod.name,
          price: prod.price,
          quantity: item.quantity
        };
      });

      const customerData = {
        name: form.querySelector('#checkout-name').value.trim(),
        email: form.querySelector('#checkout-email').value.trim(),
        phone: form.querySelector('#checkout-phone').value.trim(),
        address: form.querySelector('#checkout-address').value.trim(),
        city: form.querySelector('#checkout-city').value.trim(),
        pincode: form.querySelector('#checkout-pincode').value.trim()
      };

      // Reset submit button state
      state.isSubmittingOrder = false;
      if (submitBtn) submitBtn.disabled = false;
      if (btnText) btnText.textContent = 'Place Simulated Order';
      if (spinner) spinner.hidden = true;
      form.reset();

      // Clear cart in state & storage
      state.cart = [];
      state.appliedCoupon = null;
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignored
      }
      renderCart();
      renderProducts();

      // Show confirmation dialog
      openConfirmationModal({
        orderId,
        date: orderDate,
        customer: customerData,
        items: orderItems,
        totals
      });
    }, 850);
  };

  /* ==========================================================================
     14. Coupon Code Logic
     ========================================================================== */
  const applyCouponCode = () => {
    const input = document.getElementById('coupon-input');
    const feedback = document.getElementById('coupon-feedback');
    if (!input || !feedback) return;

    const code = input.value.trim().toUpperCase();
    if (!code) {
      feedback.textContent = 'Please enter a coupon code.';
      feedback.className = 'promo-feedback error';
      return;
    }

    if (AVAILABLE_COUPONS[code]) {
      state.appliedCoupon = code;
      feedback.textContent = `Coupon "${code}" applied successfully!`;
      feedback.className = 'promo-feedback success';
      input.value = '';
      renderCart();
      showToast(`Coupon "${code}" applied!`, 'success');
    } else {
      feedback.textContent = 'Invalid promo code. Try "SAVE10" or "WELCOME50".';
      feedback.className = 'promo-feedback error';
    }
  };

  const removeCouponCode = () => {
    state.appliedCoupon = null;
    const feedback = document.getElementById('coupon-feedback');
    if (feedback) {
      feedback.textContent = '';
      feedback.className = 'promo-feedback';
    }
    renderCart();
    showToast('Promo coupon removed.', 'info');
  };

  /* ==========================================================================
     15. Theme Toggle Logic
     ========================================================================== */
  const initTheme = () => {
    let currentTheme = 'dark';
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === 'light' || stored === 'dark') {
        currentTheme = stored;
      }
    } catch {
      // Ignored
    }
    document.documentElement.setAttribute('data-theme', currentTheme);
  };

  const toggleTheme = () => {
    const html = document.documentElement;
    const nextTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', nextTheme);
    try {
      localStorage.setItem(THEME_KEY, nextTheme);
    } catch {
      // Ignored
    }
  };

  /* ==========================================================================
     16. Event Delegation & Listeners Setup
     ========================================================================== */
  const attachEventListeners = () => {
    // Theme toggle
    document.getElementById('theme-toggle-btn')?.addEventListener('click', toggleTheme);

    // Cart Drawer triggers
    document.getElementById('cart-open-btn')?.addEventListener('click', openCartDrawer);
    document.getElementById('cart-close-btn')?.addEventListener('click', closeCartDrawer);
    document.getElementById('cart-backdrop')?.addEventListener('click', closeCartDrawer);
    document.getElementById('start-shopping-btn')?.addEventListener('click', closeCartDrawer);

    // Clear Cart triggers
    document.getElementById('clear-cart-trigger-btn')?.addEventListener('click', openClearCartModal);
    document.getElementById('cancel-clear-cart-btn')?.addEventListener('click', closeClearCartModal);
    document.getElementById('clear-modal-backdrop')?.addEventListener('click', closeClearCartModal);
    document.getElementById('confirm-clear-cart-btn')?.addEventListener('click', () => {
      closeClearCartModal();
      clearEntireCart();
    });

    // Checkout Modal triggers
    document.getElementById('proceed-checkout-btn')?.addEventListener('click', openCheckoutModal);
    document.getElementById('checkout-close-btn')?.addEventListener('click', closeCheckoutModal);
    document.getElementById('checkout-cancel-btn')?.addEventListener('click', () => {
      closeCheckoutModal();
      openCartDrawer();
    });
    document.getElementById('checkout-modal-backdrop')?.addEventListener('click', closeCheckoutModal);

    // Order Confirmation Modal triggers
    document.getElementById('continue-shopping-btn')?.addEventListener('click', () => {
      closeConfirmationModal();
      state.selectedCategory = 'all';
      state.searchQuery = '';
      const searchInput = document.getElementById('search-input');
      if (searchInput) searchInput.value = '';
      document.querySelectorAll('.category-pill').forEach((pill) => {
        pill.classList.toggle('active', pill.dataset.category === 'all');
      });
      renderProducts();
    });
    document.getElementById('confirmation-modal-backdrop')?.addEventListener('click', closeConfirmationModal);

    // Category Tabs
    document.getElementById('category-tabs')?.addEventListener('click', (e) => {
      const pill = e.target.closest('.category-pill');
      if (!pill) return;
      document.querySelectorAll('.category-pill').forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      state.selectedCategory = pill.dataset.category;
      renderProducts();
    });

    // Search Input with Debounce & Clear Button
    const searchInput = document.getElementById('search-input');
    const searchClearBtn = document.getElementById('search-clear-btn');

    let searchTimer = null;
    searchInput?.addEventListener('input', (e) => {
      const val = e.target.value;
      if (searchClearBtn) searchClearBtn.hidden = val.length === 0;

      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        state.searchQuery = val;
        renderProducts();
      }, 200);
    });

    searchClearBtn?.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      searchClearBtn.hidden = true;
      state.searchQuery = '';
      renderProducts();
    });

    // Stock Filter Toggle
    document.getElementById('in-stock-only-checkbox')?.addEventListener('change', (e) => {
      state.inStockOnly = e.target.checked;
      renderProducts();
    });

    // Sort Dropdown
    document.getElementById('sort-select')?.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      renderProducts();
    });

    // Reset All Filters from Empty State
    document.getElementById('reset-filters-btn')?.addEventListener('click', () => {
      state.selectedCategory = 'all';
      state.searchQuery = '';
      state.inStockOnly = false;
      state.sortBy = 'featured';

      if (searchInput) searchInput.value = '';
      if (searchClearBtn) searchClearBtn.hidden = true;
      const stockCb = document.getElementById('in-stock-only-checkbox');
      if (stockCb) stockCb.checked = false;
      const sortSel = document.getElementById('sort-select');
      if (sortSel) sortSel.value = 'featured';

      document.querySelectorAll('.category-pill').forEach((p) => {
        p.classList.toggle('active', p.dataset.category === 'all');
      });
      renderProducts();
    });

    // Active Filter Chips delegate
    document.getElementById('active-filters-chips')?.addEventListener('click', (e) => {
      const clearBtn = e.target.closest('.filter-chip-remove');
      if (!clearBtn) return;
      const type = clearBtn.dataset.clear;

      if (type === 'category') {
        state.selectedCategory = 'all';
        document.querySelectorAll('.category-pill').forEach((p) => {
          p.classList.toggle('active', p.dataset.category === 'all');
        });
      } else if (type === 'search') {
        state.searchQuery = '';
        if (searchInput) searchInput.value = '';
        if (searchClearBtn) searchClearBtn.hidden = true;
      } else if (type === 'stock') {
        state.inStockOnly = false;
        const cb = document.getElementById('in-stock-only-checkbox');
        if (cb) cb.checked = false;
      }
      renderProducts();
    });

    // Product Grid delegate (Add to Cart)
    document.getElementById('products-grid')?.addEventListener('click', (e) => {
      const addBtn = e.target.closest('button[data-action="add-to-cart"]');
      if (!addBtn || addBtn.disabled) return;
      const productId = addBtn.dataset.productId;
      if (productId) addToCart(productId);
    });

    // Cart Items Container delegate (Qty changes, remove)
    const cartContainer = document.getElementById('cart-items-container');
    cartContainer?.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      const action = btn.dataset.action;
      const productId = btn.dataset.productId;
      const cartItem = state.cart.find((i) => i.productId === productId);
      if (!cartItem) return;

      if (action === 'increase-qty') {
        updateCartQuantity(productId, cartItem.quantity + 1);
      } else if (action === 'decrease-qty') {
        updateCartQuantity(productId, cartItem.quantity - 1);
      } else if (action === 'remove-item') {
        removeFromCart(productId);
      }
    });

    // Quantity Input direct edit
    cartContainer?.addEventListener('change', (e) => {
      const input = e.target.closest('.qty-input');
      if (!input) return;
      const productId = input.dataset.productId;
      updateCartQuantity(productId, input.value);
    });

    // Coupon Code Apply & Remove
    document.getElementById('apply-coupon-btn')?.addEventListener('click', applyCouponCode);
    document.getElementById('coupon-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        applyCouponCode();
      }
    });
    document.getElementById('cart-footer')?.addEventListener('click', (e) => {
      if (e.target.closest('#remove-coupon-btn')) {
        removeCouponCode();
      }
    });

    // Checkout Form Submit & Field Validation
    const checkoutForm = document.getElementById('checkout-form');
    checkoutForm?.addEventListener('submit', handleCheckoutSubmit);
    checkoutForm?.querySelectorAll('input[required]').forEach((field) => {
      field.addEventListener('blur', () => validateCheckoutField(field));
      field.addEventListener('input', () => {
        if (field.classList.contains('input-error')) {
          validateCheckoutField(field);
        }
      });
    });

    // Keyboard Shortcuts: ESC key closes open modals / drawer
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (document.getElementById('confirmation-modal')?.classList.contains('active')) {
          closeConfirmationModal();
        } else if (document.getElementById('clear-cart-modal')?.classList.contains('active')) {
          closeClearCartModal();
        } else if (document.getElementById('checkout-modal')?.classList.contains('active')) {
          closeCheckoutModal();
        } else if (document.getElementById('cart-drawer')?.classList.contains('active')) {
          closeCartDrawer();
        }
      }
    });
  };

  /* ==========================================================================
     17. Initialization
     ========================================================================== */
  const init = () => {
    initTheme();
    state.cart = loadCartFromStorage();
    renderProducts();
    renderCart();
    attachEventListeners();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
