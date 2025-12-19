import {
  Component,
  input,
  output,
  signal,
  computed,
  effect,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DataTableColumn,
  DataTableConfig,
  DataTableState,
  PaginationData,
  SortDirection,
  SortEvent,
  FilterEvent,
  SelectionEvent,
} from '../../interface/datatable.interface';

@Component({
  selector: 'app-datatable',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './datatable.component.html',
  styleUrl: './datatable.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatatableComponent implements OnInit {
  // Inputs
  config = input.required<DataTableConfig>();
  serverSide = input<boolean>(false);
  totalRecords = input<number>(0);

  // Outputs
  sort = output<SortEvent>();
  filter = output<FilterEvent>();
  pageChange = output<number>();
  pageSizeChange = output<number>();
  search = output<string>();
  rowClick = output<any>();
  rowSelect = output<SelectionEvent>();
  export = output<string>(); // 'csv' | 'excel' | 'pdf'

  // State
  state = signal<DataTableState>({
    page: 1,
    pageSize: 10,
    sortColumn: null,
    sortDirection: null,
    searchTerm: '',
    filters: {},
    selectedRows: [],
  });

  visibleColumns = signal<string[]>([]);
  expandedRows = signal<Set<number>>(new Set());

  // Computed
  filteredData = computed(() => {
    if (this.serverSide()) {
      return this.config().data;
    }

    let data = [...this.config().data];
    const state = this.state();

    // Search
    if (state.searchTerm) {
      const term = state.searchTerm.toLowerCase();
      data = data.filter((row) =>
        this.config().columns.some((col) => {
          const value = this.getCellValue(row, col.key);
          return String(value).toLowerCase().includes(term);
        })
      );
    }

    // Filters
    Object.keys(state.filters).forEach((key) => {
      const filterValue = state.filters[key];
      if (
        filterValue !== null &&
        filterValue !== undefined &&
        filterValue !== ''
      ) {
        data = data.filter((row) => {
          const value = this.getCellValue(row, key);
          return String(value) === String(filterValue);
        });
      }
    });

    // Sort
    if (state.sortColumn && state.sortDirection) {
      data.sort((a, b) => {
        const aVal = this.getCellValue(a, state.sortColumn!);
        const bVal = this.getCellValue(b, state.sortColumn!);

        if (aVal === bVal) return 0;

        const comparison = aVal > bVal ? 1 : -1;
        return state.sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return data;
  });

  paginatedData = computed(() => {
    if (this.serverSide()) {
      return this.config().data;
    }

    const state = this.state();
    const start = (state.page - 1) * state.pageSize;
    const end = start + state.pageSize;
    return this.filteredData().slice(start, end);
  });

  pagination = computed((): PaginationData => {
    const state = this.state();
    const total = this.serverSide()
      ? this.totalRecords()
      : this.filteredData().length;
    const totalPages = Math.ceil(total / state.pageSize);
    const from = (state.page - 1) * state.pageSize + 1;
    const to = Math.min(state.page * state.pageSize, total);

    return {
      total,
      page: state.page,
      pageSize: state.pageSize,
      totalPages,
      from,
      to,
    };
  });

  allSelected = computed(() => {
    const data = this.paginatedData();
    const selected = this.state().selectedRows;
    return (
      data.length > 0 &&
      data.every((row) => selected.some((s) => this.isSameRow(s, row)))
    );
  });

  someSelected = computed(() => {
    const data = this.paginatedData();
    const selected = this.state().selectedRows;
    return selected.length > 0 && !this.allSelected();
  });

  constructor() {
    effect(() => {
      // Initialize visible columns
      const cols = this.config()
        .columns.filter((col) => !col.hidden)
        .map((col) => col.key);
      this.visibleColumns.set(cols);
    });
  }

  ngOnInit(): void {
    this.initializeState();
  }

  private initializeState(): void {
    const pageSizes = this.config().pageSizes || [10, 25, 50, 100];
    const defaultPageSize = this.config().defaultPageSize || pageSizes[0];

    this.state.update((s) => ({
      ...s,
      pageSize: defaultPageSize,
    }));
  }

  onSort(column: DataTableColumn): void {
    if (!column.sortable) return;

    this.state.update((state) => {
      let direction: SortDirection = 'asc';

      if (state.sortColumn === column.key) {
        if (state.sortDirection === 'asc') {
          direction = 'desc';
        } else if (state.sortDirection === 'desc') {
          direction = null;
        }
      }

      return {
        ...state,
        sortColumn: direction ? column.key : null,
        sortDirection: direction,
      };
    });

    const state = this.state();
    this.sort.emit({
      column: column.key,
      direction: state.sortDirection,
    });
  }

  onSearch(term: string): void {
    this.state.update((s) => ({
      ...s,
      searchTerm: term,
      page: 1,
    }));
    this.search.emit(term);
  }

  onFilter(column: string, value: any): void {
    this.state.update((s) => ({
      ...s,
      filters: { ...s.filters, [column]: value },
      page: 1,
    }));
    this.filter.emit({ column, value });
  }

  onPageChange(page: number): void {
    this.state.update((s) => ({ ...s, page }));
    this.pageChange.emit(page);
  }

  onPageSizeChange(pageSize: number): void {
    this.state.update((s) => ({
      ...s,
      pageSize,
      page: 1,
    }));
    this.pageSizeChange.emit(pageSize);
  }

  onRowClick(row: any): void {
    if (!this.config().selectable) {
      this.rowClick.emit(row);
    }
  }

  onRowSelect(row: any, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    this.state.update((state) => {
      const selected = [...state.selectedRows];
      const index = selected.findIndex((s) => this.isSameRow(s, row));

      if (index > -1) {
        selected.splice(index, 1);
      } else {
        if (!this.config().multiSelect) {
          selected.length = 0;
        }
        selected.push(row);
      }

      return { ...state, selectedRows: selected };
    });

    this.rowSelect.emit({
      selected: this.state().selectedRows,
      row,
    });
  }

  onSelectAll(): void {
    const data = this.paginatedData();

    this.state.update((state) => {
      let selected = [...state.selectedRows];

      if (this.allSelected()) {
        // Deselect all visible rows
        selected = selected.filter(
          (s) => !data.some((row) => this.isSameRow(s, row))
        );
      } else {
        // Select all visible rows
        data.forEach((row) => {
          if (!selected.some((s) => this.isSameRow(s, row))) {
            selected.push(row);
          }
        });
      }

      return { ...state, selectedRows: selected };
    });

    this.rowSelect.emit({
      selected: this.state().selectedRows,
    });
  }

  toggleColumn(columnKey: string): void {
    this.visibleColumns.update((cols) => {
      if (cols.includes(columnKey)) {
        return cols.filter((k) => k !== columnKey);
      } else {
        return [...cols, columnKey];
      }
    });
  }

  toggleRowExpansion(index: number): void {
    this.expandedRows.update((rows) => {
      const newRows = new Set(rows);
      if (newRows.has(index)) {
        newRows.delete(index);
      } else {
        newRows.add(index);
      }
      return newRows;
    });
  }

  isRowExpanded(index: number): boolean {
    return this.expandedRows().has(index);
  }

  isRowSelected(row: any): boolean {
    return this.state().selectedRows.some((s) => this.isSameRow(s, row));
  }

  isColumnVisible(columnKey: string): boolean {
    return this.visibleColumns().includes(columnKey);
  }

  getCellValue(row: any, key: string): any {
    return key.split('.').reduce((obj, k) => obj?.[k], row);
  }

  formatCellValue(value: any, column: DataTableColumn, row: any): string {
    if (column.formatter) {
      return column.formatter(value, row);
    }

    if (value === null || value === undefined) {
      return '-';
    }

    switch (column.type) {
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(value);
      case 'number':
        return new Intl.NumberFormat('en-US').format(value);
      case 'boolean':
        return value ? 'Yes' : 'No';
      default:
        return String(value);
    }
  }

  getCellClass(column: DataTableColumn, value: any, row: any): string {
    if (typeof column.cellClass === 'function') {
      return column.cellClass(value, row);
    }
    return column.cellClass || '';
  }

  getRowClass(row: any): string {
    const config = this.config();
    if (typeof config.rowClass === 'function') {
      return config.rowClass(row);
    }
    return config.rowClass || '';
  }

  getBadgeColor(column: DataTableColumn, value: any, row: any): string {
    if (column.badgeColor) {
      return column.badgeColor(value, row);
    }
    return 'bg-gray-100 text-gray-800';
  }

  onExport(format: string): void {
    this.export.emit(format);
  }

  private isSameRow(row1: any, row2: any): boolean {
    return JSON.stringify(row1) === JSON.stringify(row2);
  }

  getPageNumbers(): number[] {
    const totalPages = this.pagination().totalPages;
    const currentPage = this.state().page;
    const delta = 2;
    const range: number[] = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift(-1);
    }
    if (currentPage + delta < totalPages - 1) {
      range.push(-1);
    }

    range.unshift(1);
    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range.filter((v, i, a) => a.indexOf(v) === i);
  }
}
