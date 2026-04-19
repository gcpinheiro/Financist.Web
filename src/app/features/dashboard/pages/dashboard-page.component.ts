import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { CategoriesService } from '../../categories/categories.service';
import { GoalsService } from '../../goals/goals.service';
import { TransactionsService } from '../../transactions/transactions.service';
import { DashboardService } from '../dashboard.service';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { TableCardComponent } from '../../../shared/components/table-card/table-card.component';
import { DataTableColumn } from '../../../shared/models/ui.models';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    StatCardComponent,
    TableCardComponent,
    DataTableComponent,
    LoadingStateComponent,
    EmptyStateComponent
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent {
  private readonly dashboardService = inject(DashboardService);
  private readonly transactionsService = inject(TransactionsService);
  private readonly goalsService = inject(GoalsService);
  private readonly categoriesService = inject(CategoriesService);

  protected readonly summary = this.dashboardService.summary;
  protected readonly transactions = this.transactionsService.transactions;
  protected readonly goals = this.goalsService.goals;
  protected readonly loading = computed(
    () =>
      this.dashboardService.loading() ||
      this.transactionsService.loading() ||
      this.goalsService.loading() ||
      this.categoriesService.loading()
  );

  protected readonly recentTransactions = computed(() => this.transactions().slice(0, 5));
  protected readonly goalSnapshot = computed(() => this.goals().slice(0, 5));

  protected readonly recentTransactionsColumns: DataTableColumn[] = [
    { key: 'description', label: 'Description' },
    { key: 'type', label: 'Type', type: 'badge' },
    { key: 'categoryId', label: 'Category', cell: (row) => this.categoryName(row.categoryId) },
    { key: 'occurredOn', label: 'Date', type: 'date' },
    {
      key: 'amount',
      label: 'Amount',
      type: 'currency',
      align: 'end',
      currencyCode: (row) => row.currency
    }
  ];

  protected readonly goalColumns: DataTableColumn[] = [
    { key: 'name', label: 'Goal' },
    {
      key: 'currentAmount',
      label: 'Current',
      type: 'currency',
      align: 'end',
      currencyCode: (row) => row.currency
    },
    {
      key: 'targetAmount',
      label: 'Target',
      type: 'currency',
      align: 'end',
      currencyCode: (row) => row.currency
    },
    { key: 'progressPercentage', label: 'Progress', type: 'percentage', align: 'end' }
  ];

  constructor() {
    this.dashboardService.load();
    this.transactionsService.load();
    this.goalsService.load();
    this.categoriesService.load();
  }

  private categoryName(categoryId: string | null): string {
    if (!categoryId) {
      return 'Uncategorized';
    }

    return this.categoriesService.categories().find((category) => category.id === categoryId)?.name ?? 'Unknown';
  }
}
