<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Table from './Table.svelte';
	import PaymentTableDemo from './data-table-payment-demo.svelte';
	import TableRow from './TableRow.svelte';
	import TableHead from './TableHead.svelte';
	import TableCell from './TableCell.svelte';

	const { Story } = defineMeta({
		title: 'Components/Table',
		component: Table,
		tags: ['autodocs']
	});
</script>

<!--
	Payment Table — shadcn replica
	══════════════════════════════
	Recreates the shadcn-svelte data table example using a Svelte-native API
	instead of TanStack Table. See data-table-payment-demo.svelte for the full
	annotated source — it doubles as the design spec for the implementation.

	What this story exercises:
	  • State flowing OUT  — column visibility dropdown, row selection count,
	    and pagination all read from the DataTable controller the parent owns.
	  • formatter + cell split — the `amount` column has a pure `formatter`
	    function; a `cell` snippet adds the markup (class="text-end font-medium").
	  • Custom header snippet — sort-toggle button for the email column.
	  • selectable: true — built-in checkbox column; no renderComponent needed.
	  • Action cell — DropdownMenu fully composed inside the `cell` snippet,
	    closing over `row` for type-safe access to row data.
-->
<Story name="Payment Table">
	{#snippet template()}
		<PaymentTableDemo />
	{/snippet}
</Story>

<Story name="Basic Table">
	{#snippet template()}
		<Table>
			<thead>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Age</TableHead>
				</TableRow>
			</thead>
			<tbody>
				<TableRow>
					<TableCell>Jane Doe</TableCell>
					<TableCell>42</TableCell>
				</TableRow>
				<TableRow>
					<TableCell>John Doe</TableCell>
					<TableCell>36</TableCell>
				</TableRow>
			</tbody>
		</Table>
	{/snippet}
</Story>
