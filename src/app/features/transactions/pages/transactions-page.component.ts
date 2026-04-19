import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TransactionsService } from '../transactions.service';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { PrimaryButtonComponent } from '../../../shared/components/primary-button/primary-button.component';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { TableCardComponent } from '../../../shared/components/table-card/table-card.component';
import { DataTableColumn } from '../../../shared/models/ui.models';

@Component({
  selector: 'app-transactions-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    PageHeaderComponent,
    PrimaryButtonComponent,
    StatCardComponent,
    TableCardComponent,
    DataTableComponent,
    LoadingStateComponent,
    EmptyStateComponent
  ],
  templateUrl: './transactions-page.component.html',
  styleUrl: './transactions-page.component.scss'
})
export class TransactionsPageComponent {
  private readonly transactionsService = inject(TransactionsService);

  protected readonly transactions = this.transactionsService.transactions;
  protected readonly loading = this.transactionsService.loading;

  protected readonly columns: DataTableColumn[] = [
    { key: 'description', label: 'Description' },
    { key: 'category', label: 'Category' },
    { key: 'account', label: 'Account' },
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'amount', label: 'Amount', type: 'currency', align: 'end' },
    { key: 'status', label: 'Status', type: 'badge', align: 'end' }
  ];

  protected readonly incomeTotal = computed(() =>
    this.transactions()
      .filter((transaction) => transaction.type === 'income')
      .reduce((sum, transaction) => sum + transaction.amount, 0)
  );

  protected readonly expenseTotal = computed(() =>
    this.transactions()
      .filter((transaction) => transaction.type === 'expense')
      .reduce((sum, transaction) => sum + transaction.amount, 0)
  );

  constructor() {
    this.transactionsService.load();
  }
}
