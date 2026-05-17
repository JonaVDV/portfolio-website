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
	enableHiding?: boolean;
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
}

export class DataTable<TData extends Record<string, unknown>> {
	// ── Public data ───────────────────────────────────────────────────────────
	// Declared with $state so the parent can update data (e.g. in server-side mode)
	// without requiring a full component re-mount.
	data = $state<TData[]>([]);
	columns = $state<ColumnDefinition<TData>[]>([]);

	// ── Public reactive state ─────────────────────────────────────────────────

	/** Controls which columns are visible. Set a key to `false` to hide that column. */
	columnVisibility = $state<Record<string, boolean>>({});
	/** Map of row-index → selected. Mutate to drive checkboxes; read to know what is selected. */
	rowSelection = $state<Record<number, boolean>>({});
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
	#pageSize = 10;
	#sorting = $state<{ id: string; direction: SortDirection } | null>(null);
	#manual: boolean = false;

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

		// Apply global text filter.
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

	get hasPrevPage() {
		return this.#currentPage > 1;
	}

	get pageCount() {
		return this.#totalPages;
	}

	get currentPage() {
		return this.#currentPage;
	}

	get hasNextPage() {
		return this.#currentPage < this.#totalPages;
	}

	get rowCount() {
		return this.data.length;
	}

	get filteredRowCount() {
		if (this.#manual && this.manualRowCount !== null) return this.manualRowCount;
		return this.#filteredRows.length;
	}

	get selectedRows(): TData[] {
		return this.data.filter((_, i) => this.rowSelection[i] === true);
	}

	get allSelected() {
		return this.data.length > 0 && this.data.every((_, i) => this.rowSelection[i] === true);
	}

	get someSelected() {
		return this.data.some((_, i) => this.rowSelection[i] === true);
	}

	/** Current sort state, or `null` when unsorted. In manual mode, read this to tell the server what to sort by. */
	get sorting() {
		return this.#sorting;
	}

	// ── Constructor ───────────────────────────────────────────────────────────

	constructor(options: DataTableOptions<TData>) {
		this.data = options.data;
		// If selectable, prepend the built-in checkbox column. The component
		// renders it internally — consumers never handle '__select__' in snippets.
		const selectCol: ColumnDefinition<TData> = { id: '__select__', enableHiding: false };
		this.columns = options.selectable ? [selectCol, ...options.columns] : options.columns;
		this.#pageSize = options.pagination?.pageSize ?? 10;
		this.#manual = options.manual ?? false;
		// Pre-populate columnVisibility so bind:checked always gets a boolean
		// (undefined causes a Svelte runtime error when binding to a prop with a fallback).
		for (const col of this.columns) {
			const key = col.id ?? String(col.accessor ?? '');
			this.columnVisibility[key] = true;
		}
		// Reset to page 1 whenever filters change so users don't end up on a
		// non-existent page after narrowing the result set.
		let filtersInitialized = false;
		$effect(() => {
			void this.globalFilter;
			void JSON.stringify(this.columnFilters);
			if (!filtersInitialized) {
				filtersInitialized = true;
				return;
			}
			this.#currentPage = 1;
		});
	}

	// ── Methods ───────────────────────────────────────────────────────────────

	prevPage() {
		if (this.hasPrevPage) this.#currentPage -= 1;
	}

	nextPage() {
		if (this.hasNextPage) this.#currentPage += 1;
	}

	/**
	 * Cycles the sort for `columnId`: unsorted → asc → desc → unsorted.
	 * Only has an effect when the column has `enableSorting: true`.
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

	toggleRowSelection(rowIndex: number) {
		this.rowSelection[rowIndex] = !this.rowSelection[rowIndex];
	}

	resetSelection() {
		this.rowSelection = {};
	}

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

	toggleAllRows() {
		const allSelected = this.data.every((_, i) => this.rowSelection[i]);
		if (allSelected) {
			this.rowSelection = {};
		} else {
			const next: Record<number, boolean> = {};
			this.data.forEach((_, i) => (next[i] = true));
			this.rowSelection = next;
		}
	}
}
