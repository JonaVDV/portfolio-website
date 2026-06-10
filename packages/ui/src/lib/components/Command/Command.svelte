<script lang="ts">
	import type { Snippet } from 'svelte';
	import { CommandState } from './command.svelte';

	const commandState = CommandState.create();

    $inspect(commandState);

	let { children } = $props();
</script>

<div class="command">
	{@render children?.()}
</div>

<style>
	.command {
		--_command-background: var(--command-background, transparent);
		--_command-color: var(--command-color, currentColor);
		--_command-border-radius: var(--command-border-radius, 0.5rem);
		--_command-border-width: var(--command-border-width, 1px);
		--_command-border-color: var(--command-border-color, oklch(73.481% 0.00008 271.152));
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
        margin: auto;
	}
</style>
