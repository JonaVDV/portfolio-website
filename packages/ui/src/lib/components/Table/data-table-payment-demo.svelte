<script lang="ts">
	// ┌─────────────────────────────────────────────────────────────────────────┐
	// │  DESIGN SPEC — Table.svelte and the full DataTable class do not exist   │
	// │  yet. This file defines the TARGET API the implementation must satisfy.  │
	// │  Type errors here are intentional until the implementation is complete.  │
	// └─────────────────────────────────────────────────────────────────────────┘
	//
	// Architecture at a glance
	// ─────────────────────────
	//
	//  1. DataTable CLASS  (data-table.svelte.ts)
	//     The parent creates and OWNS the instance. All reactive state ($state,
	//     $derived) lives inside it. Because the parent holds the reference, it
	//     can read `table.rowSelection`, `table.sorting`, `table.columnVisibility`
	//     etc. reactively with zero $bindable machinery.
	//
	//  2. ColumnDef = PURE METADATA  (no Snippet types)
	//     Snippets cannot live in .ts files and embedding them in plain-object
	//     column defs is awkward (requires `createRawSnippet` or reactive glue).
	//     Column defs carry only serialisable metadata: accessor, header string,
	//     formatter function, enableSorting, enableHiding.
	//     The `formatter` is a pure TS function (value, row) → string.
	//
	//  3. GLOBAL-DISPATCH snippets on <Table>
	//     The `cell` and `header` snippets are passed as children of <Table>.
	//     Each snippet receives context ({ column, row, value, formatted }) and
	//     dispatches per-column rendering with {#if column.accessor === '...'}.
	//     Because snippets close over the surrounding scope, they can reference
	//     local variables, other components, event handlers — anything.
	//     All markup stays in markup. All logic stays in <script>. All state
	//     stays in the controller.
	//
	//     formatter + cell split:
	//       - formatter  → pure function, result available as `formatted`
	//       - cell snippet → only needed for custom markup (CSS classes, nested
	//         components, etc.); receives both raw `value` and `formatted`
	//       - no cell snippet → Table renders <td>{formatted}</td> by default

	import type { ColumnDefinition, CellContext } from './data-table.svelte.ts';
	import { DataTable } from './data-table.svelte.ts';
	import DataTableComponent from './DataTable.svelte';
	import Button from '$components/Button/Button.svelte';
	import DropdownMenu from '$components/DropdownMenu/DropdownMenu.svelte';
	import DropdownCheckbox from '$components/DropdownMenu/DropdownMenuCheckbox.svelte';
	import DropdownItem from '$components/DropdownMenu/DropdownMenuItem.svelte';
	import ArrowUpDown from '~icons/lucide/arrow-up-down';
	import ChevronDown from '~icons/lucide/chevron-down';
	import Ellipsis from '~icons/lucide/ellipsis';
	import DropdownGroup from '$components/DropdownMenu/DropdownMenuGroup.svelte';
	import Separator from '$components/Separator/Separator.svelte';
	import TableHead from './TableHead.svelte';
	import TableCell from './TableCell.svelte';

	// ── Data ──────────────────────────────────────────────────────────────────

	type Payment = {
		id: string;
		amount: number;
		status: 'Pending' | 'Processing' | 'Success' | 'Failed';
		email: string;
	};

	const payments: Payment[] = $state([
		{ id: 'm5gr84i9', amount: 316, status: 'Success', email: 'ken99@yahoo.com' },
		{ id: '3u1reuv4', amount: 242, status: 'Success', email: 'Abe45@gmail.com' },
		{ id: 'derv1ws0', amount: 837, status: 'Processing', email: 'Monserrat44@gmail.com' },
		{ id: '5kma53ae', amount: 874, status: 'Success', email: 'Silas22@gmail.com' },
		{ id: 'bhqecj4p', amount: 721, status: 'Failed', email: 'carmella@hotmail.com' }
	]);

	// ── Column definitions — pure metadata, no Svelte in sight ───────────────

	const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

	const columns: ColumnDefinition<Payment>[] = [
		{
			accessor: 'status',
			header: 'Status',
			cellClass: 'capitalize'
		},
		{
			accessor: 'email',
			header: 'Email',
			enableSorting: true,
			cellClass: 'lowercase'
		},
		{
			accessor: 'amount',
			header: 'Amount',
			enableSorting: true,
			headerClass: 'text-end',
			formatter: (v) => usd.format(v as number)
		},
		{
			// No accessor — this column has no data, only custom cell rendering.
			id: 'actions',
			enableHiding: false
		}
	];

	// ── Table controller ──────────────────────────────────────────────────────
	//
	// The parent creates and owns this. The <Table> component receives it and
	// mutates its state. Because we hold the reference, all mutations are
	// immediately visible here — no events, no $bindable.

	const table = new DataTable<Payment>({
		get data() {
			return payments;
		},
		columns,
		// selectable: true adds a built-in checkbox column at position 0.
		// Table handles rendering the checkboxes; the parent just reads
		// `table.rowSelection` to know what is selected.
		selectable: true,
		pagination: { pageSize: 10 }
	});

	// Derived from controller state — reactive, updates automatically.
	const selectedCount = $derived(Object.keys(table.rowSelection).length);
</script>

<!-- ── Toolbar ────────────────────────────────────────────────────────────── -->

<div class="toolbar">
	<search>
		<form action="" method="get">
			<input type="search" placeholder="Filter emails…" bind:value={table.globalFilter} />
		</form>
	</search>

	<!--
		Column visibility dropdown.
		Reads: table.hidableColumns — columns where enableHiding !== false
		Writes: table.columnVisibility — mutate directly, Table reacts
	-->
	<div>
		<DropdownMenu position="right span-end">
			{#snippet trigger({ props })}
				<Button {...props} variant="stripped">
					Columns <ChevronDown />
				</Button>
			{/snippet}

			{#each table.hidableColumns as col (col.id ?? col.accessor)}
				<DropdownCheckbox bind:checked={table.columnVisibility[col.id ?? String(col.accessor)]}>
					{col.header}
				</DropdownCheckbox>
			{/each}
		</DropdownMenu>
	</div>
</div>

<!-- ── Table ──────────────────────────────────────────────────────────────── -->
<!--
	Both snippets are optional.
	Omit `header` → Table renders <th>{col.header}</th> for every column.
	Omit `cell`   → Table renders <td>{formatted}</td> for every column.
	Each snippet renders the FULL <th> / <td> element so you own the attributes.
-->
<DataTableComponent {table}>
	<!--
		header snippet — only needed for columns that require custom markup.
		Columns using the default <th> (with optional headerClass) need no snippet.
	-->
	{#snippet header({ column, sorted, toggleSort })}
		{#if column.accessor === 'email'}
			<TableHead>
				<Button variant="stripped" onclick={toggleSort}>
					Email
					<ArrowUpDown aria-hidden="true" />
					<span class="sr-only">{sorted ? `sorted ${sorted}` : 'not sorted'}</span>
				</Button>
			</TableHead>
		{:else}
			<TableHead class={column.headerClass}>{column.header}</TableHead>
		{/if}
	{/snippet}

	<!--
		Per-column cell snippets — name matches the column's accessor or id.
		Columns handled by cellClass (status, email) need no snippet here.
		Omit a snippet entirely to fall back to <TableCell>{formatted}</TableCell>.
	-->
	{#snippet amount({ formatted }: CellContext<Payment>)}
		<TableCell class="text-end font-medium">{formatted}</TableCell>
	{/snippet}

	{#snippet actions({ row }: CellContext<Payment>)}
		<TableCell>
			<DropdownMenu
				position="right span-bottom"
				--popover-custom-fallbacks="none"
				--popover-padding="0"
			>
				{#snippet trigger({ props })}
					<Button {...props} variant="stripped" aria-label="Open row actions">
						<Ellipsis aria-hidden="true" />
					</Button>
				{/snippet}
				<DropdownGroup label="Actions">
					<DropdownItem onclick={() => navigator.clipboard.writeText(row.id)}>
						Copy payment ID
					</DropdownItem>
				</DropdownGroup>
				<Separator layout="popover-full-width" />
				<DropdownItem>View customer</DropdownItem>
				<DropdownItem>View payment details</DropdownItem>
			</DropdownMenu>
		</TableCell>
	{/snippet}
</DataTableComponent>

<!-- ── Pagination + selection footer ─────────────────────────────────────── -->

<div class="footer">
	<Button
		variant="primary"
		onclick={() => {
			payments.push({
				id: crypto.randomUUID().slice(0, 8),
				amount: Math.floor(Math.random() * 1000),
				status: 'Pending',
				email: `user${payments.length + 1}@example.com`
			});

			$inspect(payments);
		}}
	>
		Add more rows
	</Button>
	<span class="selection-count">
		{selectedCount} of {payments.length} row(s) selected
	</span>

	<div class="pagination">
		<Button variant="stripped" disabled={!table.hasPrevPage} onclick={() => table.prevPage()}>
			Previous
		</Button>
		<Button variant="stripped" disabled={!table.hasNextPage} onclick={() => table.nextPage()}>
			Next
		</Button>
	</div>
</div>

<style>
	.toolbar {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding-block-end: 1rem;
	}

	.footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-block-start: 1rem;
	}

	.pagination {
		display: flex;
		gap: 0.5rem;
	}

	.selection-count {
		font-size: 0.875rem;
		color: var(--color-muted, #888);
	}
</style>
