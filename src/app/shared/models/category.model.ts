import { TransactionType } from './transaction.model';

export interface Category {
  id: string;
  name: string | null;
  type: TransactionType;
  isSystem: boolean;
}

export type CreateCategoryRequest = Omit<Category, 'id' | 'isSystem'>;
