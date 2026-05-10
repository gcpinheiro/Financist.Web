import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { DocumentsService } from '../documents.service';
import { TransactionsService } from '../../transactions/transactions.service';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { PrimaryButtonComponent } from '../../../shared/components/primary-button/primary-button.component';
import { SecondaryButtonComponent } from '../../../shared/components/secondary-button/secondary-button.component';
import { SectionCardComponent } from '../../../shared/components/section-card/section-card.component';
import {
  DocumentImport,
  DocumentTransactionCandidate,
  ImportDocumentTransactionCandidateRequest
} from '../../../shared/models/document-import.model';
import { IconComponent } from '../../../shared/ui/icon/icon.component';

type CandidateDraft = ImportDocumentTransactionCandidateRequest;

@Component({
  selector: 'app-documents-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageHeaderComponent,
    PrimaryButtonComponent,
    SecondaryButtonComponent,
    SectionCardComponent,
    LoadingStateComponent,
    EmptyStateComponent,
    IconComponent
  ],
  templateUrl: './documents-page.component.html',
  styleUrl: './documents-page.component.scss'
})
export class DocumentsPageComponent {
  private readonly documentsService = inject(DocumentsService);
  private readonly transactionsService = inject(TransactionsService);

  protected readonly documents = this.documentsService.imports;
  protected readonly loading = this.documentsService.loading;
  protected readonly uploading = signal(false);
  protected readonly lastUploadMessage = signal('');
  protected readonly selectedDocumentId = signal<string | null>(null);
  protected readonly candidates = signal<DocumentTransactionCandidate[]>([]);
  protected readonly loadingCandidates = signal(false);
  protected readonly importingCandidateId = signal<string | null>(null);
  protected readonly rejectingCandidateId = signal<string | null>(null);
  protected readonly editingCandidateId = signal<string | null>(null);
  protected readonly draft = signal<CandidateDraft | null>(null);
  protected readonly candidateMessage = signal('');
  protected readonly candidateError = signal('');
  protected readonly selectedDocument = computed(() =>
    this.documents().find((document) => document.id === this.selectedDocumentId()) ?? null
  );
  protected readonly pendingCandidates = computed(
    () => this.candidates().filter((candidate) => candidate.status === 'PendingReview').length
  );
  protected readonly importedCandidates = computed(
    () => this.candidates().filter((candidate) => candidate.status === 'Imported').length
  );

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
        this.lastUploadMessage.set(`${imports.length} arquivo(s) enviado(s) com sucesso.`);
        input.value = '';

        if (imports[0]) {
          this.selectDocument(imports[0]);
        }
      },
      error: () => {
        this.uploading.set(false);
      }
    });
  }

  protected selectDocument(document: DocumentImport, force = false): void {
    if (!force && this.selectedDocumentId() === document.id && this.candidates().length) {
      return;
    }

    this.selectedDocumentId.set(document.id);
    this.candidates.set([]);
    this.candidateMessage.set('');
    this.candidateError.set('');
    this.loadingCandidates.set(true);

    this.documentsService
      .loadTransactionCandidates(document.id)
      .pipe(finalize(() => this.loadingCandidates.set(false)))
      .subscribe({
        next: (candidates) => {
          this.candidates.set(candidates);

          if (!candidates.length) {
            this.candidateMessage.set('Nenhum lancamento foi identificado neste documento.');
          }
        },
        error: () => {
          this.candidateError.set('Nao foi possivel carregar os lancamentos deste documento.');
        }
      });
  }

  protected importCandidate(candidate: DocumentTransactionCandidate): void {
    const documentId = this.selectedDocumentId();
    if (!documentId || candidate.status !== 'PendingReview' || this.importingCandidateId()) {
      return;
    }

    const payload = this.buildImportPayload(candidate);
    this.importingCandidateId.set(candidate.id);
    this.candidateMessage.set('');
    this.candidateError.set('');

    this.documentsService
      .importTransactionCandidate(documentId, candidate.id, payload)
      .pipe(finalize(() => this.importingCandidateId.set(null)))
      .subscribe({
        next: (updatedCandidate) => {
          this.candidates.update((candidates) =>
            candidates.map((item) => (item.id === updatedCandidate.id ? updatedCandidate : item))
          );
          this.cancelEdit();
          this.transactionsService.refresh();
          this.candidateMessage.set('Lancamento importado para transacoes.');
        },
        error: () => {
          this.candidateError.set('Nao foi possivel importar este lancamento.');
        }
      });
  }

  protected rejectCandidate(candidate: DocumentTransactionCandidate): void {
    const documentId = this.selectedDocumentId();
    if (!documentId || candidate.status !== 'PendingReview' || this.rejectingCandidateId()) {
      return;
    }

    this.rejectingCandidateId.set(candidate.id);
    this.candidateMessage.set('');
    this.candidateError.set('');

    this.documentsService
      .rejectTransactionCandidate(documentId, candidate.id)
      .pipe(finalize(() => this.rejectingCandidateId.set(null)))
      .subscribe({
        next: (updatedCandidate) => {
          this.candidates.update((candidates) =>
            candidates.map((item) => (item.id === updatedCandidate.id ? updatedCandidate : item))
          );
          this.cancelEdit();
          this.candidateMessage.set('Lancamento rejeitado.');
        },
        error: () => {
          this.candidateError.set('Nao foi possivel rejeitar este lancamento.');
        }
      });
  }

  protected startEdit(candidate: DocumentTransactionCandidate): void {
    if (candidate.status !== 'PendingReview') {
      return;
    }

    this.editingCandidateId.set(candidate.id);
    this.draft.set({
      description: candidate.description ?? '',
      amount: candidate.amount,
      currency: candidate.currency?.trim() || 'BRL',
      type: candidate.type,
      occurredOn: this.inputDate(candidate.occurredOn)
    });
  }

  protected cancelEdit(): void {
    this.editingCandidateId.set(null);
    this.draft.set(null);
  }

  protected updateDraft(patch: Partial<CandidateDraft>): void {
    const current = this.draft();
    if (!current) {
      return;
    }

    this.draft.set({ ...current, ...patch });
  }

  protected formatSize(sizeBytes: number): string {
    const numberFormatter = new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    });

    if (sizeBytes >= 1024 * 1024) {
      return `${numberFormatter.format(sizeBytes / (1024 * 1024))} MB`;
    }

    if (sizeBytes >= 1024) {
      return `${new Intl.NumberFormat('pt-BR').format(Math.round(sizeBytes / 1024))} KB`;
    }

    return `${new Intl.NumberFormat('pt-BR').format(sizeBytes)} B`;
  }

  protected statusLabel(status: string | null): string {
    if (status === 'Completed') {
      return 'Concluido';
    }

    if (status === 'Processing') {
      return 'Processando';
    }

    if (status === 'Failed') {
      return 'Falhou';
    }

    if (status === 'Pending') {
      return 'Pendente';
    }

    return status ?? '-';
  }

  protected candidateStatusLabel(status: string | null): string {
    if (status === 'PendingReview') {
      return 'Para revisar';
    }

    if (status === 'Imported') {
      return 'Importado';
    }

    if (status === 'Rejected') {
      return 'Rejeitado';
    }

    return status ?? '-';
  }

  protected formatCurrency(amount: number, currency: string | null): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency?.trim() || 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  protected formatDate(value: string): string {
    return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(new Date(value));
  }

  protected typeLabel(type: string): string {
    return type === 'Income' ? 'Entrada' : 'Saida';
  }

  protected installmentLabel(candidate: DocumentTransactionCandidate): string {
    if (!candidate.installmentNumber || !candidate.installmentCount) {
      return 'Unica';
    }

    return `${candidate.installmentNumber}/${candidate.installmentCount}`;
  }

  protected confidenceLabel(confidence: number): string {
    return `${Math.round(confidence * 100)}%`;
  }

  protected shortKey(value: string | null): string {
    return value ? value.slice(0, 8) : '-';
  }

  protected inputDate(value: string): string {
    return value.slice(0, 10);
  }

  private buildImportPayload(candidate: DocumentTransactionCandidate): ImportDocumentTransactionCandidateRequest {
    const draft = this.editingCandidateId() === candidate.id ? this.draft() : null;

    return {
      description: draft?.description?.trim() || candidate.description || '',
      amount: Number(draft?.amount ?? candidate.amount),
      currency: (draft?.currency || candidate.currency || 'BRL').trim().toUpperCase(),
      type: draft?.type ?? candidate.type,
      occurredOn: draft?.occurredOn || this.inputDate(candidate.occurredOn)
    };
  }
}
