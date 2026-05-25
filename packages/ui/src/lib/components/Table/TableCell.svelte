<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	interface TableCellProps extends HTMLAttributes<HTMLTableCellElement> {}

	let { children, ...rest }: TableCellProps = $props();
</script>

<td {...rest}>
	{@render children?.()}
</td>

<style>
	td {
		padding: var(--_table-cell-padding);
		text-align: var(--table-cell-text-align, start);
		width: fit-content;
		border: var(--_table-cell-border-width) solid var(--_table-border-color);
	}

	td :global(svg) {
		max-width: revert;
	}
</style>
