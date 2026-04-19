export interface Card {
  id: string;
  name: string;
  brand: string;
  lastDigits: string;
  creditLimit: number;
  availableLimit: number;
  closingDay: number;
  dueDay: number;
  status: 'Active' | 'Locked';
}
