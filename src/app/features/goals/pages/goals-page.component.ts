import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GoalsService } from '../goals.service';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { PrimaryButtonComponent } from '../../../shared/components/primary-button/primary-button.component';
import { TableCardComponent } from '../../../shared/components/table-card/table-card.component';
import { DataTableColumn } from '../../../shared/models/ui.models';

@Component({
  selector: 'app-goals-page',
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
  templateUrl: './goals-page.component.html',
  styleUrl: './goals-page.component.scss'
})
export class GoalsPageComponent {
  private readonly goalsService = inject(GoalsService);

  protected readonly goals = this.goalsService.goals;
  protected readonly loading = this.goalsService.loading;

  protected readonly columns: DataTableColumn[] = [
    { key: 'name', label: 'Meta' },
    { key: 'description', label: 'Descrição' },
    {
      key: 'currentAmount',
      label: 'Atual',
      type: 'currency',
      align: 'end',
      currencyCode: (row) => row.currency
    },
    {
      key: 'targetAmount',
      label: 'Objetivo',
      type: 'currency',
      align: 'end',
      currencyCode: (row) => row.currency
    },
    { key: 'progressPercentage', label: 'Progresso', type: 'percentage', align: 'end' }
  ];

  constructor() {
    this.goalsService.load();
  }
}
