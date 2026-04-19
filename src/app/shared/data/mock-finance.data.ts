import { Card } from '../models/card.model';
import { Category } from '../models/category.model';
import { DashboardSummary } from '../models/dashboard.model';
import { DocumentImport } from '../models/document-import.model';
import { Goal } from '../models/goal.model';
import { Transaction } from '../models/transaction.model';

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'tr-001',
    description: 'Enterprise subscription renewal',
    amount: 2890,
    date: '2026-04-16',
    category: 'Software',
    paymentMethod: 'Credit card',
    account: 'Operations',
    type: 'expense',
    status: 'Completed'
  },
  {
    id: 'tr-002',
    description: 'Quarterly consulting invoice',
    amount: 12800,
    date: '2026-04-14',
    category: 'Consulting',
    paymentMethod: 'Wire transfer',
    account: 'Main treasury',
    type: 'income',
    status: 'Completed'
  },
  {
    id: 'tr-003',
    description: 'Office rent - Sao Paulo hub',
    amount: 6400,
    date: '2026-04-12',
    category: 'Facilities',
    paymentMethod: 'Bank debit',
    account: 'Operations',
    type: 'expense',
    status: 'Completed'
  },
  {
    id: 'tr-004',
    description: 'Partner reimbursement',
    amount: 1750,
    date: '2026-04-19',
    category: 'Transfers',
    paymentMethod: 'Pix',
    account: 'Savings',
    type: 'income',
    status: 'Pending'
  }
];

export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-001', name: 'Software', type: 'expense', color: '#37d6c6', budget: 9000, icon: 'Grid' },
  { id: 'cat-002', name: 'Marketing', type: 'expense', color: '#6ea8fe', budget: 12000, icon: 'Broadcast' },
  { id: 'cat-003', name: 'Facilities', type: 'expense', color: '#f5b24d', budget: 8000, icon: 'Building' },
  { id: 'cat-004', name: 'Consulting', type: 'income', color: '#52d6a1', budget: 20000, icon: 'Briefcase' }
];

export const MOCK_CARDS: Card[] = [
  {
    id: 'card-001',
    name: 'Financist Black',
    brand: 'Visa',
    lastDigits: '4821',
    creditLimit: 35000,
    availableLimit: 18400,
    closingDay: 22,
    dueDay: 5,
    status: 'Active'
  },
  {
    id: 'card-002',
    name: 'Operations Blue',
    brand: 'Mastercard',
    lastDigits: '1934',
    creditLimit: 18000,
    availableLimit: 9100,
    closingDay: 18,
    dueDay: 1,
    status: 'Active'
  }
];

export const MOCK_GOALS: Goal[] = [
  {
    id: 'goal-001',
    name: 'Emergency reserve',
    category: 'Cash safety',
    targetAmount: 60000,
    currentAmount: 42600,
    deadline: '2026-08-30',
    color: '#37d6c6'
  },
  {
    id: 'goal-002',
    name: 'New analytics workspace',
    category: 'Infrastructure',
    targetAmount: 42000,
    currentAmount: 18800,
    deadline: '2026-10-15',
    color: '#6ea8fe'
  }
];

export const MOCK_DOCUMENT_IMPORTS: DocumentImport[] = [
  {
    id: 'doc-001',
    fileName: 'nubank-march.csv',
    source: 'Nubank',
    importedAt: '2026-04-18T16:30:00Z',
    records: 124,
    status: 'Completed'
  },
  {
    id: 'doc-002',
    fileName: 'itau-payments.pdf',
    source: 'Itau',
    importedAt: '2026-04-19T12:10:00Z',
    records: 36,
    status: 'Processing'
  }
];

export const MOCK_DASHBOARD_SUMMARY: DashboardSummary = {
  totalBalance: 148320,
  monthlyIncome: 36450,
  monthlyExpenses: 18220,
  goalsProgress: 71,
  expensesByCategory: [
    { category: 'Software', amount: 6400, color: '#37d6c6' },
    { category: 'Facilities', amount: 4200, color: '#6ea8fe' },
    { category: 'Marketing', amount: 3520, color: '#f5b24d' },
    { category: 'Team', amount: 4100, color: '#ff7a90' }
  ],
  cashflow: [
    { month: 'Nov', income: 28600, expenses: 15400 },
    { month: 'Dec', income: 29800, expenses: 16800 },
    { month: 'Jan', income: 32200, expenses: 17450 },
    { month: 'Feb', income: 34850, expenses: 18210 },
    { month: 'Mar', income: 33820, expenses: 17680 },
    { month: 'Apr', income: 36450, expenses: 18220 }
  ],
  balanceTrend: [
    { month: 'Nov', balance: 98600 },
    { month: 'Dec', balance: 108400 },
    { month: 'Jan', balance: 117900 },
    { month: 'Feb', balance: 126300 },
    { month: 'Mar', balance: 139100 },
    { month: 'Apr', balance: 148320 }
  ],
  recentTransactions: MOCK_TRANSACTIONS
};
