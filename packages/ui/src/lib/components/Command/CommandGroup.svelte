<script lang="ts">
	import type { Snippet } from 'svelte';
	import { CommandGroupContext, CommandState } from './command.svelte';

	interface Props {
		children?: Snippet;
		label: string | Snippet;
	}

	let { children, label }: Props = $props();
	const commandState = CommandState.get();
	const groupId = $props.id();

	const [, setCommandGroupContext] = CommandGroupContext;
	setCommandGroupContext(groupId);

	const isVisible = $derived(commandState.shouldRenderGroup(groupId));
	const order = $derived(commandState.getGroupOrder(groupId));

	$effect(() => {
		return commandState.registerGroup(groupId);
	});
</script>

<li
	class="command-group"
	id={groupId}
	data-value={typeof label === 'string' ? label : ''}
	class:hidden={!isVisible}
	style:order
>
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
	.command-group-items {
		display: grid;
		list-style: none;
		padding: 0;
		margin: 0;
	}

	li {
		--_command-group-gap: var(--command-group-gap, 0.5rem);
		--_command-group-padding: var(--command-group-padding, 0.25rem);
		display: grid;
		gap: var(--_command-group-gap);
		list-style: none;
		padding: var(--_command-group-padding);

		&.hidden {
			display: none;
		}
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
