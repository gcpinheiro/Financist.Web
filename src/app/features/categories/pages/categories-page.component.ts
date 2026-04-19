import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoriesService } from '../categories.service';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { PrimaryButtonComponent } from '../../../shared/components/primary-button/primary-button.component';
import { TableCardComponent } from '../../../shared/components/table-card/table-card.component';
import { DataTableColumn } from '../../../shared/models/ui.models';

@Component({
  selector: 'app-categories-page',
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
  templateUrl: './categories-page.component.html',
  styleUrl: './categories-page.component.scss'
})
export class CategoriesPageComponent {
  private readonly categoriesService = inject(CategoriesService);

  protected readonly categories = this.categoriesService.categories;
  protected readonly loading = this.categoriesService.loading;

  protected readonly columns: DataTableColumn[] = [
    { key: 'name', label: 'Category' },
    { key: 'type', label: 'Flow type' },
    { key: 'budget', label: 'Budget', type: 'currency', align: 'end' },
    { key: 'icon', label: 'Icon' }
  ];

  constructor() {
    this.categoriesService.load();
  }
}
