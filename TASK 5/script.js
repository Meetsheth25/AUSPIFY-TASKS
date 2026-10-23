(() => {
  'use strict';

  const STORAGE_KEY = 'task5_expense_tracker_v1';

  const CATEGORIES = {
    income: [
      'Salary',
      'Freelance',
      'Business',
      'Investment',
      'Other Income'
    ],
    expense: [
      'Food',
      'Transport',
      'Shopping',
      'Bills',
      'Health',
      'Education',
      'Entertainment',
      'Housing',
      'Other Expense'
    ]
  };

  const currencyFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const state = {
    transactions: [],
    editingId: null,
    isSubmitting: false,
    filters: {
      search: '',
      type: 'all',
      startDate: '',
      endDate: ''
    },
    selectedMonth: getCurrentYearMonth()
  };

  const elements = {
    // Top Metrics
    totalBalance: document.getElementById('totalBalance'),
    totalIncome: document.getElementById('totalIncome'),
    totalExpenses: document.getElementById('totalExpenses'),
    totalTransactions: document.getElementById('totalTransactions'),
    incomeCount: document.getElementById('incomeCount'),
    expenseCount: document.getElementById('expenseCount'),
    balanceStatusBadge: document.getElementById('balanceStatusBadge'),
    currentDateDisplay: document.getElementById('currentDateDisplay'),

    // Form
    transactionForm: document.getElementById('transactionForm'),
    formHeading: document.getElementById('formHeading'),
    editModeIndicator: document.getElementById('editModeIndicator'),
    editTransactionId: document.getElementById('editTransactionId'),
    typeExpense: document.getElementById('typeExpense'),
    typeIncome: document.getElementById('typeIncome'),
    amountInput: document.getElementById('amountInput'),
    descriptionInput: document.getElementById('descriptionInput'),
    categorySelect: document.getElementById('categorySelect'),
    dateInput: document.getElementById('dateInput'),
    submitBtn: document.getElementById('submitBtn'),
    submitBtnText: document.getElementById('submitBtnText'),
    cancelEditBtn: document.getElementById('cancelEditBtn'),

    // Inline Errors
    typeError: document.getElementById('typeError'),
    amountError: document.getElementById('amountError'),
    descriptionError: document.getElementById('descriptionError'),
    categoryError: document.getElementById('categoryError'),
    dateError: document.getElementById('dateError'),

    // Monthly Summary
    summaryMonthSelect: document.getElementById('summaryMonthSelect'),
    monthIncome: document.getElementById('monthIncome'),
    monthExpenses: document.getElementById('monthExpenses'),
    monthNetBalance: document.getElementById('monthNetBalance'),
    categoryBreakdownContainer: document.getElementById('categoryBreakdownContainer'),

    // History & Filters
    searchInput: document.getElementById('searchInput'),
    filterTypeSelect: document.getElementById('filterTypeSelect'),
    filterStartDate: document.getElementById('filterStartDate'),
    filterEndDate: document.getElementById('filterEndDate'),
    resetFiltersBtn: document.getElementById('resetFiltersBtn'),
    matchingCountBadge: document.getElementById('matchingCountBadge'),
    transactionListContainer: document.getElementById('transactionListContainer'),
    clearAllBtn: document.getElementById('clearAllBtn'),

    // Modal & Toast
    confirmModal: document.getElementById('confirmModal'),
    modalTitle: document.getElementById('modalTitle'),
    modalMessage: document.getElementById('modalMessage'),
    modalConfirmBtn: document.getElementById('modalConfirmBtn'),
    modalCancelBtn: document.getElementById('modalCancelBtn'),
    toastContainer: document.getElementById('toastContainer')
  };

  let modalConfirmCallback = null;

  function init() {
    displayCurrentDate();
    elements.dateInput.value = getTodayDate();
    elements.summaryMonthSelect.value = state.selectedMonth;

    updateCategoryOptions('expense');
    loadTransactions();

    bindEvents();
    renderAll();
  }

  function getTodayDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  function getCurrentYearMonth() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    return `${yyyy}-${mm}`;
  }

  function displayCurrentDate() {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    elements.currentDateDisplay.textContent = new Date().toLocaleDateString('en-IN', options);
  }

  // Storage Operations
  function loadTransactions() {
    try {
      const rawData = localStorage.getItem(STORAGE_KEY);
      if (!rawData) {
        state.transactions = [];
        return;
      }

      const parsed = JSON.parse(rawData);
      if (!Array.isArray(parsed)) {
        console.warn('Storage data is not an array. Starting fresh.');
        state.transactions = [];
        return;
      }

      state.transactions = parsed.filter(isValidTransactionRecord);
    } catch (err) {
      console.error('Failed to load records from localStorage:', err);
      showToast('Error reading saved records from storage.', 'danger');
      state.transactions = [];
    }
  }

  function saveTransactions() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.transactions));
      return true;
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
      showToast('Storage quota exceeded or storage unavailable. Changes not saved.', 'danger');
      return false;
    }
  }

  function isValidTransactionRecord(item) {
    if (!item || typeof item !== 'object') return false;
    if (typeof item.id !== 'string' || !item.id.trim()) return false;
    if (item.type !== 'income' && item.type !== 'expense') return false;
    if (typeof item.amountPaise !== 'number' || !Number.isInteger(item.amountPaise) || item.amountPaise <= 0) return false;
    if (typeof item.description !== 'string' || !item.description.trim()) return false;
    if (typeof item.category !== 'string' || !item.category.trim()) return false;
    if (typeof item.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(item.date)) return false;
    return true;
  }

  function updateCategoryOptions(type, selectedCategory = '') {
    const options = CATEGORIES[type] || [];
    elements.categorySelect.innerHTML = '';

    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Select Category';
    placeholder.disabled = true;
    if (!selectedCategory) placeholder.selected = true;
    elements.categorySelect.appendChild(placeholder);

    options.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      if (cat === selectedCategory) {
        opt.selected = true;
      }
      elements.categorySelect.appendChild(opt);
    });
  }

  function getSelectedType() {
    return elements.typeIncome.checked ? 'income' : 'expense';
  }

  function clearInlineErrors() {
    elements.typeError.textContent = '';
    elements.amountError.textContent = '';
    elements.descriptionError.textContent = '';
    elements.categoryError.textContent = '';
    elements.dateError.textContent = '';

    elements.amountInput.classList.remove('input-error');
    elements.descriptionInput.classList.remove('input-error');
    elements.categorySelect.classList.remove('input-error');
    elements.dateInput.classList.remove('input-error');
  }

  function validateForm() {
    clearInlineErrors();
    let isValid = true;

    const type = getSelectedType();
    if (type !== 'income' && type !== 'expense') {
      elements.typeError.textContent = 'Please choose Income or Expense.';
      isValid = false;
    }

    const amountVal = parseFloat(elements.amountInput.value);
    if (isNaN(amountVal) || !Number.isFinite(amountVal) || amountVal <= 0) {
      elements.amountError.textContent = 'Enter a valid amount greater than zero.';
      elements.amountInput.classList.add('input-error');
      isValid = false;
    }

    const descVal = elements.descriptionInput.value.trim();
    if (!descVal) {
      elements.descriptionError.textContent = 'Description cannot be empty or blank.';
      elements.descriptionInput.classList.add('input-error');
      isValid = false;
    }

    const catVal = elements.categorySelect.value.trim();
    const validCats = CATEGORIES[type] || [];
    if (!catVal || !validCats.includes(catVal)) {
      elements.categoryError.textContent = 'Please select a valid category for this type.';
      elements.categorySelect.classList.add('input-error');
      isValid = false;
    }

    const dateVal = elements.dateInput.value.trim();
    if (!dateVal || !/^\d{4}-\d{2}-\d{2}$/.test(dateVal)) {
      elements.dateError.textContent = 'Please select a valid transaction date.';
      elements.dateInput.classList.add('input-error');
      isValid = false;
    }

    return isValid;
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    if (state.isSubmitting) return;
    if (!validateForm()) return;

    state.isSubmitting = true;
    elements.submitBtn.disabled = true;

    const type = getSelectedType();
    const amountVal = parseFloat(elements.amountInput.value);
    // Use integer paise for calculations to prevent precision errors
    const amountPaise = Math.round(amountVal * 100);
    const description = elements.descriptionInput.value.trim();
    const category = elements.categorySelect.value.trim();
    const date = elements.dateInput.value.trim();

    if (state.editingId) {
      const index = state.transactions.findIndex(t => t.id === state.editingId);
      if (index !== -1) {
        state.transactions[index] = {
          ...state.transactions[index],
          type,
          amountPaise,
          amount: amountPaise / 100,
          description,
          category,
          date,
          updatedAt: Date.now()
        };
        saveTransactions();
        showToast('Transaction updated successfully.', 'success');
      } else {
        showToast('Transaction record not found.', 'danger');
      }
      resetFormState();
    } else {
      const newTransaction = {
        id: 'tx_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 8),
        type,
        amountPaise,
        amount: amountPaise / 100,
        description,
        category,
        date,
        createdAt: Date.now()
      };

      state.transactions.push(newTransaction);
      saveTransactions();
      showToast('Transaction recorded successfully.', 'success');
      resetFormState();
    }

    renderAll();
    state.isSubmitting = false;
    elements.submitBtn.disabled = false;
  }

  function resetFormState() {
    state.editingId = null;
    elements.editTransactionId.value = '';
    elements.formHeading.textContent = 'Add Transaction';
    elements.editModeIndicator.classList.add('hidden');
    elements.submitBtnText.textContent = 'Add Transaction';
    elements.cancelEditBtn.classList.add('hidden');

    elements.transactionForm.reset();
    elements.typeExpense.checked = true;
    updateCategoryOptions('expense');
    elements.dateInput.value = getTodayDate();
    clearInlineErrors();
  }

  function startEditing(id) {
    const item = state.transactions.find(t => t.id === id);
    if (!item) return;

    state.editingId = id;
    elements.editTransactionId.value = id;
    elements.formHeading.textContent = 'Edit Transaction';
    elements.editModeIndicator.classList.remove('hidden');
    elements.submitBtnText.textContent = 'Save Changes';
    elements.cancelEditBtn.classList.remove('hidden');

    if (item.type === 'income') {
      elements.typeIncome.checked = true;
    } else {
      elements.typeExpense.checked = true;
    }

    updateCategoryOptions(item.type, item.category);

    elements.amountInput.value = (item.amountPaise / 100).toFixed(2);
    elements.descriptionInput.value = item.description;
    elements.dateInput.value = item.date;

    clearInlineErrors();
    elements.amountInput.focus();
    elements.formHeading.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function confirmDelete(id) {
    const item = state.transactions.find(t => t.id === id);
    if (!item) return;

    openConfirmModal(
      'Delete Transaction',
      `Delete "${item.description}" (${currencyFormatter.format(item.amountPaise / 100)})? This action cannot be undone.`,
      () => {
        state.transactions = state.transactions.filter(t => t.id !== id);
        if (state.editingId === id) {
          resetFormState();
        }
        saveTransactions();
        showToast('Transaction deleted.', 'info');
        renderAll();
      }
    );
  }

  function confirmClearAll() {
    if (state.transactions.length === 0) {
      showToast('No transactions to clear.', 'info');
      return;
    }

    openConfirmModal(
      'Reset All Records',
      'Are you sure you want to delete ALL transactions? This will erase your entire ledger history.',
      () => {
        state.transactions = [];
        resetFormState();
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch (err) {
          console.error(err);
        }
        showToast('All transaction records have been erased.', 'info');
        renderAll();
      }
    );
  }

  // Financial Calculations
  function calculateAllTotals(transactionList) {
    let incomePaise = 0;
    let expensePaise = 0;
    let incomeCount = 0;
    let expenseCount = 0;

    for (const t of transactionList) {
      if (t.type === 'income') {
        incomePaise += t.amountPaise;
        incomeCount++;
      } else if (t.type === 'expense') {
        expensePaise += t.amountPaise;
        expenseCount++;
      }
    }

    const balancePaise = incomePaise - expensePaise;

    return {
      incomePaise,
      expensePaise,
      balancePaise,
      incomeAmount: incomePaise / 100,
      expenseAmount: expensePaise / 100,
      balanceAmount: balancePaise / 100,
      incomeCount,
      expenseCount,
      totalCount: incomeCount + expenseCount
    };
  }

  function calculateMonthlySummary(yearMonth) {
    const monthTx = state.transactions.filter(t => t.date.startsWith(yearMonth));
    const totals = calculateAllTotals(monthTx);

    // Group only expense transactions by category
    const categoryTotals = {};
    for (const cat of CATEGORIES.expense) {
      categoryTotals[cat] = 0;
    }

    for (const t of monthTx) {
      if (t.type === 'expense') {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amountPaise;
      }
    }

    return {
      totals,
      categoryTotals,
      totalExpensePaise: totals.expensePaise
    };
  }

  // Filtering & Sorting
  function getFilteredAndSortedTransactions() {
    const { search, type, startDate, endDate } = state.filters;
    const searchLower = search.trim().toLowerCase();

    const filtered = state.transactions.filter(t => {
      if (type !== 'all' && t.type !== type) return false;

      if (searchLower) {
        const descMatch = t.description.toLowerCase().includes(searchLower);
        const catMatch = t.category.toLowerCase().includes(searchLower);
        if (!descMatch && !catMatch) return false;
      }

      if (startDate && t.date < startDate) return false;
      if (endDate && t.date > endDate) return false;

      return true;
    });

    // Sort descending by date, secondary by createdAt/id
    filtered.sort((a, b) => {
      const dateComparison = b.date.localeCompare(a.date);
      if (dateComparison !== 0) return dateComparison;
      return (b.createdAt || 0) - (a.createdAt || 0);
    });

    return filtered;
  }

  // Rendering
  function renderAll() {
    renderDashboardMetrics();
    renderMonthlySummary();
    renderTransactionHistory();
  }

  function renderDashboardMetrics() {
    const totals = calculateAllTotals(state.transactions);

    elements.totalBalance.textContent = currencyFormatter.format(totals.balanceAmount);
    elements.totalIncome.textContent = currencyFormatter.format(totals.incomeAmount);
    elements.totalExpenses.textContent = currencyFormatter.format(totals.expenseAmount);
    elements.totalTransactions.textContent = totals.totalCount.toString();

    elements.incomeCount.textContent = totals.incomeCount.toString();
    elements.expenseCount.textContent = totals.expenseCount.toString();

    elements.balanceStatusBadge.className = 'status-badge';
    if (totals.balanceAmount > 0) {
      elements.balanceStatusBadge.classList.add('status-positive');
      elements.balanceStatusBadge.textContent = 'Surplus';
    } else if (totals.balanceAmount < 0) {
      elements.balanceStatusBadge.classList.add('status-negative');
      elements.balanceStatusBadge.textContent = 'Deficit';
    } else {
      elements.balanceStatusBadge.classList.add('status-neutral');
      elements.balanceStatusBadge.textContent = 'Neutral';
    }
  }

  function renderMonthlySummary() {
    const { totals, categoryTotals, totalExpensePaise } = calculateMonthlySummary(state.selectedMonth);

    elements.monthIncome.textContent = currencyFormatter.format(totals.incomeAmount);
    elements.monthExpenses.textContent = currencyFormatter.format(totals.expenseAmount);
    elements.monthNetBalance.textContent = currencyFormatter.format(totals.balanceAmount);

    if (totals.balanceAmount > 0) {
      elements.monthNetBalance.className = 'mini-value text-income';
    } else if (totals.balanceAmount < 0) {
      elements.monthNetBalance.className = 'mini-value text-expense';
    } else {
      elements.monthNetBalance.className = 'mini-value';
    }

    renderCategoryBreakdown(categoryTotals, totalExpensePaise);
  }

  function renderCategoryBreakdown(categoryTotals, totalExpensePaise) {
    elements.categoryBreakdownContainer.innerHTML = '';

    const entries = Object.entries(categoryTotals).filter(([, paise]) => paise > 0);
    entries.sort((a, b) => b[1] - a[1]);

    if (entries.length === 0) {
      const emptyMsg = document.createElement('p');
      emptyMsg.className = 'metric-subtext';
      emptyMsg.textContent = 'No expense records found for this month.';
      elements.categoryBreakdownContainer.appendChild(emptyMsg);
      return;
    }

    entries.forEach(([category, paise]) => {
      const pct = totalExpensePaise > 0 ? ((paise / totalExpensePaise) * 100).toFixed(1) : '0.0';
      const itemEl = document.createElement('div');
      itemEl.className = 'category-progress-item';

      const headerEl = document.createElement('div');
      headerEl.className = 'category-progress-header';

      const nameWrapper = document.createElement('span');
      nameWrapper.className = 'category-name-wrapper';
      nameWrapper.textContent = category;

      const figuresEl = document.createElement('div');
      figuresEl.className = 'category-figures';

      const amountSpan = document.createElement('span');
      amountSpan.className = 'category-amount';
      amountSpan.textContent = currencyFormatter.format(paise / 100);

      const pctSpan = document.createElement('span');
      pctSpan.className = 'category-pct';
      pctSpan.textContent = `${pct}%`;

      figuresEl.appendChild(amountSpan);
      figuresEl.appendChild(pctSpan);
      headerEl.appendChild(nameWrapper);
      headerEl.appendChild(figuresEl);

      const trackEl = document.createElement('div');
      trackEl.className = 'progress-track';

      const barEl = document.createElement('div');
      barEl.className = 'progress-bar';
      barEl.style.width = `${pct}%`;
      barEl.setAttribute('role', 'progressbar');
      barEl.setAttribute('aria-valuenow', pct);
      barEl.setAttribute('aria-valuemin', '0');
      barEl.setAttribute('aria-valuemax', '100');

      trackEl.appendChild(barEl);
      itemEl.appendChild(headerEl);
      itemEl.appendChild(trackEl);

      elements.categoryBreakdownContainer.appendChild(itemEl);
    });
  }

  function renderTransactionHistory() {
    const list = getFilteredAndSortedTransactions();
    elements.transactionListContainer.innerHTML = '';

    elements.matchingCountBadge.textContent = `Showing ${list.length} of ${state.transactions.length} record(s)`;

    if (state.transactions.length === 0) {
      elements.transactionListContainer.appendChild(createEmptyState(
        'No Transactions Yet',
        'Your ledger is empty. Add your first income or expense transaction to start tracking.'
      ));
      return;
    }

    if (list.length === 0) {
      const emptyFiltered = createEmptyState(
        'No Matching Transactions',
        'No records match your active search and filter criteria. Try adjusting your filters.'
      );
      const resetBtn = document.createElement('button');
      resetBtn.type = 'button';
      resetBtn.className = 'btn btn-secondary btn-sm';
      resetBtn.style.marginTop = '0.75rem';
      resetBtn.textContent = 'Clear Filters';
      resetBtn.addEventListener('click', resetFilters);
      emptyFiltered.appendChild(resetBtn);
      elements.transactionListContainer.appendChild(emptyFiltered);
      return;
    }

    list.forEach(tx => {
      elements.transactionListContainer.appendChild(createTransactionRow(tx));
    });
  }

  function createTransactionRow(tx) {
    const item = document.createElement('div');
    item.className = 'transaction-item';
    item.dataset.id = tx.id;

    // Left Details
    const mainDiv = document.createElement('div');
    mainDiv.className = 'tx-main';

    const iconBadge = document.createElement('div');
    iconBadge.className = `tx-icon-badge ${tx.type === 'income' ? 'tx-icon-income' : 'tx-icon-expense'}`;
    iconBadge.setAttribute('aria-hidden', 'true');

    if (tx.type === 'income') {
      iconBadge.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else {
      iconBadge.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
    }

    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'tx-details';

    const descEl = document.createElement('span');
    descEl.className = 'tx-desc';
    descEl.textContent = tx.description; // Safe textContent against XSS

    const metaDiv = document.createElement('div');
    metaDiv.className = 'tx-meta';

    const catBadge = document.createElement('span');
    catBadge.className = 'tx-category-badge';
    catBadge.textContent = tx.category;

    const dateSpan = document.createElement('span');
    dateSpan.className = 'tx-date';
    dateSpan.textContent = formatDisplayDate(tx.date);

    metaDiv.appendChild(catBadge);
    metaDiv.appendChild(dateSpan);
    detailsDiv.appendChild(descEl);
    detailsDiv.appendChild(metaDiv);

    mainDiv.appendChild(iconBadge);
    mainDiv.appendChild(detailsDiv);

    // Right Amount & Actions
    const rightDiv = document.createElement('div');
    rightDiv.className = 'tx-right';

    const amountSpan = document.createElement('span');
    amountSpan.className = `tx-amount ${tx.type === 'income' ? 'amount-income' : 'amount-expense'}`;
    const sign = tx.type === 'income' ? '+' : '-';
    amountSpan.textContent = `${sign} ${currencyFormatter.format(tx.amountPaise / 100)}`;

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'tx-actions';

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'btn-icon action-edit';
    editBtn.setAttribute('aria-label', `Edit ${tx.description}`);
    editBtn.title = 'Edit transaction';
    editBtn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`;
    editBtn.addEventListener('click', () => startEditing(tx.id));

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'btn-icon action-delete';
    deleteBtn.setAttribute('aria-label', `Delete ${tx.description}`);
    deleteBtn.title = 'Delete transaction';
    deleteBtn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;
    deleteBtn.addEventListener('click', () => confirmDelete(tx.id));

    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);

    rightDiv.appendChild(amountSpan);
    rightDiv.appendChild(actionsDiv);

    item.appendChild(mainDiv);
    item.appendChild(rightDiv);

    return item;
  }

  function formatDisplayDate(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return dateObj.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  function createEmptyState(title, description) {
    const wrap = document.createElement('div');
    wrap.className = 'empty-state';

    const icon = document.createElement('div');
    icon.className = 'empty-state-icon';
    icon.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`;

    const h = document.createElement('h3');
    h.className = 'empty-state-title';
    h.textContent = title;

    const p = document.createElement('p');
    p.className = 'empty-state-desc';
    p.textContent = description;

    wrap.appendChild(icon);
    wrap.appendChild(h);
    wrap.appendChild(p);
    return wrap;
  }

  // Filter Handlers
  function resetFilters() {
    state.filters.search = '';
    state.filters.type = 'all';
    state.filters.startDate = '';
    state.filters.endDate = '';

    elements.searchInput.value = '';
    elements.filterTypeSelect.value = 'all';
    elements.filterStartDate.value = '';
    elements.filterEndDate.value = '';

    renderTransactionHistory();
  }

  // Confirmation Modal
  function openConfirmModal(title, message, onConfirm) {
    elements.modalTitle.textContent = title;
    elements.modalMessage.textContent = message;
    modalConfirmCallback = onConfirm;

    elements.confirmModal.classList.remove('hidden');
    elements.modalConfirmBtn.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeConfirmModal() {
    elements.confirmModal.classList.add('hidden');
    modalConfirmCallback = null;
    document.body.style.overflow = '';
  }

  // Toast System
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'status');

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === 'danger') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    } else {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `
      <span class="toast-icon" aria-hidden="true">${iconSvg}</span>
      <span class="toast-message">${escapeHtml(message)}</span>
    `;

    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 200ms ease';
      setTimeout(() => toast.remove(), 200);
    }, 3200);
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Event Listeners
  function bindEvents() {
    // Form Type Toggle
    elements.typeExpense.addEventListener('change', () => {
      updateCategoryOptions('expense');
      clearInlineErrors();
    });

    elements.typeIncome.addEventListener('change', () => {
      updateCategoryOptions('income');
      clearInlineErrors();
    });

    elements.transactionForm.addEventListener('submit', handleFormSubmit);

    elements.cancelEditBtn.addEventListener('click', resetFormState);

    // Live Validation on input blur
    elements.amountInput.addEventListener('blur', () => {
      const val = parseFloat(elements.amountInput.value);
      if (isNaN(val) || val <= 0) {
        elements.amountError.textContent = 'Enter a valid amount greater than zero.';
        elements.amountInput.classList.add('input-error');
      } else {
        elements.amountError.textContent = '';
        elements.amountInput.classList.remove('input-error');
      }
    });

    elements.descriptionInput.addEventListener('blur', () => {
      if (!elements.descriptionInput.value.trim()) {
        elements.descriptionError.textContent = 'Description cannot be empty or blank.';
        elements.descriptionInput.classList.add('input-error');
      } else {
        elements.descriptionError.textContent = '';
        elements.descriptionInput.classList.remove('input-error');
      }
    });

    // Month Selector Change
    elements.summaryMonthSelect.addEventListener('change', (e) => {
      state.selectedMonth = e.target.value || getCurrentYearMonth();
      renderMonthlySummary();
    });

    // Filters
    elements.searchInput.addEventListener('input', (e) => {
      state.filters.search = e.target.value;
      renderTransactionHistory();
    });

    elements.filterTypeSelect.addEventListener('change', (e) => {
      state.filters.type = e.target.value;
      renderTransactionHistory();
    });

    elements.filterStartDate.addEventListener('change', (e) => {
      state.filters.startDate = e.target.value;
      renderTransactionHistory();
    });

    elements.filterEndDate.addEventListener('change', (e) => {
      state.filters.endDate = e.target.value;
      renderTransactionHistory();
    });

    elements.resetFiltersBtn.addEventListener('click', resetFilters);

    // Reset All Records
    elements.clearAllBtn.addEventListener('click', confirmClearAll);

    // Modal Events
    elements.modalCancelBtn.addEventListener('click', closeConfirmModal);
    elements.modalConfirmBtn.addEventListener('click', () => {
      if (typeof modalConfirmCallback === 'function') {
        modalConfirmCallback();
      }
      closeConfirmModal();
    });

    elements.confirmModal.addEventListener('click', (e) => {
      if (e.target === elements.confirmModal) {
        closeConfirmModal();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !elements.confirmModal.classList.contains('hidden')) {
        closeConfirmModal();
      }
    });
  }

  // Initialize on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
