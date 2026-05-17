<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {}

	let { children, ...rest }: TableRowProps = $props();
</script>

<tr {...rest}>
	{@render children?.()}
</tr>

<style>
	/* Add your styles here */
</style>
