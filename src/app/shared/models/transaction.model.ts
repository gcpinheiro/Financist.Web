export type TransactionType = 'Income' | 'Expense';

export interface Transaction {
  id: string;
  description: string | null;
  amount: number;
  currency: string | null;
  type: TransactionType;
  occurredOn: string;
  categoryId: string | null;
  cardId: string | null;
  notes: string | null;
}

export type CreateTransactionRequest = Omit<Transaction, 'id'>;
