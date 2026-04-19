import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { DocumentsService } from '../documents.service';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { PrimaryButtonComponent } from '../../../shared/components/primary-button/primary-button.component';
import { SectionCardComponent } from '../../../shared/components/section-card/section-card.component';
import { TableCardComponent } from '../../../shared/components/table-card/table-card.component';
import { DataTableColumn } from '../../../shared/models/ui.models';

@Component({
  selector: 'app-documents-page',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    PrimaryButtonComponent,
    SectionCardComponent,
    TableCardComponent,
    DataTableComponent,
    LoadingStateComponent,
    EmptyStateComponent
  ],
  templateUrl: './documents-page.component.html',
  styleUrl: './documents-page.component.scss'
})
export class DocumentsPageComponent {
  private readonly documentsService = inject(DocumentsService);

  protected readonly documents = this.documentsService.imports;
  protected readonly loading = this.documentsService.loading;
  protected readonly uploading = signal(false);
  protected readonly lastUploadMessage = signal('');

  protected readonly columns: DataTableColumn[] = [
    { key: 'originalFileName', label: 'File' },
    { key: 'contentType', label: 'Content type' },
    { key: 'uploadedAtUtc', label: 'Uploaded at', type: 'date' },
    { key: 'sizeBytes', label: 'Size', align: 'end', cell: (row) => this.formatSize(row.sizeBytes) },
    { key: 'status', label: 'Status', type: 'badge', align: 'end' }
  ];

  constructor() {
    this.documentsService.load();
  }

  protected onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);

    if (!files.length || this.uploading()) {
      return;
    }

    this.uploading.set(true);
    this.documentsService.upload(files).subscribe({
      next: (imports) => {
        this.uploading.set(false);
        this.lastUploadMessage.set(`${imports.length} file(s) uploaded successfully.`);
        input.value = '';
      },
      error: () => {
        this.uploading.set(false);
      }
    });
  }

  private formatSize(sizeBytes: number): string {
    if (sizeBytes >= 1024 * 1024) {
      return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    if (sizeBytes >= 1024) {
      return `${Math.round(sizeBytes / 1024)} KB`;
    }

    return `${sizeBytes} B`;
  }
}
