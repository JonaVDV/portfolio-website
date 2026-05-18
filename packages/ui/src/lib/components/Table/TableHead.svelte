<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	interface TableHeadProps extends HTMLAttributes<HTMLTableCellElement> {}

	let { children, ...rest }: TableHeadProps = $props();
</script>

<th {...rest}>
	{@render children?.()}
</th>

<style>
	th {
		position: relative;
		padding: var(--_table-cell-padding);
		background-color: var(--_table-background, var(--table-header-background));
		border: var(--_table-cell-border-width, 1px) solid var(--_table-border-color);
		text-align: var(--table-head-text-align);
		z-index: 2;
	}
</style>
