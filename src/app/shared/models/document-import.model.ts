export interface DocumentImport {
  id: string;
  fileName: string;
  source: string;
  importedAt: string;
  records: number;
  status: 'Queued' | 'Processing' | 'Completed' | 'Failed';
}
