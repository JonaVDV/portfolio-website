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
		padding: var(--table-cell-padding);
        text-align: start;
	}
</style>
