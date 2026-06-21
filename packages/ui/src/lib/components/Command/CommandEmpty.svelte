<script lang="ts">
	import type { Snippet } from 'svelte';
	import { CommandState } from './command.svelte';

	let { children }: { children?: Snippet } = $props();
	const commandState = CommandState.get();

	const isVisible = $derived(commandState.filteredResults.count === 0);
</script>

{#if isVisible}
	<li class="command-empty" role="presentation">
		{@render children?.()}
	</li>
{/if}

<style>
	.command-empty {
		padding: 1.5rem 1rem;
		text-align: center;
		font-size: var(--fs-300, 0.875rem);
		color: oklch(55% 0.01 250);
		list-style: none;
	}
</style>
