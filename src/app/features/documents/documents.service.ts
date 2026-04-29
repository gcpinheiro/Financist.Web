import { inject, Injectable, signal } from '@angular/core';
import { delay, finalize, forkJoin, Observable, of, tap } from 'rxjs';
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
      : this.api.get<DocumentImport[]>('/documents');

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
        storedFileName: `mock-${Date.now()}-${index}-${file.name}`,
        originalFileName: file.name,
        contentType: file.type || 'application/octet-stream',
        sizeBytes: file.size,
        status: 'Pending',
        uploadedAtUtc: new Date().toISOString()
      })) satisfies DocumentImport[];

      return of(imports).pipe(
        delay(420),
        tap((created) => {
          this.documentsState.set([...created, ...this.documentsState()]);
          this.initialized.set(true);
        })
      );
    }

    return forkJoin(
      files.map((file) => {
        const formData = new FormData();
        formData.append('File', file);
        return this.api.post<DocumentImport, FormData>('/documents/upload', formData);
      })
    ).pipe(
      tap((created) => {
        this.documentsState.set([...created, ...this.documentsState()]);
        this.initialized.set(true);
      })
    );
  }
}
