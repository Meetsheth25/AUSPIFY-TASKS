# Task 5: Expense Tracker Application (FinTrack Ledger)

FinTrack Ledger is a responsive, client-side personal finance management application built using semantic HTML5, modern CSS3, and Vanilla JavaScript. It allows users to track income and expenditures, calculate balances in real-time, persist data locally via browser `localStorage`, and visualize expense breakdowns.

---

## 1. Project Overview

- **Location**: `m:/Mit/INTERNSHIP/AUSPIFY/TASK 5/`
- **Core Stack**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Storage**: Browser LocalStorage (`task5_expense_tracker_v1`)
- **Currency Standard**: Indian Rupee (INR - `₹`) via `Intl.NumberFormat('en-IN')`
- **External Dependencies**: Zero runtime dependencies. Runs standalone in any modern browser.

---

## 2. File Structure

```
TASK 5/
├── index.html        # Semantic HTML5 layout and accessibility attributes
├── style.css         # Modern styling, responsive grid, and CSS progress bars
├── script.js         # Core application logic, validation, state, and rendering
├── test_suite.js     # Automated test suite for calculations, validation, and storage
└── README.md         # Comprehensive project documentation
```

---

## 3. Core Features

### A. Dashboard Metrics
- **Total Balance**: Real-time calculation (`Total Income - Total Expenses`) with Surplus, Deficit, or Neutral status badge.
- **Total Income**: Sum of all recorded income transactions.
- **Total Expenses**: Sum of all recorded expenditure transactions.
- **Total Transactions**: Total count of active ledger entries.
- **Currency Precision**: All monetary values are calculated internally in integer paise (`Math.round(amount * 100)`) to eliminate floating-point precision errors before formatting to INR.

### B. Transaction Management
- **Add Transactions**: Support for both Income and Expense types with contextual category selection.
- **Categories**:
  - *Income*: Salary, Freelance, Business, Investment, Other Income
  - *Expense*: Food, Transport, Shopping, Bills, Health, Education, Entertainment, Housing, Other Expense
- **Validation**:
  - Positive, finite numerical amounts (`> 0`).
  - Non-empty, trimmed descriptions.
  - Category validation matching selected transaction type.
  - Valid transaction date formatted as `YYYY-MM-DD`.
  - Inline error alerts near the offending inputs.
- **Edit Records**: Pre-populates the form with existing data, displays an active "Editing Record" badge, and switches actions to "Save Changes" and "Cancel Edit" without creating duplicates.
- **Delete Records**: Accessible confirmation dialog modal preventing accidental deletion.
- **Reset All Records**: Secure purge of only `task5_expense_tracker_v1` from LocalStorage with a confirmation step.

### C. Monthly Summaries & Category Breakdown
- **Month Selector**: Filters ledger metrics by any chosen month (defaults to current month).
- **Monthly Metrics**: Current month income, expenses, and net balance.
- **Category Breakdown**: Expense-only aggregation with proportional CSS-based progress bars displaying percentage share and monetary amount.

### D. History, Search & Filtering
- **Reverse Chronological Sorting**: Transactions are ordered with the newest date first; identical dates fall back to the creation timestamp (`createdAt`).
- **Live Search**: Instant case-insensitive filtering matching transaction description or category.
- **Type Filter**: Filter by All, Income Only, or Expense Only.
- **Date Range Filters**: Filter by Start Date ("From") and End Date ("To").
- **Reset Filters**: One-click restoration of the unfiltered transaction ledger.
- **Dedicated Empty States**: Clear distinction between an empty ledger and zero matches from an active filter.

---

## 4. Accessibility and Security (XSS Prevention)
- **DOM Safety**: All user-provided strings (descriptions and categories) are inserted using `textContent` and `createElement`, preventing Cross-Site Scripting (XSS).
- **Keyboard Navigation**: Form inputs, radio controls, buttons, and modals are keyboard navigable with visible `:focus-visible` outlines.
- **ARIA Standards**: Live regions (`aria-live="polite"`), dialog roles (`role="dialog"`, `aria-modal="true"`), and progressbar attributes (`role="progressbar"`).
- **Responsive Design**: Fluid two-column desktop grid collapsing cleanly into single-column mobile viewports with zero horizontal overflow.

---

## 5. Verification & Testing

An automated test suite is included in `test_suite.js`.

### Running the Test Suite:
```bash
node test_suite.js
```

### Verified Test Cases:
1. Application loads cleanly without JavaScript errors.
2. Initial dashboard correctly shows zeroed metrics on an empty ledger.
3. Income transactions successfully recorded and credited.
4. Expense transactions successfully recorded and debited.
5. Invalid amounts (<= 0, NaN, non-finite) and whitespace-only descriptions are rejected.
6. Financial arithmetic verified with integer paise precision.
7. Currency amounts formatted to Indian Rupees (`₹12,500.00`).
8. Reverse chronological sorting verified with secondary timestamp tiebreaker.
9. Editing a record mutates original entry and recalculates dashboard.
10. Deleting a record triggers confirmation and updates all totals.
11. LocalStorage persistence validated across reloads.
12. Malformed storage payload handled gracefully without crash.
13. Monthly summary isolates transactions strictly within the target month.
14. Category breakdown aggregates expenses only.
15. Search, type, and date-range filters function properly.
16. Filter reset restores full history.
17. Clear All requires confirmation and clears only the application key.
18. Empty ledger and empty filter search states display correctly.
19. Storage error handling verified.
20. Responsive layout tested across viewport sizes.
21. Form labels and keyboard accessibility verified.
22. Strict workspace isolation maintained (zero files modified outside Task 5).
