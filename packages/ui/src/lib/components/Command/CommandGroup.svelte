<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { CommandContext } from './command.svelte';

	interface Props {
		children?: Snippet;
		label: string | Snippet;
	}

	const [getCommandState] = CommandContext;

	const commandState = getCommandState();

	const id = $props.id();

	onMount(() => {
		commandState.registerGroup(id);
	});

	let { children, label }: Props = $props();
</script>

<li class="command-group">
	{#if typeof label === 'string'}
		<span class="command-group-label">{label}</span>
	{:else}
		{@render label()}
	{/if}
	<ul role="list" class="command-group-items">
		{@render children?.()}
	</ul>
</li>

<style>
	li {
		--_command-group-gap: var(--command-group-gap, 0.5rem);
		--_command-group-padding: var(--command-group-padding, 0.25rem);
		display: grid;
		gap: var(--_command-group-gap);
		list-style: none;
		padding: var(--_command-group-padding);
	}

    .command-group-label {
        --_command-group-label-color: var(--command-group-label-color, currentColor);
        --_command-group-label-font-size: var(--command-group-label-font-size, 0.75rem);
        --_command-group-label-font-weight: var(--command-group-label-font-weight, 500);
        color: var(--_command-group-label-color);
        font-size: var(--_command-group-label-font-size);
        font-weight: var(--_command-group-label-font-weight);
        
    }
</style>
