export { default as Root } from './Table.svelte';
export { default as DataTable } from './DataTable.svelte';
export { default as Row } from './TableRow.svelte';
export { default as Cell } from './TableCell.svelte';
export { default as Header } from './TableHeader.svelte';
export { default as Head } from './TableHead.svelte';

export { DataTable as SvelteDataTable } from './data-table.svelte.ts';
export type {
	ColumnDefinition,
	SortDirection,
	DataTableOptions,
	CellContext,
	HeaderContext
} from './data-table.svelte.ts';
