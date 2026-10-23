const assert = require('node:assert');

// 1. Currency Formatter Verification
const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

console.log('Testing Currency Formatter:');
const formatted = currencyFormatter.format(12500.00);
console.log('Formatted ₹12,500.00 ->', formatted);
assert.match(formatted, /12,500\.00/, 'Currency format should match en-IN formatting for ₹12,500.00');

// 2. Financial Calculations with Integer Paise
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

// Test initial empty state
const emptyTotals = calculateAllTotals([]);
assert.strictEqual(emptyTotals.incomeAmount, 0);
assert.strictEqual(emptyTotals.expenseAmount, 0);
assert.strictEqual(emptyTotals.balanceAmount, 0);
assert.strictEqual(emptyTotals.totalCount, 0);
console.log('✔ Empty ledger calculations verified');

// Test valid transactions with floating-point edge cases (e.g. 0.1 + 0.2)
const sampleTx = [
  { id: '1', type: 'income', amountPaise: Math.round(50000.50 * 100), description: 'Salary', category: 'Salary', date: '2026-10-01' },
  { id: '2', type: 'expense', amountPaise: Math.round(1500.20 * 100), description: 'Groceries', category: 'Food', date: '2026-10-05' },
  { id: '3', type: 'expense', amountPaise: Math.round(2500.30 * 100), description: 'Electricity', category: 'Bills', date: '2026-10-12' },
  { id: '4', type: 'income', amountPaise: Math.round(7500.00 * 100), description: 'Consulting', category: 'Freelance', date: '2026-10-15' },
  { id: '5', type: 'expense', amountPaise: Math.round(500.00 * 100), description: 'Metro pass', category: 'Transport', date: '2026-09-28' }
];

const totals = calculateAllTotals(sampleTx);
assert.strictEqual(totals.incomeAmount, 57500.50);
assert.strictEqual(totals.expenseAmount, 4500.50);
assert.strictEqual(totals.balanceAmount, 53000.00);
assert.strictEqual(totals.incomeCount, 2);
assert.strictEqual(totals.expenseCount, 3);
assert.strictEqual(totals.totalCount, 5);
console.log('✔ Financial calculations & integer paise precision verified');

// 3. Validation Rules
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

assert.strictEqual(isValidTransactionRecord(null), false);
assert.strictEqual(isValidTransactionRecord({}), false);
assert.strictEqual(isValidTransactionRecord({ id: '1', type: 'income', amountPaise: -100, description: 'test', category: 'Salary', date: '2026-10-01' }), false);
assert.strictEqual(isValidTransactionRecord({ id: '1', type: 'income', amountPaise: 0, description: 'test', category: 'Salary', date: '2026-10-01' }), false);
assert.strictEqual(isValidTransactionRecord({ id: '1', type: 'income', amountPaise: 100, description: '   ', category: 'Salary', date: '2026-10-01' }), false);
assert.strictEqual(isValidTransactionRecord({ id: '1', type: 'other', amountPaise: 100, description: 'valid', category: 'Salary', date: '2026-10-01' }), false);
assert.strictEqual(isValidTransactionRecord({ id: '1', type: 'income', amountPaise: 100, description: 'valid', category: 'Salary', date: 'invalid-date' }), false);
assert.strictEqual(isValidTransactionRecord(sampleTx[0]), true);
console.log('✔ Validation rules rejection and acceptance verified');

// 4. Sorting logic (newest date first, then newest createdAt)
const unsorted = [
  { id: 'a', date: '2026-10-01', createdAt: 100 },
  { id: 'b', date: '2026-10-15', createdAt: 105 },
  { id: 'c', date: '2026-10-15', createdAt: 200 },
  { id: 'd', date: '2026-09-30', createdAt: 90 }
];

unsorted.sort((a, b) => {
  const comp = b.date.localeCompare(a.date);
  if (comp !== 0) return comp;
  return (b.createdAt || 0) - (a.createdAt || 0);
});

assert.strictEqual(unsorted[0].id, 'c', 'Highest date and higher createdAt should be first');
assert.strictEqual(unsorted[1].id, 'b');
assert.strictEqual(unsorted[2].id, 'a');
assert.strictEqual(unsorted[3].id, 'd');
console.log('✔ Sorting (reverse chronological) verified');

// 5. Monthly Summary Isolation & Expenses-only Category breakdown
const CATEGORIES = {
  expense: ['Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Education', 'Entertainment', 'Housing', 'Other Expense']
};

function calculateMonthlySummary(txList, yearMonth) {
  const monthTx = txList.filter(t => t.date.startsWith(yearMonth));
  const totals = calculateAllTotals(monthTx);

  const categoryTotals = {};
  for (const cat of CATEGORIES.expense) {
    categoryTotals[cat] = 0;
  }

  for (const t of monthTx) {
    if (t.type === 'expense') {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amountPaise;
    }
  }

  return { totals, categoryTotals };
}

const octSummary = calculateMonthlySummary(sampleTx, '2026-10');
// In Oct:
// Income: 50000.50 + 7500.00 = 57500.50
// Expense: 1500.20 (Food) + 2500.30 (Bills) = 4000.50. (The 500 Transport was in 2026-09)
assert.strictEqual(octSummary.totals.incomeAmount, 57500.50);
assert.strictEqual(octSummary.totals.expenseAmount, 4000.50);
assert.strictEqual(octSummary.totals.balanceAmount, 53500.00);
assert.strictEqual(octSummary.categoryTotals['Food'], 150020);
assert.strictEqual(octSummary.categoryTotals['Bills'], 250030);
assert.strictEqual(octSummary.categoryTotals['Transport'], 0, 'Transport from September should NOT be in October summary');
assert.strictEqual(octSummary.categoryTotals['Salary'], undefined, 'Salary is income and must not be in expense categories');
console.log('✔ Monthly summary isolation & category breakdown verified');

// 6. Safe JSON parse / Malformed storage recovery
function safeParseStorage(raw) {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidTransactionRecord);
  } catch {
    return [];
  }
}

assert.deepStrictEqual(safeParseStorage('invalid-json{{{'), []);
assert.deepStrictEqual(safeParseStorage('{"not":"an array"}'), []);
assert.deepStrictEqual(safeParseStorage(JSON.stringify([
  sampleTx[0],
  { bad: 'record', amount: 'abc' }
])), [sampleTx[0]], 'Should keep valid records and discard malformed ones');
console.log('✔ Safe storage parsing & resilience verified');

console.log('\nALL 6 CRITICAL LOGIC TEST SUITES PASSED PERFECTLY!\n');
