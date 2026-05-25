import type { ColumnDefinition, SortDirection } from './data-table.svelte.ts';
import type { TableSearchParamsKeys } from './data-table-search-params.svelte.ts';

export interface ApplyTableParamsOptions<TData extends Record<string, unknown>> {
	/**
	 * Column definitions from your DataTable. When provided, per-column
	 * `filterFn` and `sortFn` are respected; otherwise falls back to the
	 * default global-text filter and lexicographic/numeric sort.
	 */
	columns?: ColumnDefinition<TData>[];
	/** Override the URL parameter key names. Must match `TableSearchParamsKeys` used on the client. */
	keys?: TableSearchParamsKeys;
	/** Fallback page size when the `pageSize` param is absent. @default 10 */
	defaultPageSize?: number;
}

export interface TableParamsResult<TData> {
	/** The paginated slice of rows for the current page. */
	rows: TData[];
	/** Total number of rows after filtering (before pagination). */
	total: number;
	/** The resolved page size used for pagination. */
	pageSize: number;
}

/**
 * Server-side counterpart to `TableSearchParams`.
 *
 * Reads the standard URL search parameters written by `TableSearchParams`
 * (filter, sort, dir, page, pageSize) and applies global-text filtering,
 * per-column filter predicates, sorting, and pagination to the provided dataset.
 *
 * Returns `{ rows, total, pageSize }` ready to be returned directly from a
 * SvelteKit `load` function (or any other server handler).
 *
 * @example
 * ```ts
 * // +page.server.ts
 * import { applyTableParams } from '$lib/components/Table/data-table-server.ts';
 * import { columns } from './columns.ts';
 *
 * export const load: PageServerLoad = ({ url }) => {
 *   return applyTableParams(SOURCE, url.searchParams, { columns });
 * };
 * ```
 */
export function applyTableParams<TData extends Record<string, unknown>>(
	data: TData[],
	params: URLSearchParams,
	options: ApplyTableParamsOptions<TData> = {}
): TableParamsResult<TData> {
	const keys = {
		filter: options.keys?.filter ?? 'q',
		sort: options.keys?.sort ?? 'sort',
		sortDir: options.keys?.sortDir ?? 'dir',
		page: options.keys?.page ?? 'page',
		pageSize: options.keys?.pageSize ?? 'pageSize'
	};

	const columns = options.columns ?? [];
	let rows = data;

	for (const col of columns) {
		if (!col.filterFn) continue;
		const colId = col.id ?? String(col.accessor ?? '');
		const filterValue = params.get(colId);
		if (filterValue === null || filterValue === '') continue;
		rows = rows.filter((row) => {
			const value = col.accessor != null ? row[col.accessor] : undefined;
			return col.filterFn!(value, row, filterValue);
		});
	}

	const q = params.get(keys.filter)?.trim().toLowerCase();
	if (q) {
		rows = rows.filter((row) =>
			Object.values(row).some((v) => String(v).toLowerCase().includes(q))
		);
	}

	const sortId = params.get(keys.sort);
	const dir = params.get(keys.sortDir) as SortDirection | null;
	if (sortId && (dir === 'asc' || dir === 'desc')) {
		const col = columns.find((c) => (c.id ?? String(c.accessor ?? '')) === sortId);
		rows = [...rows].sort((a, b) => {
			const cmp = col?.sortFn
				? col.sortFn(a, b)
				: (() => {
						const accessor = col?.accessor ?? (sortId as keyof TData);
						const av = a[accessor];
						const bv = b[accessor];
						if (av == null) return 1;
						if (bv == null) return -1;
						return av < bv ? -1 : av > bv ? 1 : 0;
					})();
			return dir === 'asc' ? cmp : -cmp;
		});
	}

	const total = rows.length;

	const pageSize = Math.max(
		1,
		parseInt(params.get(keys.pageSize) ?? String(options.defaultPageSize ?? 10), 10)
	);
	const currentPage = Math.max(1, parseInt(params.get(keys.page) ?? '1', 10));
	const start = (currentPage - 1) * pageSize;

	return {
		rows: rows.slice(start, start + pageSize),
		total,
		pageSize
	};
}
