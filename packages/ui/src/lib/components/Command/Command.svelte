<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setCommandGroupContext, CommandState } from './command.svelte';
	import Spinner from '$components/Form/Spinner/Spinner.svelte';

	const commandState = CommandState.create();
	// Initialize group context to undefined so CommandItem works outside a CommandGroup.
	setCommandGroupContext(undefined);

	const isEmpty = $derived(commandState.filteredResults.count === 0);
	let { children, empty, loading }: { children?: Snippet; empty?: Snippet; loading?: boolean } =
		$props();
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div class="command" role="application" onkeydown={(e) => commandState.onKeyDown(e)}>
	{@render children?.()}
	{#if loading}
		<div class="command-loading"><Spinner /></div>
	{:else if isEmpty}
		<div class="command-empty">
			{#if empty}
				{@render empty()}
			{:else}
				No results found.
			{/if}
		</div>
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

	.command-loading {
		--_command-loading-padding: var(
			--command-loading-padding,
			var(--command-item-padding, 1.5rem 1rem)
		);

		display: flex;
		justify-content: center;
		align-items: center;
		padding: var(--_command-loading-padding);
	}

	.command-empty {
		--_command-empty-padding: var(
			--command-empty-padding,
			var(--command-item-padding, 1.5rem 1rem)
		);
		--_command-empty-font-size: var(--command-empty-font-size, var(--fs-300, 0.875rem));
		--_command-empty-color: var(--command-empty-color, var(--clr-text-400, oklch(0.5 0.01 250)));

		padding: var(--_command-empty-padding);
		text-align: center;
		font-size: var(--_command-empty-font-size);
		color: var(--_command-empty-color);
	}
</style>
