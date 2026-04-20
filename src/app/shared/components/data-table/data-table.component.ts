import { CommonModule, DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { DataTableColumn } from '../../models/ui.models';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})
export class DataTableComponent {
  readonly columns = input.required<DataTableColumn[]>();
  readonly rows = input.required<any[]>();
  readonly trackByKey = input<string>('id');

  constructor(private readonly datePipe: DatePipe) {}

  protected cellValue(row: any, column: DataTableColumn): unknown {
    if (column.cell) {
      return column.cell(row);
    }

    return row?.[column.key];
  }

  protected formatValue(row: any, value: unknown, column: DataTableColumn): string {
    if (value === null || value === undefined || value === '') {
      return '-';
    }

    if (column.type === 'currency' && typeof value === 'number') {
      const requestedCurrency =
        typeof column.currencyCode === 'function' ? column.currencyCode(row) : column.currencyCode;
      const currency =
        requestedCurrency && requestedCurrency.trim() ? requestedCurrency.trim().toUpperCase() : 'USD';

      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0
      }).format(value);
    }

    if (column.type === 'date') {
      return (
        this.datePipe.transform(value as string | number | Date | null | undefined, 'dd/MM/yyyy') ??
        String(value)
      );
    }

    if (column.type === 'percentage' && typeof value === 'number') {
      return `${value}%`;
    }

    return String(value);
  }

  protected badgeClass(value: unknown): string {
    return `badge--${String(value).toLowerCase().replace(/\s+/g, '-')}`;
  }

  protected trackRow(index: number, row: any): unknown {
    return row?.[this.trackByKey()] ?? index;
  }
}
