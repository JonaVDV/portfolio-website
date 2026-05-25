export type SortDirection = 'asc' | 'desc';

export interface ColumnDefinition<T extends Record<string, unknown>> {
	/** Key of `T` to read the cell value from. Omit for derived/action columns. */
	accessor?: keyof T;
	/** Display text used as the default header label. */
	header?: string;
	/**
	 * Explicit column id. Required when `accessor` is absent (e.g. action columns).
	 * Falls back to `String(accessor)` when omitted.
	 */
	id?: string;
	/**
	 * Whether this column can be hidden/shown by the user.
	 */
	enableHiding?: boolean;
	/**
	 * Whether this column can be sorted by the user. Sorting is disabled by default to avoid giving a false impression of built-in sorting when the table is used in manual mode (server-side processing).
	 */
	enableSorting?: boolean;
	/** Pure function that converts the raw cell value to a display string. */
	formatter?: (value: T[keyof T], row: T) => string;
	/** CSS class applied to the default `<td>` when no per-column cell snippet is provided. */
	cellClass?: string;
	/** CSS class applied to the default `<th>` when no per-column header snippet is provided. */
	headerClass?: string;
	/**
	 * Custom sort comparator for this column. Receives two full row objects.
	 * Return negative to sort `a` before `b`, positive for the reverse, 0 for equal.
	 * When omitted, the default comparator is used (lexicographic/numeric ordering by `accessor`).
	 */
	sortFn?: (a: T, b: T) => number;
	/**
	 * Per-column filter predicate. Called for each row when a value is stored in
	 * `table.columnFilters[columnId]`. Return `true` to keep the row.
	 * `filterValue` is whatever was assigned to `columnFilters[columnId]`.
	 */
	filterFn?: (value: T[keyof T] | undefined, row: T, filterValue: unknown) => boolean;
}

export interface HeaderContext<T extends Record<string, unknown>> {
	column: ColumnDefinition<T>;
	/** Current sort direction for this column, or `false` when unsorted. */
	sorted: SortDirection | false;
	toggleSort: () => void;
}

export interface CellContext<T extends Record<string, unknown>> {
	column: ColumnDefinition<T>;
	row: T;
	/** Raw value from `row[column.accessor]`. */
	value: T[keyof T] | undefined;
	/** Result of `column.formatter(value, row)`, or `String(value)` when no formatter is set. */
	formatted: string;
	table: DataTable<T>;
	index: number;
}

export interface DataTableOptions<TData extends Record<string, unknown>> {
	data: TData[];
	columns: ColumnDefinition<TData>[];
	/** Adds a built-in checkbox column for row selection. @default false */
	selectable?: boolean;
	/**
	 * Disables internal filtering, sorting, and pagination.
	 * In manual mode `rows` returns `data` as-is; the parent is responsible for
	 * providing already-processed data (e.g. from a server/API response).
	 * Set `manualRowCount` from the server to keep `pageCount`/`filteredRowCount` accurate.
	 * @default false
	 */
	manual?: boolean;
	pagination?: {
		pageSize?: number;
	};
	/**
	 * Returns a stable unique key for a row. Strongly recommended in manual mode
	 * so that row selection survives data replacements (pagination, re-fetches).
	 * Falls back to the row's index in `data` when omitted.
	 */
	getRowId?: (row: TData) => string | number;
}

export class DataTable<TData extends Record<string, unknown>> {
	// ── Public data ───────────────────────────────────────────────────────────
	// $state.raw — these large arrays are replaced wholesale (never mutated in
	// place), so there's no benefit to deep-proxying every row object. Avoiding
	// the proxy removes all the trap overhead from the filter/sort pipelines.
	data = $state.raw<TData[]>([]);
	columns = $state.raw<ColumnDefinition<TData>[]>([]);

	// ── Public reactive state ─────────────────────────────────────────────────

	/** Controls which columns are visible. Set a key to `false` to hide that column. */
	columnVisibility = $state<Record<string, boolean>>({});
	/** Map of rowKey → selected. Keys are stable row IDs (from `getRowId`) or data indices. */
	rowSelection = $state<Record<string, boolean>>({});
	/** Bound to the filter input. Filters across all string-serialisable cell values. */
	globalFilter = $state('');
	/**
	 * Per-column filter values. Set `table.columnFilters[columnId] = value` to filter a column.
	 * Clear individual keys or call `resetFilters()` to remove all column filters.
	 */
	columnFilters = $state<Record<string, unknown>>({});
	/**
	 * Total row count as reported by the server. Only meaningful in manual mode.
	 * Update from the server response to keep `pageCount` and `filteredRowCount` accurate.
	 */
	manualRowCount = $state<number | null>(null);

	// ── Private state ─────────────────────────────────────────────────────────

	#currentPage = $state(1);
	// Default of 10 ensures the $derived below never sees an uninitialised value.
	#pageSize = $state(10);
	#sorting = $state<{ id: string; direction: SortDirection } | null>(null);
	#manual: boolean = false;
	#getRowId?: (row: TData) => string | number;
	// Holds the debounced copy of globalFilter actually used by the pipeline.
	// The input binds to globalFilter for immediate feedback; the expensive
	// filter derived only recomputes 150 ms after the last keystroke.
	#debouncedFilter = $state('');

	// ── Derived ───────────────────────────────────────────────────────────────

	#filteredRows = $derived.by(() => {
		let rows = this.data;

		// Apply per-column filters.
		for (const [colId, filterValue] of Object.entries(this.columnFilters)) {
			if (filterValue === undefined || filterValue === null || filterValue === '') continue;
			const col = this.columns.find((c) => (c.id ?? String(c.accessor ?? '')) === colId);
			if (!col?.filterFn) continue;
			const { accessor, filterFn } = col;
			rows = rows.filter((row) => {
				const value = accessor != null ? row[accessor] : undefined;
				return filterFn(value, row, filterValue);
			});
		}

		// Use the debounced value so the pipeline only runs 150 ms after typing stops.
		const q = this.#debouncedFilter.trim().toLowerCase();
		if (q) {
			rows = rows.filter((row) =>
				Object.values(row).some((v) => String(v).toLowerCase().includes(q))
			);
		}

		return rows;
	});

	#sortedRows = $derived.by(() => {
		if (!this.#sorting) return this.#filteredRows;
		const { id, direction } = this.#sorting;
		const col = this.columns.find((c) => (c.id ?? String(c.accessor ?? '')) === id);
		if (!col) return this.#filteredRows;
		return [...this.#filteredRows].sort((a, b) => {
			const cmp = col.sortFn
				? col.sortFn(a, b)
				: (() => {
						if (!col.accessor) return 0;
						const av = a[col.accessor];
						const bv = b[col.accessor];
						if (av == null) return 1;
						if (bv == null) return -1;
						return av < bv ? -1 : av > bv ? 1 : 0;
					})();
			return direction === 'asc' ? cmp : -cmp;
		});
	});

	#totalPages = $derived.by(() => {
		const count =
			this.#manual && this.manualRowCount !== null
				? this.manualRowCount
				: this.#filteredRows.length;
		return Math.ceil(count / this.#pageSize) || 1;
	});

	/** The rows for the current page. In manual mode returns `data` as-is (already processed by the server). */
	rows = $derived.by(() => {
		if (this.#manual) return this.data;
		const start = (this.#currentPage - 1) * this.#pageSize;
		return this.#sortedRows.slice(start, start + this.#pageSize);
	});

	/** Columns that pass the current `columnVisibility` filter. */
	visibleColumns = $derived(
		this.columns.filter((col) => {
			const key = col.id ?? String(col.accessor ?? '');
			return this.columnVisibility[key] !== false;
		})
	);

	/** Columns where `enableHiding` is not explicitly `false`. */
	get hidableColumns() {
		return this.columns.filter((col) => col.enableHiding !== false);
	}

	getColumn(accessorOrId: string | number): ColumnDefinition<TData> | undefined {
		return this.columns.find((col) => col.id === accessorOrId || col.accessor === accessorOrId);
	}

	/**
	 * Whether there is a previous page. In manual mode, also check that the current page is greater than 1 so the parent can react (e.g. by fetching new data from the server).
	 */
	get hasPrevPage() {
		return this.#currentPage > 1;
	}

	get pageCount() {
		return this.#totalPages;
	}

	get currentPage() {
		return this.#currentPage;
	}
	/** Whether there is a next page. In manual mode, also check that the current page is less than the total pages so the parent can react (e.g. by fetching new data from the server). */
	get hasNextPage() {
		return this.#currentPage < this.#totalPages;
	}
	/**
	 * The current page size. In manual mode, also update this value so the parent can react (e.g. by fetching new data from the server with the new page size).
	 */
	get pageSize() {
		return this.#pageSize;
	}
	/**
	 * returns the total number of rows derived from `data`
	 */
	get rowCount() {
		return this.data.length;
	}
	/**
	 * returns the number of rows after filtering (before pagination). In manual mode, returns `manualRowCount` if set, otherwise falls back to `data.length` since the server is responsible for filtering.
	 */
	get filteredRowCount() {
		if (this.#manual && this.manualRowCount !== null) return this.manualRowCount;
		return this.#filteredRows.length;
	}
	/**
	 * the number of rows after filtering and sorting, but before pagination. In manual mode, returns `manualRowCount` if set, otherwise falls back to `data.length` since the server is responsible for filtering/sorting.
	 */
	get selectedRows(): TData[] {
		return this.data.filter((r) => this.rowSelection[this.getRowKey(r)] === true);
	}

	get selectedCount(): number {
		return this.selectedRows.length;
	}

	get allSelected() {
		return (
			this.data.length > 0 && this.data.every((r) => this.rowSelection[this.getRowKey(r)] === true)
		);
	}

	get someSelected() {
		return this.data.some((r) => this.rowSelection[this.getRowKey(r)] === true);
	}

	/** Current sort state, or `null` when unsorted. In manual mode, read this to tell the server what to sort by. */
	get sorting() {
		return this.#sorting;
	}

	constructor(options: DataTableOptions<TData>) {
		this.data = options.data;
		this.#getRowId = options.getRowId;
		// If selectable, prepend the built-in checkbox column. The component
		// renders it internally — consumers never handle '__select__' in snippets.
		const selectCol: ColumnDefinition<TData> = { id: '__select__', enableHiding: false };
		this.columns = options.selectable ? [selectCol, ...options.columns] : options.columns;
		this.#pageSize = options.pagination?.pageSize ?? 10;
		this.#manual = options.manual ?? false;
		// Pre-populate columnVisibility so bind:checked always gets a boolean
		// (undefined causes a Svelte runtime error when binding to a prop with a fallback).
		for (const col of this.hidableColumns) {
			const key = col.id ?? String(col.accessor ?? '');
			this.columnVisibility[key] = true;
		}
		// Debounce globalFilter → #debouncedFilter (150 ms).
		$effect(() => {
			const value = this.globalFilter;
			const timer = setTimeout(() => {
				this.#debouncedFilter = value;
			}, 150);
			return () => clearTimeout(timer);
		});

		// Reset to page 1 whenever filters change so users don't end up on a
		// non-existent page after narrowing the result set.
		let filtersInitialized = false;
		$effect(() => {
			void this.#debouncedFilter;
			// Iterate values to track deep mutations without a JSON.stringify allocation.
			for (const v of Object.values(this.columnFilters)) void v;
			if (!filtersInitialized) {
				filtersInitialized = true;
				return;
			}
			this.#currentPage = 1;
		});
	}

	/**
	 * Go to the previous page if it exists. In manual mode, also update the current page so the parent can react (e.g. by fetching new data from the server).
	 */
	prevPage() {
		if (this.hasPrevPage) this.#currentPage -= 1;
	}
	/** Go to the next page if it exists. In manual mode, also update the current page so the parent can react (e.g. by fetching new data from the server). */
	nextPage() {
		if (this.hasNextPage) this.#currentPage += 1;
	}

	/**
	 * Cycles the sort for `columnId`: unsorted → asc → desc → unsorted.
	 * Only has an effect when the column has `enableSorting: true`.
	 * @param columnId The ID of the column to toggle sorting for.
	 */
	toggleSort(columnId: string) {
		if (this.#sorting?.id === columnId) {
			this.#sorting =
				this.#sorting.direction === 'asc' ? { id: columnId, direction: 'desc' } : null;
		} else {
			this.#sorting = { id: columnId, direction: 'asc' };
		}
	}

	/** Returns the current sort direction for `columnId`, or `false` if unsorted. */
	getSortDirection(columnId: string): SortDirection | false {
		return this.#sorting?.id === columnId ? this.#sorting.direction : false;
	}
	/**
	 * Toggle selection of a row by its stable key (from `getRowId`). In manual mode, relies on stable row keys to track selection across data replacements; ensure `getRowId` is set and returns consistent keys for this to work.
	 * @param rowKey The stable key of the row to toggle selection for, derived from `getRowId` or falling back to the row's index in `data`.
	 */
	toggleRowSelection(rowKey: string) {
		if (this.rowSelection[rowKey]) {
			delete this.rowSelection[rowKey];
		} else {
			this.rowSelection[rowKey] = true;
		}
	}
	/**
	 * Clear all selected rows. In manual mode, also update the selection state so the parent can react (e.g. by fetching new data from the server).
	 */
	resetSelection() {
		this.rowSelection = {};
	}
	/**
	 * Clear sorting (set to unsorted). In manual mode, also update the sort state so the parent can react (e.g. by fetching new data from the server).
	 */
	resetSorting() {
		this.#sorting = null;
	}

	/** Clear both the global filter and all column filters, and reset to page 1. */
	resetFilters() {
		this.globalFilter = '';
		this.columnFilters = {};
		this.#currentPage = 1;
	}

	/** Jump to a specific page number (clamped to the valid range). */
	goToPage(page: number) {
		this.#currentPage = Math.max(1, Math.min(Math.round(page), this.#totalPages));
	}

	/** Programmatically set the active sort column and direction. */
	setSort(columnId: string, direction: SortDirection) {
		this.#sorting = { id: columnId, direction };
	}
	/**
	 * Toggle selection of all rows. Selects all when not all are selected, otherwise clears selection. In manual mode, relies on stable row keys (from `getRowId`) to track selection across data replacements; ensure `getRowId` is set and returns consistent keys for this to work.
	 */
	toggleAllRows() {
		if (this.allSelected) {
			this.rowSelection = {};
		} else {
			const next: Record<string, boolean> = {};
			this.data.forEach((row) => (next[this.getRowKey(row)] = true));
			this.rowSelection = next;
		}
	}
	/**
	 *
	 * @param size the new page size.
	 */
	setPageSize(size: number) {
		this.#pageSize = Math.max(1, Math.round(size));
	}

	/**
	 * Returns a stable unique key for a row, used for tracking selection state across data updates.
	 * @param row A row from `data`. In manual mode, this should be a row from the current page (i.e. `rows`) to ensure the key is correct for selection to work.
	 * @returns A stable unique key for the row, derived from `getRowId` if provided or falling back to the row's index in `data`. Used for tracking selection state across data updates.
	 */
	getRowKey(row: TData): string {
		if (this.#getRowId) return String(this.#getRowId(row));
		const idx = this.data.indexOf(row);
		return String(idx);
	}
}
