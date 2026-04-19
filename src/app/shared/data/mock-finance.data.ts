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
    currency: 'USD',
    type: 'Expense',
    occurredOn: '2026-04-16',
    categoryId: 'cat-001',
    cardId: 'card-001',
    notes: 'Recurring software renewal'
  },
  {
    id: 'tr-002',
    description: 'Quarterly consulting invoice',
    amount: 12800,
    currency: 'USD',
    type: 'Income',
    occurredOn: '2026-04-14',
    categoryId: 'cat-004',
    cardId: null,
    notes: 'Client payment'
  },
  {
    id: 'tr-003',
    description: 'Office rent - Sao Paulo hub',
    amount: 6400,
    currency: 'USD',
    type: 'Expense',
    occurredOn: '2026-04-12',
    categoryId: 'cat-003',
    cardId: null,
    notes: null
  },
  {
    id: 'tr-004',
    description: 'Partner reimbursement',
    amount: 1750,
    currency: 'USD',
    type: 'Income',
    occurredOn: '2026-04-19',
    categoryId: null,
    cardId: null,
    notes: 'Awaiting settlement'
  }
];

export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-001', name: 'Software', type: 'Expense', isSystem: false },
  { id: 'cat-002', name: 'Marketing', type: 'Expense', isSystem: false },
  { id: 'cat-003', name: 'Facilities', type: 'Expense', isSystem: true },
  { id: 'cat-004', name: 'Consulting', type: 'Income', isSystem: false }
];

export const MOCK_CARDS: Card[] = [
  {
    id: 'card-001',
    name: 'Financist Black',
    last4Digits: '4821',
    limitAmount: 35000,
    currency: 'USD',
    closingDay: 22,
    dueDay: 5
  },
  {
    id: 'card-002',
    name: 'Operations Blue',
    last4Digits: '1934',
    limitAmount: 18000,
    currency: 'USD',
    closingDay: 18,
    dueDay: 1
  }
];

export const MOCK_GOALS: Goal[] = [
  {
    id: 'goal-001',
    name: 'Emergency reserve',
    description: 'Protect 6 months of operating costs.',
    targetAmount: 60000,
    currentAmount: 42600,
    currency: 'USD',
    progressPercentage: 71
  },
  {
    id: 'goal-002',
    name: 'New analytics workspace',
    description: 'Fund the next reporting and analytics stack.',
    targetAmount: 42000,
    currentAmount: 18800,
    currency: 'USD',
    progressPercentage: 45
  }
];

export const MOCK_DOCUMENT_IMPORTS: DocumentImport[] = [
  {
    id: 'doc-001',
    storedFileName: '9a12d7d5-nubank-march.csv',
    originalFileName: 'nubank-march.csv',
    contentType: 'text/csv',
    sizeBytes: 50872,
    status: 'Completed',
    uploadedAtUtc: '2026-04-18T16:30:00Z'
  },
  {
    id: 'doc-002',
    storedFileName: '72fa1132-itau-payments.pdf',
    originalFileName: 'itau-payments.pdf',
    contentType: 'application/pdf',
    sizeBytes: 184320,
    status: 'Processing',
    uploadedAtUtc: '2026-04-19T12:10:00Z'
  }
];

export const MOCK_DASHBOARD_SUMMARY: DashboardSummary = {
  totalIncome: 36450,
  totalExpenses: 18220,
  balance: 148320,
  transactionCount: MOCK_TRANSACTIONS.length,
  goalCount: MOCK_GOALS.length,
  averageGoalProgress: 58
};
