import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardsService } from '../../cards/cards.service';
import { CategoriesService } from '../../categories/categories.service';
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
  private readonly categoriesService = inject(CategoriesService);
  private readonly cardsService = inject(CardsService);

  protected readonly transactions = this.transactionsService.transactions;
  protected readonly loading = this.transactionsService.loading;

  protected readonly columns: DataTableColumn[] = [
    { key: 'description', label: 'Descricao' },
    { key: 'type', label: 'Tipo', type: 'badge', cell: (row) => this.flowLabel(row.type) },
    { key: 'categoryId', label: 'Categoria', cell: (row) => this.categoryName(row.categoryId) },
    { key: 'cardId', label: 'Cartao', cell: (row) => this.cardLabel(row.cardId) },
    { key: 'occurredOn', label: 'Data', type: 'date' },
    {
      key: 'amount',
      label: 'Valor',
      type: 'currency',
      align: 'end',
      currencyCode: (row) => row.currency
    }
  ];

  protected readonly incomeTotal = computed(() =>
    this.transactions()
      .filter((transaction) => transaction.type === 'Income')
      .reduce((sum, transaction) => sum + transaction.amount, 0)
  );

  protected readonly expenseTotal = computed(() =>
    this.transactions()
      .filter((transaction) => transaction.type === 'Expense')
      .reduce((sum, transaction) => sum + transaction.amount, 0)
  );

  constructor() {
    this.transactionsService.load();
    this.categoriesService.load();
    this.cardsService.load();
  }

  private categoryName(categoryId: string | null): string {
    if (!categoryId) {
      return 'Sem categoria';
    }

    return this.categoriesService.categories().find((category) => category.id === categoryId)?.name ?? 'Nao encontrada';
  }

  private cardLabel(cardId: string | null): string {
    if (!cardId) {
      return '-';
    }

    const card = this.cardsService.cards().find((item) => item.id === cardId);
    return card ? `${card.name ?? 'Cartao'} - ${card.last4Digits ?? '----'}` : 'Nao encontrado';
  }

  private flowLabel(type: string | null): string {
    if (type === 'Income') {
      return 'Receita';
    }

    if (type === 'Expense') {
      return 'Despesa';
    }

    return type ?? '-';
  }
}
