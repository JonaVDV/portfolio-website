<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {
		sticky?: boolean;
	}

	let { children, sticky = false, ...rest }: TableHeaderProps = $props();
</script>

<thead {...rest} class:sticky>
	<tr>
		{@render children?.()}
	</tr>
</thead>

<style>
	thead {
		background-color: var(--table-header-background, var(--table-background));
		color: var(--table-header-color, var(--table-color));
		position: sticky;
		top: 0;
		border-block: 1px solid var(--_table-border-color);
		z-index: 1;
		isolation: isolate;
	}
</style>
