import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardsService } from '../cards.service';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { PrimaryButtonComponent } from '../../../shared/components/primary-button/primary-button.component';
import { TableCardComponent } from '../../../shared/components/table-card/table-card.component';
import { DataTableColumn } from '../../../shared/models/ui.models';

@Component({
  selector: 'app-cards-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    PageHeaderComponent,
    PrimaryButtonComponent,
    TableCardComponent,
    DataTableComponent,
    LoadingStateComponent,
    EmptyStateComponent
  ],
  templateUrl: './cards-page.component.html',
  styleUrl: './cards-page.component.scss'
})
export class CardsPageComponent {
  private readonly cardsService = inject(CardsService);

  protected readonly cards = this.cardsService.cards;
  protected readonly loading = this.cardsService.loading;

  protected readonly columns: DataTableColumn[] = [
    { key: 'name', label: 'Cartao' },
    { key: 'last4Digits', label: 'Final', cell: (row) => `**** ${row.last4Digits ?? '----'}` },
    {
      key: 'limitAmount',
      label: 'Limite',
      type: 'currency',
      align: 'end',
      currencyCode: (row) => row.currency
    },
    { key: 'closingDay', label: 'Fechamento', align: 'end' },
    { key: 'dueDay', label: 'Vencimento', align: 'end' }
  ];

  constructor() {
    this.cardsService.load();
  }
}
