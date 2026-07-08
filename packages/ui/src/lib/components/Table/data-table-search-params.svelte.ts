import { SvelteURLSearchParams } from "svelte/reactivity";
import type { DataTable, SortDirection } from "./data-table.svelte.ts";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface TableSearchParamsKeys {
  /** URL parameter key for the global filter value. @default 'q' */
  filter?: string;
  /** URL parameter key for the active sort column id. @default 'sort' */
  sort?: string;
  /** URL parameter key for the sort direction. @default 'dir' */
  sortDir?: string;
  /** URL parameter key for the current page number. @default 'page' */
  page?: string;
  /** URL parameter key for the page size. @default 'pageSize' */
  pageSize?: string;
}

export interface TableSearchParamsOptions {
  /**
   * Initial URL or URLSearchParams to read state from on construction.
   *
   * @example SvelteKit
   * ```ts
   * import { page } from '$app/state';
   * new TableSearchParams(table, { initial: page.url });
   * ```
   * @example Vanilla
   * ```ts
   * new TableSearchParams(table, { initial: new URL(location.href) });
   * ```
   */
  initial?: URLSearchParams | URL;

  /** Override the default URL parameter key names. */
  keys?: TableSearchParamsKeys;
}

// ── Class ─────────────────────────────────────────────────────────────────────

/**
 * A reactive `URLSearchParams` that stays in sync with a `DataTable`'s
 * filter/sort/page state. Extends `SvelteURLSearchParams` so that reading
 * `params.toString()` (or using `params` in a template / string concatenation)
 * is reactive — any `$effect` or `$derived` that references the params will
 * re-run whenever the table state changes.
 *
 * Instantiate inside a Svelte component (or any `$effect` root) so the internal
 * `$effect` has a reactive context to run in.
 *
 * @example SvelteKit
 * ```svelte
 * <script>
 *   import { page } from '$app/state';
 *   import { goto } from '$app/navigation';
 *   import { DataTable, TableSearchParams } from '$lib';
 *
 *   const table = new DataTable({ data, columns, manual: true });
 *   const params = new TableSearchParams(table, { initial: page.url });
 *
 *   // params IS the URLSearchParams — toString() is reactive, so this effect
 *   // re-runs automatically whenever filter/sort/page changes.
 *   $effect(() => {
 *     goto('?' + params, { replaceState: true, keepFocus: true, noScroll: true });
 *   });
 * </script>
 *
 * <!-- Or bind directly to a form action: -->
 * <form action={'?' + params}>...</form>
 * ```
 */
export class TableSearchParams<
  TData extends Record<string, unknown>,
> extends SvelteURLSearchParams {
  constructor(table: DataTable<TData>, options: TableSearchParamsOptions = {}) {
    super();

    const keys = {
      filter: options.keys?.filter ?? "q",
      sort: options.keys?.sort ?? "sort",
      sortDir: options.keys?.sortDir ?? "dir",
      page: options.keys?.page ?? "page",
      pageSize: options.keys?.pageSize ?? "pageSize",
      ...options.keys,
    };

    // ── Read initial URL state → hydrate table ──────────────────────────
    const initial =
      options.initial instanceof URL ? options.initial.searchParams : (options.initial ?? null);

    if (initial) {
      const q = initial.get(keys.filter);
      if (q) table.globalFilter = q;

      const sortId = initial.get(keys.sort);
      const sortDir = initial.get(keys.sortDir) as SortDirection | null;
      if (sortId && (sortDir === "asc" || sortDir === "desc")) table.setSort(sortId, sortDir);

      const pageStr = initial.get(keys.page);
      if (pageStr) {
        const p = parseInt(pageStr, 10);
        if (!isNaN(p) && p > 0) table.goToPage(p);
      }
    }

    // ── Keep self in sync with table state ──────────────────────────────
    // set/delete only increment #version when the value actually changes,
    // so this is efficient even if the effect re-runs frequently.
    $effect(() => {
      if (table.globalFilter) this.set(keys.filter, table.globalFilter);
      else this.delete(keys.filter);

      const sorting = table.sorting;
      if (sorting) {
        this.set(keys.sort, sorting.id);
        this.set(keys.sortDir, sorting.direction);
      } else {
        this.delete(keys.sort);
        this.delete(keys.sortDir);
      }

      if (table.currentPage > 1) this.set(keys.page, String(table.currentPage));
      else this.delete(keys.page);

      if (table.pageSize) this.set(keys.pageSize, String(table.pageSize));
      else this.delete(keys.pageSize);
    });
  }
}
