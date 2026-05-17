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
		padding: var(--table-cell-padding);
        text-align: start;
	}
</style>
