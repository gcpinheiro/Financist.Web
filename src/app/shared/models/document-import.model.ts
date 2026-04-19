export type DocumentImportStatus = 'Pending' | 'Processing' | 'Completed' | 'Failed';

export interface DocumentImport {
  id: string;
  storedFileName: string | null;
  originalFileName: string | null;
  contentType: string | null;
  sizeBytes: number;
  status: DocumentImportStatus;
  uploadedAtUtc: string;
}
