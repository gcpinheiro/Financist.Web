import { inject, Injectable, signal } from '@angular/core';
import { delay, finalize, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../core/api/api.service';
import { MOCK_CARDS } from '../../shared/data/mock-finance.data';
import { Card } from '../../shared/models/card.model';

@Injectable({
  providedIn: 'root'
})
export class CardsService {
  private readonly api = inject(ApiService);
  private readonly cardsState = signal<Card[]>([]);
  private readonly initialized = signal(false);

  readonly cards = this.cardsState.asReadonly();
  readonly loading = signal(false);

  load(force = false): void {
    if (this.loading() || (this.initialized() && !force)) {
      return;
    }

    this.loading.set(true);

    const request$ = environment.useMockData
      ? of(MOCK_CARDS).pipe(delay(220))
      : this.api.get<Card[]>('/cards');

    request$.pipe(finalize(() => this.loading.set(false))).subscribe({
      next: (cards) => {
        this.cardsState.set(cards);
        this.initialized.set(true);
      },
      error: () => {
        this.cardsState.set([]);
      }
    });
  }

  create(payload: Omit<Card, 'id'>): Observable<Card> {
    if (environment.useMockData) {
      const card: Card = {
        id: `card-${Date.now()}`,
        ...payload
      };

      return of(card).pipe(
        delay(300),
        tap((created) => {
          this.cardsState.set([created, ...this.cardsState()]);
          this.initialized.set(true);
        })
      );
    }

    return this.api.post<Card, Omit<Card, 'id'>>('/cards', payload).pipe(
      tap((created) => {
        this.cardsState.set([created, ...this.cardsState()]);
        this.initialized.set(true);
      })
    );
  }
}
