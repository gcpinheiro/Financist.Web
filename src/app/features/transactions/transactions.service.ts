import { inject, Injectable, signal } from '@angular/core';
import { delay, finalize, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../core/api/api.service';
import { MOCK_TRANSACTIONS } from '../../shared/data/mock-finance.data';
import { Transaction } from '../../shared/models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private readonly api = inject(ApiService);
  private readonly transactionsState = signal<Transaction[]>([]);
  private readonly initialized = signal(false);

  readonly transactions = this.transactionsState.asReadonly();
  readonly loading = signal(false);

  load(force = false): void {
    if (this.loading() || (this.initialized() && !force)) {
      return;
    }

    this.loading.set(true);

    const request$ = environment.useMockData
      ? of(MOCK_TRANSACTIONS).pipe(delay(260))
      : this.api.get<Transaction[]>('/transactions');

    request$.pipe(finalize(() => this.loading.set(false))).subscribe({
      next: (transactions) => {
        this.transactionsState.set(transactions);
        this.initialized.set(true);
      },
      error: () => {
        this.transactionsState.set([]);
      }
    });
  }

  create(payload: Omit<Transaction, 'id'>): Observable<Transaction> {
    if (environment.useMockData) {
      const transaction: Transaction = {
        id: `tr-${Date.now()}`,
        ...payload
      };

      return of(transaction).pipe(
        delay(320),
        tap((created) => {
          this.transactionsState.set([created, ...this.transactionsState()]);
          this.initialized.set(true);
        })
      );
    }

    return this.api
      .post<Transaction, Omit<Transaction, 'id'>>('/transactions', payload)
      .pipe(
        tap((created) => {
          this.transactionsState.set([created, ...this.transactionsState()]);
          this.initialized.set(true);
        })
      );
  }
}
