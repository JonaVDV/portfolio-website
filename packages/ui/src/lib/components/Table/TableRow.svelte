<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {}

	let { children, ...rest }: TableRowProps = $props();
</script>

<tr {...rest}>
	{@render children?.()}
</tr>

<style>
	tr {
		border-block: var(--_table-row-border-width) solid var(--_table-row-border-color);
		content-visibility: auto;
		contain-intrinsic-size: auto 3.5rem;
	}

	tr:nth-child(odd) {
		background-color: var(--_table-row-zebra-stripe-color);
	}
</style>
