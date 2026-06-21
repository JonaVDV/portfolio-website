<script lang="ts">
	import type { Snippet } from 'svelte';
	import { CommandGroupContext, CommandState } from './command.svelte';

	const commandState = CommandState.create();
	// Initialize group context to undefined so CommandItem works outside a CommandGroup.
	const [, setCommandGroupContext] = CommandGroupContext;
	setCommandGroupContext(undefined);
	const isEmpty = $derived(commandState.filteredResults.count === 0);
	let { children, empty }: { children?: Snippet; empty?: Snippet } = $props();
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div class="command" role="application" onkeydown={(e) => commandState.onKeyDown(e)}>
	{@render children?.()}
	{#if isEmpty}
		{@render empty?.()}
	{/if}
</div>

<style>
	.command {
		--_command-background: var(--command-background, transparent);
		--_command-color: var(--command-color, currentColor);
		--_command-border-radius: var(--command-border-radius, 0.5rem);
		--_command-border-width: var(--command-border-width, 1px);
		--_command-border-color: var(--command-border-color, oklch(93.042% 0.00757 16.525));
		--_command-padding: var(--command-padding, 0.5rem);
		--_command-max-width: var(--command-max-width, 30em);
		background-color: var(--_command-background);

		color: var(--_command-color);
		border-radius: var(--_command-border-radius);
		border-width: var(--_command-border-width);
		border-color: var(--_command-border-color);
		border-style: solid;
		padding: var(--_command-padding);
		max-width: var(--_command-max-width);
	}
</style>
