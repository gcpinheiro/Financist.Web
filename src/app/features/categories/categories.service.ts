import { inject, Injectable, signal } from '@angular/core';
import { delay, finalize, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../core/api/api.service';
import { MOCK_CATEGORIES } from '../../shared/data/mock-finance.data';
import { Category } from '../../shared/models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private readonly api = inject(ApiService);
  private readonly categoriesState = signal<Category[]>([]);
  private readonly initialized = signal(false);

  readonly categories = this.categoriesState.asReadonly();
  readonly loading = signal(false);

  load(force = false): void {
    if (this.loading() || (this.initialized() && !force)) {
      return;
    }

    this.loading.set(true);

    const request$ = environment.useMockData
      ? of(MOCK_CATEGORIES).pipe(delay(220))
      : this.api.get<Category[]>('/categories');

    request$.pipe(finalize(() => this.loading.set(false))).subscribe({
      next: (categories) => {
        this.categoriesState.set(categories);
        this.initialized.set(true);
      },
      error: () => {
        this.categoriesState.set([]);
      }
    });
  }

  create(payload: Omit<Category, 'id'>): Observable<Category> {
    if (environment.useMockData) {
      const category: Category = {
        id: `cat-${Date.now()}`,
        ...payload
      };

      return of(category).pipe(
        delay(280),
        tap((created) => {
          this.categoriesState.set([created, ...this.categoriesState()]);
          this.initialized.set(true);
        })
      );
    }

    return this.api
      .post<Category, Omit<Category, 'id'>>('/categories', payload)
      .pipe(
        tap((created) => {
          this.categoriesState.set([created, ...this.categoriesState()]);
          this.initialized.set(true);
        })
      );
  }
}
