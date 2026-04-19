export type TransactionType = 'income' | 'expense';
export type TransactionStatus = 'Completed' | 'Pending' | 'Scheduled';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  paymentMethod: string;
  account: string;
  type: TransactionType;
  status: TransactionStatus;
}
