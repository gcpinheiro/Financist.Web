export type DocumentImportStatus = 'Pending' | 'Processing' | 'Completed' | 'Failed';

export type DocumentTransactionCandidateStatus = 'PendingReview' | 'Imported' | 'Rejected';

export interface DocumentImport {
  id: string;
  storedFileName: string | null;
  originalFileName: string | null;
  contentType: string | null;
  sizeBytes: number;
  status: DocumentImportStatus;
  uploadedAtUtc: string;
}

export interface DocumentTransactionCandidate {
  id: string;
  documentImportId: string;
  description: string | null;
  amount: number;
  currency: string | null;
  type: 'Income' | 'Expense';
  occurredOn: string;
  rawText: string | null;
  confidence: number;
  installmentNumber: number | null;
  installmentCount: number | null;
  installmentGroupKey: string | null;
  importFingerprint: string | null;
  status: DocumentTransactionCandidateStatus;
  transactionId: string | null;
}

export interface ImportDocumentTransactionCandidateRequest {
  description: string;
  amount: number;
  currency: string;
  type: 'Income' | 'Expense';
  occurredOn: string;
}
