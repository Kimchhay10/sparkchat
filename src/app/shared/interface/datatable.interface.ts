export type ColumnType =
  | 'text'
  | 'number'
  | 'date'
  | 'boolean'
  | 'currency'
  | 'badge'
  | 'image'
  | 'custom';
export type SortDirection = 'asc' | 'desc' | null;
export type FilterType =
  | 'text'
  | 'number'
  | 'date'
  | 'select'
  | 'multiselect'
  | 'boolean';

export interface DataTableColumn<T = any> {
  key: string;
  label: string;
  type?: ColumnType;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: FilterType;
  filterOptions?: { label: string; value: any }[];
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  align?: 'left' | 'center' | 'right';
  sticky?: boolean;
  hidden?: boolean;
  formatter?: (value: any, row: T) => string;
  cellClass?: string | ((value: any, row: T) => string);
  headerClass?: string;
  render?: (value: any, row: T) => any;
  badgeColor?: (value: any, row: T) => string;
}

export interface DataTableConfig {
  columns: DataTableColumn[];
  data: any[];
  pageSizes?: number[];
  defaultPageSize?: number;
  showPagination?: boolean;
  showSearch?: boolean;
  showFilter?: boolean;
  showColumnToggle?: boolean;
  showExport?: boolean;
  striped?: boolean;
  bordered?: boolean;
  hoverable?: boolean;
  compact?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  selectable?: boolean;
  multiSelect?: boolean;
  stickyHeader?: boolean;
  maxHeight?: string;
  rowClass?: string | ((row: any) => string);
  expandable?: boolean;
  expandTemplate?: any;
}

export interface DataTableState {
  page: number;
  pageSize: number;
  sortColumn: string | null;
  sortDirection: SortDirection;
  searchTerm: string;
  filters: { [key: string]: any };
  selectedRows: any[];
}

export interface PaginationData {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  from: number;
  to: number;
}

export interface SortEvent {
  column: string;
  direction: SortDirection;
}

export interface FilterEvent {
  column: string;
  value: any;
}

export interface SelectionEvent {
  selected: any[];
  row?: any;
}
