export interface Card {
  id: string;
  name: string | null;
  last4Digits: string | null;
  limitAmount: number;
  currency: string | null;
  closingDay: number;
  dueDay: number;
}

export type CreateCardRequest = Omit<Card, 'id'>;
