<script lang="ts">
	import type { HTMLTableAttributes } from 'svelte/elements';

	interface TableHeadProps extends HTMLTableAttributes {}

	let { children }: TableHeadProps = $props();

	const id = $props.id();
</script>

<div class="table-wrapper" role="region" tabindex="0">
	<table class="table">
		{#snippet caption()}{/snippet}
		{@render children?.()}
	</table>
</div>

<style>
	.table-wrapper {
		max-inline-size: 100%;
		overflow-x: auto;
	}

	.table {
		border-collapse: collapse;
		table-layout: fixed;
		inline-size: 100%;
	}
</style>
