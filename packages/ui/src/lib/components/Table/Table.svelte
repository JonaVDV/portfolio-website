<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLTableAttributes } from 'svelte/elements';

	interface TableProps extends HTMLTableAttributes {
		caption?: string | Snippet;
	}

	let { children, caption }: TableProps = $props();

	const id = $props.id();
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div class="table-wrapper" role="region" tabindex="0" aria-describedby={id}>
	<table class="table">
		{#if typeof caption === 'string'}
			<caption {id}>{caption}</caption>
		{:else}
			{@render caption?.()}
		{/if}
		{@render children?.()}
	</table>
</div>

<style>
	.table-wrapper {
		max-inline-size: 100%;
		max-block-size: var(--table-max-height, 80svh);
		overflow: auto;
	}

	.table {
		--_table-cell-padding: var(--table-cell-padding, 0.75rem);
		--_table-cell-border-width: var(--table-cell-border-width, 0px);
		--_table-row-selected-background: var(
			--table-row-selected-background,
			var(--_table-background)
		);
		--_table-row-border-color: var(--table-row-border-color, var(--_table-border-color));
		--_table-row-border-width: var(--table-row-border-width, 1px);
		--_table-row-zebra-stripe-color: var(--table-row-zebra-stripe-color, transparent);
		--_table-border-color: var(--table-border-color, #e0e0e0);
		--_table-background: var(--table-background, #fff);
		--_table-header-background: var(--table-header-background, var(--_table-background));
		background-color: var(--_table-background);
		border-collapse: collapse;
		position: relative;
		width: 100%;
	}
</style>
