import { Transaction } from './transaction.model';

export interface ExpenseCategoryDatum {
  category: string;
  amount: number;
  color: string;
}

export interface MonthlyCashflowPoint {
  month: string;
  income: number;
  expenses: number;
}

export interface BalanceTrendPoint {
  month: string;
  balance: number;
}

export interface DashboardSummary {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  goalsProgress: number;
  expensesByCategory: ExpenseCategoryDatum[];
  cashflow: MonthlyCashflowPoint[];
  balanceTrend: BalanceTrendPoint[];
  recentTransactions: Transaction[];
}
