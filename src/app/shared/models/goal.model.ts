export interface Goal {
  id: string;
  name: string | null;
  description: string | null;
  targetAmount: number;
  currentAmount: number;
  currency: string | null;
  progressPercentage: number;
}

export interface CreateGoalRequest {
  name: string;
  description: string;
  targetAmount: number;
  currency: string;
  initialAmount: number;
}
