export type SortDirection = 'asc' | 'desc';

/** Stable id for a column: explicit `id`, else stringified `accessor`, else `''`. */
export function columnId<T extends Record<string, unknown>>(col: ColumnDefinition<T>): string {
	return col.id ?? String(col.accessor ?? '');
}

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
	pagination?: {
		/**
		 * Page size. Provide a plain number for a static/default size, or a
		 * getter to make it *controlled* (server/URL-driven). When provided,
		 * `setPageSize` emits via `onPageSizeChange` instead of mutating internal
		 * state — same semantics as a controlled `<input value>`.
		 */
		pageSize?: number;
		/**
		 * Controlled current page (1-based). Provide as a getter to drive the page
		 * from the server response or the URL. When set, `goToPage`/`nextPage`/
		 * `prevPage` emit via `onPageChange` instead of mutating internal state.
		 */
		page?: number;
		/**
		 * Total row count. **Providing this switches the table to server mode**:
		 * it renders `data` as-is (no internal filter/sort/paginate) and trusts you
		 * to have processed it upstream — page count is derived from this number.
		 * Provide as a getter reading the server response. Omit for client mode,
		 * where the table paginates the full `data` array itself.
		 */
		total?: number;
		/** Called with the requested page when the user navigates. Wire to `goto` in controlled mode. */
		onPageChange?: (page: number) => void;
		/** Called with the requested size when the page size changes. Wire to `goto` in controlled mode. */
		onPageSizeChange?: (size: number) => void;
	};
	/**
	 * Controlled sort state. Provide a getter (reading the URL/server) to make
	 * sorting server-driven; `toggleSort`/`resetSorting` then emit via
	 * `onSortingChange` instead of mutating internal state. Provide `null` for
	 * "controlled, currently unsorted". Omit entirely for internal state.
	 */
	sorting?: { id: string; direction: SortDirection } | null;
	/** Called with the next sort state when the user sorts. Wire to `goto` in controlled mode. */
	onSortingChange?: (sorting: { id: string; direction: SortDirection } | null) => void;
	/** Controlled global filter. Provide a getter to drive from the URL; `globalFilter =` emits via `onGlobalFilterChange`. */
	globalFilter?: string;
	/** Called with the next filter value. Wire to `goto` in controlled mode. */
	onGlobalFilterChange?: (value: string) => void;
	/**
	 * Returns a stable unique key for a row. Strongly recommended in manual mode
	 * so that row selection survives data replacements (pagination, re-fetches).
	 * Falls back to the row's index in `data` when omitted.
	 */
	getRowId?: (row: TData) => string | number;
}

export class DataTable<TData extends Record<string, unknown>> {
	#options: DataTableOptions<TData>;

	data = $derived.by(() => this.#options.data);
	columns = $derived.by((): ColumnDefinition<TData>[] => {
		const cols = this.#options.columns;
		// selectable prepends the built-in checkbox column. Consumers never
		// handle '__select__' in snippets — the component renders it internally.
		return this.#options.selectable
			? [{ id: '__select__', enableHiding: false } as ColumnDefinition<TData>, ...cols]
			: cols;
	});

	// ── Public reactive state ─────────────────────────────────────────────────

	/** Controls which columns are visible. Set a key to `false` to hide that column. */
	columnVisibility = $state<Record<string, boolean>>({});
	/** Map of rowKey → selected. Keys are stable row IDs (from `getRowId`) or data indices. */
	rowSelection = $state<Record<string, boolean>>({});
	/**
	 * Filter across all string-serialisable cell values. Controlled by the
	 * `globalFilter` option when provided (emits via `onGlobalFilterChange`),
	 * otherwise internal state. `bind:value={table.globalFilter}` works either way.
	 */
	get globalFilter() {
		return this.#options.globalFilter ?? this.#globalFilter;
	}
	set globalFilter(value: string) {
		this.#options.onGlobalFilterChange?.(value);
		if (this.#options.globalFilter === undefined) this.#globalFilter = value;
	}
	/**
	 * Per-column filter values. Set `table.columnFilters[columnId] = value` to filter a column.
	 * Clear individual keys or call `resetFilters()` to remove all column filters.
	 */
	columnFilters = $state<Record<string, unknown>>({});

	// ── Private state ─────────────────────────────────────────────────────────

	// Uncontrolled fallbacks — used only when the matching `pagination` option
	// getter is absent. When the option is provided, that value wins (controlled).
	#currentPage = $state(1);
	// Default of 10 ensures the $derived below never sees an uninitialised value.
	#pageSize = $state(10);
	#sorting = $state<{ id: string; direction: SortDirection } | null>(null);
	#globalFilter = $state('');

	// row → index map, rebuilt once whenever `data` changes. Makes getRowKey /
	// getRowIndex O(1) instead of an O(n) indexOf per row (which was O(n²) per page).
	#rowIndex = $derived.by(() => {
		const m = new Map<TData, number>();
		this.data.forEach((row, i) => m.set(row, i));
		return m;
	});

	get #serverMode() {
		return this.#options.pagination !== undefined && 'total' in this.#options.pagination;
	}
	get #getRowId() {
		return this.#options.getRowId;
	}

	// ── Derived ───────────────────────────────────────────────────────────────

	#filteredRows = $derived.by(() => {
		let rows = this.data;

		// Apply per-column filters.
		for (const [colId, filterValue] of Object.entries(this.columnFilters)) {
			if (filterValue === undefined || filterValue === null || filterValue === '') continue;
			const col = this.columns.find((c) => columnId(c) === colId);
			if (!col?.filterFn) continue;
			const { accessor, filterFn } = col;
			rows = rows.filter((row) => {
				const value = accessor != null ? row[accessor] : undefined;
				return filterFn(value, row, filterValue);
			});
		}

		// Filter directly off globalFilter — $derived is lazy, so this only runs
		// when something actually reads the rows. Debounce belongs at the I/O
		// boundary (the query trigger), not baked into state; a consumer who
		// wants it debounces the input in one line.
		const q = this.globalFilter.trim().toLowerCase();
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
		const col = this.columns.find((c) => columnId(c) === id);
		if (!col) return this.#filteredRows;
		return this.#filteredRows.toSorted((a, b) => {
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
		const count = this.#serverMode
			? (this.#options.pagination?.total ?? 0)
			: this.#filteredRows.length;
		return Math.ceil(count / this.pageSize) || 1;
	});

	/** The rows for the current page. In server mode returns `data` as-is (already processed upstream). */
	rows = $derived.by(() => {
		if (this.#serverMode) return this.data;
		const start = (this.currentPage - 1) * this.pageSize;
		return this.#sortedRows.slice(start, start + this.pageSize);
	});

	/** Columns that pass the current `columnVisibility` filter. */
	visibleColumns = $derived(
		this.columns.filter((col) => this.columnVisibility[columnId(col)] !== false)
	);

	/** Columns where `enableHiding` is not explicitly `false`. */
	get hidableColumns() {
		return this.columns.filter((col) => col.enableHiding !== false);
	}

	/**
	 * Whether there is a previous page. In manual mode, also check that the current page is greater than 1 so the parent can react (e.g. by fetching new data from the server).
	 */
	get hasPrevPage() {
		return this.currentPage > 1;
	}

	get pageCount() {
		return this.#totalPages;
	}

	/**
	 * The requested page (1-based), unclamped. Controlled by `pagination.page`
	 * when provided, otherwise internal state. Read by `queryState` — kept free
	 * of any query-result dependency so a server-driven `data` getter can't form
	 * a computation cycle (queryState → page → total → result → queryState).
	 */
	get #requestedPage() {
		return this.#options.pagination?.page ?? this.#currentPage;
	}
	/**
	 * Current page (1-based). Like `#requestedPage` but clamped to the valid
	 * range, so a stale high page (e.g. after filtering narrows the set) never
	 * yields an empty slice — this replaces the old reset-to-page-1 $effect.
	 */
	get currentPage() {
		return Math.min(Math.max(1, this.#requestedPage), this.#totalPages);
	}
	/** Whether there is a next page. In manual mode, also check that the current page is less than the total pages so the parent can react (e.g. by fetching new data from the server). */
	get hasNextPage() {
		return this.currentPage < this.#totalPages;
	}
	/**
	 * The current page size. In manual mode, also update this value so the parent can react (e.g. by fetching new data from the server with the new page size).
	 */
	get pageSize() {
		return this.#options.pagination?.pageSize ?? this.#pageSize;
	}
	/**
	 * returns the total number of rows derived from `data`
	 */
	get rowCount() {
		return this.data.length;
	}
	/**
	 * Number of rows after filtering, before pagination. In server mode returns
	 * the provided `total`; in client mode the internally-filtered row count.
	 */
	get filteredRowCount() {
		if (this.#serverMode) return this.#options.pagination?.total ?? this.data.length;
		return this.#filteredRows.length;
	}
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

	/** Current sort state, or `null` when unsorted. Controlled by the `sorting` option when provided. */
	get sorting() {
		return this.#options.sorting !== undefined ? this.#options.sorting : this.#sorting;
	}
	#setSorting(next: { id: string; direction: SortDirection } | null) {
		this.#options.onSortingChange?.(next);
		if (this.#options.sorting === undefined) this.#sorting = next;
	}

	/**
	 * A single serialisable snapshot of everything the server needs to reproduce
	 * the current view: page, size, sort, and filters. Reactive — read it inside
	 * a `$derived`/`goto` or hand it straight to a remote `query()`. Replaces the
	 * old URL-abstraction helpers: the consumer decides how to transport it.
	 */
	get queryState() {
		return {
			page: this.#requestedPage,
			pageSize: this.pageSize,
			sort: this.sorting,
			globalFilter: this.globalFilter || undefined,
			columnFilters: { ...this.columnFilters }
		};
	}

	constructor(options: DataTableOptions<TData>) {
		this.#options = options;
		this.#pageSize = options.pagination?.pageSize ?? 10;
		// Pre-populate columnVisibility so bind:checked always gets a boolean
		// (undefined causes a Svelte runtime error when binding to a prop with a fallback).
		// Runs once; columns arriving later default to visible via `visibleColumns`.
		for (const col of this.hidableColumns) {
			this.columnVisibility[columnId(col)] = true;
		}
	}

	/**
	 * Go to the previous page if it exists. In manual mode, also update the current page so the parent can react (e.g. by fetching new data from the server).
	 */
	prevPage() {
		if (this.hasPrevPage) this.goToPage(this.currentPage - 1);
	}
	/** Go to the next page if it exists. In manual mode, also update the current page so the parent can react (e.g. by fetching new data from the server). */
	nextPage() {
		if (this.hasNextPage) this.goToPage(this.currentPage + 1);
	}

	/**
	 * Cycles the sort for `columnId`: unsorted → asc → desc → unsorted.
	 * Only has an effect when the column has `enableSorting: true`.
	 * @param columnId The ID of the column to toggle sorting for.
	 */
	toggleSort(columnId: string) {
		const cur = this.sorting;
		if (cur?.id === columnId) {
			this.#setSorting(cur.direction === 'asc' ? { id: columnId, direction: 'desc' } : null);
		} else {
			this.#setSorting({ id: columnId, direction: 'asc' });
		}
	}

	/** Returns the current sort direction for `columnId`, or `false` if unsorted. */
	getSortDirection(columnId: string): SortDirection | false {
		const cur = this.sorting;
		return cur?.id === columnId ? cur.direction : false;
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
		this.#setSorting(null);
	}

	/** Clear both the global filter and all column filters, and reset to page 1. */
	resetFilters() {
		this.globalFilter = '';
		this.columnFilters = {};
		this.goToPage(1);
	}

	/**
	 * Jump to a specific page number (clamped to the valid range). When
	 * `pagination.page` is controlled, emits via `onPageChange` and leaves
	 * internal state untouched; otherwise updates internal state.
	 */
	goToPage(page: number) {
		const next = Math.max(1, Math.min(Math.round(page), this.#totalPages));
		this.#options.pagination?.onPageChange?.(next);
		if (this.#options.pagination?.page === undefined) this.#currentPage = next;
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
		const next = Math.max(1, Math.round(size));
		this.#options.pagination?.onPageSizeChange?.(next);
		if (this.#options.pagination?.pageSize === undefined) this.#pageSize = next;
	}

	/**
	 * Returns a stable unique key for a row, used for tracking selection state across data updates.
	 * @param row A row from `data`. In manual mode, this should be a row from the current page (i.e. `rows`) to ensure the key is correct for selection to work.
	 * @returns A stable unique key for the row, derived from `getRowId` if provided or falling back to the row's index in `data`. Used for tracking selection state across data updates.
	 */
	getRowKey(row: TData): string {
		if (this.#getRowId) return String(this.#getRowId(row));
		return String(this.#rowIndex.get(row) ?? -1);
	}

	/** The row's index in `data` (O(1) via the internal row→index map). */
	getRowIndex(row: TData): number {
		return this.#rowIndex.get(row) ?? -1;
	}
}
