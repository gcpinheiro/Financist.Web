import { inject, Injectable, signal } from '@angular/core';
import { of, delay, finalize } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../core/api/api.service';
import { MOCK_DASHBOARD_SUMMARY } from '../../shared/data/mock-finance.data';
import { DashboardSummary } from '../../shared/models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly api = inject(ApiService);
  private readonly summaryState = signal<DashboardSummary | null>(null);
  private readonly initialized = signal(false);

  readonly summary = this.summaryState.asReadonly();
  readonly loading = signal(false);

  load(force = false): void {
    if (this.loading() || (this.initialized() && !force)) {
      return;
    }

    this.loading.set(true);

    const request$ = environment.useMockData
      ? of(MOCK_DASHBOARD_SUMMARY).pipe(delay(280))
      : this.api.get<DashboardSummary>('/dashboard/summary');

    request$.pipe(finalize(() => this.loading.set(false))).subscribe({
      next: (summary) => {
        this.summaryState.set(summary);
        this.initialized.set(true);
      },
      error: () => {
        this.summaryState.set(null);
      }
    });
  }
}
