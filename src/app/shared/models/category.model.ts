export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  budget: number;
  icon: string;
}
