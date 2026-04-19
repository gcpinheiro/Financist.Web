export interface DataTableColumn {
  key: string;
  label: string;
  type?: 'text' | 'currency' | 'date' | 'badge' | 'percentage';
  align?: 'start' | 'end';
  cell?: (row: any) => string | number | null | undefined;
}

export interface FormFieldOption {
  label: string;
  value: string;
}

export interface NavigationItem {
  label: string;
  route: string;
  icon: string;
  badge?: string;
}
