import { inject, Injectable, signal } from '@angular/core';
import { delay, finalize, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../core/api/api.service';
import { MOCK_DOCUMENT_IMPORTS } from '../../shared/data/mock-finance.data';
import { DocumentImport } from '../../shared/models/document-import.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {
  private readonly api = inject(ApiService);
  private readonly documentsState = signal<DocumentImport[]>([]);
  private readonly initialized = signal(false);

  readonly imports = this.documentsState.asReadonly();
  readonly loading = signal(false);

  load(force = false): void {
    if (this.loading() || (this.initialized() && !force)) {
      return;
    }

    this.loading.set(true);

    const request$ = environment.useMockData
      ? of(MOCK_DOCUMENT_IMPORTS).pipe(delay(220))
      : this.api.get<DocumentImport[]>('/documents/imports');

    request$.pipe(finalize(() => this.loading.set(false))).subscribe({
      next: (documents) => {
        this.documentsState.set(documents);
        this.initialized.set(true);
      },
      error: () => {
        this.documentsState.set([]);
      }
    });
  }

  upload(files: File[]): Observable<DocumentImport[]> {
    if (environment.useMockData) {
      const imports = files.map((file, index) => ({
        id: `doc-${Date.now()}-${index}`,
        fileName: file.name,
        source: 'Manual upload',
        importedAt: new Date().toISOString(),
        records: Math.max(12, Math.round(file.size / 400)),
        status: 'Queued'
      })) satisfies DocumentImport[];

      return of(imports).pipe(
        delay(420),
        tap((created) => {
          this.documentsState.set([...created, ...this.documentsState()]);
          this.initialized.set(true);
        })
      );
    }

    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    return this.api.post<DocumentImport[], FormData>('/documents/imports', formData).pipe(
      tap((created) => {
        this.documentsState.set([...created, ...this.documentsState()]);
        this.initialized.set(true);
      })
    );
  }
}
