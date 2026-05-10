import { inject, Injectable, signal } from '@angular/core';
import { delay, finalize, forkJoin, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../core/api/api.service';
import { MOCK_DOCUMENT_IMPORTS } from '../../shared/data/mock-finance.data';
import {
  DocumentImport,
  DocumentTransactionCandidate,
  ImportDocumentTransactionCandidateRequest
} from '../../shared/models/document-import.model';

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

  loadTransactionCandidates(documentImportId: string): Observable<DocumentTransactionCandidate[]> {
    if (environment.useMockData) {
      return of(this.mockCandidates(documentImportId)).pipe(delay(260));
    }

    return this.api.get<DocumentTransactionCandidate[]>(
      `/documents/${documentImportId}/transaction-candidates`
    );
  }

  importTransactionCandidate(
    documentImportId: string,
    candidateId: string,
    payload: ImportDocumentTransactionCandidateRequest
  ): Observable<DocumentTransactionCandidate> {
    if (environment.useMockData) {
      const candidate = this.mockCandidates(documentImportId).find((item) => item.id === candidateId)!;
      const importedCandidate = {
        ...candidate,
        ...payload,
        status: 'Imported' as const,
        transactionId: `tx-${Date.now()}`
      } satisfies DocumentTransactionCandidate;

      return of(importedCandidate).pipe(delay(240));
    }

    return this.api.post<DocumentTransactionCandidate, object>(
      `/documents/${documentImportId}/transaction-candidates/${candidateId}/import`,
      payload
    );
  }

  rejectTransactionCandidate(
    documentImportId: string,
    candidateId: string
  ): Observable<DocumentTransactionCandidate> {
    if (environment.useMockData) {
      const rejectedCandidate = {
        ...this.mockCandidates(documentImportId).find((candidate) => candidate.id === candidateId)!,
        status: 'Rejected' as const
      } satisfies DocumentTransactionCandidate;

      return of(rejectedCandidate).pipe(delay(220));
    }

    return this.api.post<DocumentTransactionCandidate, object>(
      `/documents/${documentImportId}/transaction-candidates/${candidateId}/reject`,
      {}
    );
  }

  private mockCandidates(documentImportId: string): DocumentTransactionCandidate[] {
    return [
      {
        id: `${documentImportId}-candidate-1`,
        documentImportId,
        description: 'Mercado Central',
        amount: 184.9,
        currency: 'BRL',
        type: 'Expense',
        occurredOn: '2026-04-10',
        rawText: '10/04 Mercado Central R$ 184,90',
        confidence: 0.78,
        installmentNumber: null,
        installmentCount: null,
        installmentGroupKey: null,
        importFingerprint: 'mock-single',
        status: 'PendingReview',
        transactionId: null
      },
      {
        id: `${documentImportId}-candidate-2`,
        documentImportId,
        description: 'Loja Exemplo 03/10',
        amount: 123.45,
        currency: 'BRL',
        type: 'Expense',
        occurredOn: '2026-04-12',
        rawText: '12/04 Loja Exemplo 03/10 R$ 123,45',
        confidence: 0.92,
        installmentNumber: 3,
        installmentCount: 10,
        installmentGroupKey: 'mock-installment-group',
        importFingerprint: 'mock-installment-3',
        status: 'PendingReview',
        transactionId: null
      }
    ];
  }
}
