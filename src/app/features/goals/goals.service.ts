import { inject, Injectable, signal } from '@angular/core';
import { delay, finalize, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../core/api/api.service';
import { MOCK_GOALS } from '../../shared/data/mock-finance.data';
import { CreateGoalRequest, Goal } from '../../shared/models/goal.model';

@Injectable({
  providedIn: 'root'
})
export class GoalsService {
  private readonly api = inject(ApiService);
  private readonly goalsState = signal<Goal[]>([]);
  private readonly initialized = signal(false);

  readonly goals = this.goalsState.asReadonly();
  readonly loading = signal(false);

  load(force = false): void {
    if (this.loading() || (this.initialized() && !force)) {
      return;
    }

    this.loading.set(true);

    const request$ = environment.useMockData
      ? of(MOCK_GOALS).pipe(delay(220))
      : this.api.get<Goal[]>('/goals');

    request$.pipe(finalize(() => this.loading.set(false))).subscribe({
      next: (goals) => {
        this.goalsState.set(goals);
        this.initialized.set(true);
      },
      error: () => {
        this.goalsState.set([]);
      }
    });
  }

  create(payload: CreateGoalRequest): Observable<Goal> {
    if (environment.useMockData) {
      const goal: Goal = {
        id: `goal-${Date.now()}`,
        name: payload.name,
        description: payload.description,
        targetAmount: payload.targetAmount,
        currentAmount: payload.initialAmount,
        currency: payload.currency,
        progressPercentage:
          payload.targetAmount > 0 ? Math.round((payload.initialAmount / payload.targetAmount) * 100) : 0
      };

      return of(goal).pipe(
        delay(300),
        tap((created) => {
          this.goalsState.set([created, ...this.goalsState()]);
          this.initialized.set(true);
        })
      );
    }

    return this.api.post<Goal, CreateGoalRequest>('/goals', payload).pipe(
      tap((created) => {
        this.goalsState.set([created, ...this.goalsState()]);
        this.initialized.set(true);
      })
    );
  }
}
