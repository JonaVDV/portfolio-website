<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children?: Snippet } = $props();
</script>

<ul role="listbox" class="command-list">
	{@render children?.()}
</ul>

<style>
	.command-list {
		--_command-list-max-height: var(--command-list-max-height, 22rem);
		--_command-list-padding: var(--command-list-padding, 0.25rem);

		display: grid;
		list-style: none;
		margin: 0;
		padding: var(--_command-list-padding);
		max-block-size: var(--_command-list-max-height);
		overflow-y: auto;
		overscroll-behavior: contain;
	}
</style>
