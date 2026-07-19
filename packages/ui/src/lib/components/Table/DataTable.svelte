<script lang="ts" generics="TData extends Record<string, unknown>">
	import type { Snippet } from 'svelte';
	import type { CellContext, ColumnDefinition, HeaderContext } from './data-table.svelte.ts';
	import { columnId, type DataTable } from './data-table.svelte.ts';
	import Table from './Table.svelte';
	import TableHeader from './TableHeader.svelte';
	import TableRow from './TableRow.svelte';
	import TableHead from './TableHead.svelte';
	import TableCell from './TableCell.svelte';

	interface DataTableProps {
		table: DataTable<TData>;
		/**
		 * Per-column cell snippets. Name a snippet after the column's key
		 * (`accessor` or `id`) to override rendering for that column only.
		 * Must render a complete `<td>` element.
		 *
		 * example
		 * ```svelte
		 * <DataTable {table}>
		 *   {#snippet amount({ formatted })} <td class="text-end">{formatted}</td> {/snippet}
		 * </DataTable>
		 * ```
		 */
		[columnKey: string]:
			| Snippet<[CellContext<TData>]>
			| Snippet<[HeaderContext<TData>]>
			| DataTable<TData>
			| undefined;
		/**
		 * Fallback cell snippet — called for any column that doesn't have its
		 * own named snippet. Must render a complete `<td>` element.
		 * Default: `<TableCell>{formatted}</TableCell>` (with `column.cellClass`).
		 */
		cell?: Snippet<[CellContext<TData>]>;
		/**
		 * Override the default header rendering.
		 * Must render a complete `<th>` element.
		 * Default: `<TableHead>{column.header}</TableHead>` (with `column.headerClass`).
		 */
		header?: Snippet<[HeaderContext<TData>]>;
	}

	let { table, header, cell, ...columnSnippets }: DataTableProps = $props();

	/** Returns the display string for a cell — formatter output or String(raw value). */
	function getFormatted(col: ColumnDefinition<TData>, row: TData): string {
		const value = col.accessor != null ? row[col.accessor] : undefined;
		if (col.formatter && value !== undefined) return col.formatter(value, row);
		return value !== undefined ? String(value) : '';
	}
</script>

<!-- DataTable wraps Table with data-driven header + body rendering.        -->
<!-- Pass `header` / `cell` snippets to customise individual columns.        -->

<Table>
	<TableHeader>
		{#each table.visibleColumns as column (columnId(column))}
			{#if column.id === '__select__'}
				<TableHead>
					<input
						type="checkbox"
						checked={table.allSelected}
						indeterminate={table.someSelected && !table.allSelected}
						onchange={() => table.toggleAllRows()}
						aria-label="Select all rows"
					/>
				</TableHead>
			{:else if header}
				{@render header({
					column,
					sorted: table.getSortDirection(columnId(column)),
					toggleSort: () => table.toggleSort(columnId(column))
				})}
			{:else}
				<TableHead class={column.headerClass}>{column.header}</TableHead>
			{/if}
		{/each}
	</TableHeader>

	<tbody>
		{#each table.rows as row (table.getRowKey(row))}
			{const rowKey = table.getRowKey(row)}
			{const dataIndex = table.getRowIndex(row)}
			<TableRow>
				{#each table.visibleColumns as column (columnId(column))}
					{const value = column.accessor != null ? row[column.accessor] : undefined}
					{const formatted = getFormatted(column, row)}
					{const key = columnId(column)}
					{const columnSnippet = columnSnippets[key] as Snippet<[CellContext<TData>]>}
					{const columnData = {
						column,
						row,
						value,
						formatted,
						table,
						index: dataIndex
					} as CellContext<TData>}
					{#if column.id === '__select__'}
						<!-- Built-in per-row checkbox — rendered by DataTable, not by user snippets -->
						<TableCell>
							<input
								type="checkbox"
								checked={table.rowSelection[rowKey] ?? false}
								onchange={() => table.toggleRowSelection(rowKey)}
								aria-label="Select row"
							/>
						</TableCell>
					{:else}
						{#if columnSnippet}
							{@render columnSnippet(columnData)}
						{:else if cell}
							{@render cell(columnData)}
						{:else}
							<TableCell class={column.cellClass}>{formatted}</TableCell>
						{/if}
					{/if}
				{/each}
			</TableRow>
		{/each}
	</tbody>
</Table>
