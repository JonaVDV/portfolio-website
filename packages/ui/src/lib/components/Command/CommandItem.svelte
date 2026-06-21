<script lang="ts">
	import { type Snippet } from 'svelte';
	import { CommandGroupContext, CommandState } from './command.svelte';

	interface Props {
		children?: Snippet;
		class?: string;
		value: string;
		onselect?: () => void;
		keywords?: string[];
		href?: string;
	}

	let { children, class: className, value, onselect, keywords, href }: Props = $props();

	const commandState = CommandState.get();
	const [getCommandGroupContext] = CommandGroupContext;

	const groupId = getCommandGroupContext();
	const id = $props.id();

	$effect(() => {
		return commandState.registerItem(id, value, keywords, groupId);
	});

	const isVisible = $derived(commandState.shouldRenderItem(id));
	const isSelected = $derived(commandState.selectedId === id);
	const order = $derived(commandState.getItemOrder(id));
</script>

<!-- TODO There must be a better way to render this right?? -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<li
	{id}
	role="option"
	class={['command-item', className]}
	class:hidden={!isVisible}
	aria-selected={isSelected}
	data-selected={isSelected || undefined}
	data-value={value}
	style:order
	onmouseenter={(e) => commandState.onPointerMove(id, e)}
	onclick={() => {
		commandState.selectedIdState = id;
		onselect?.();
	}}
>
	{#if href}
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
		<a {href} class="command-item-link">
			{@render children?.()}
		</a>
	{:else}
		{@render children?.()}
	{/if}
</li>

<style>
	.command-item {
		--_command-item-padding: var(--command-item-padding, 0.5rem 0.75rem);
		--_command-item-border-radius: var(--command-item-border-radius, 0.375rem);
		--_command-item-gap: var(--command-item-gap, 0.5rem);

		position: relative;
		display: flex;
		align-items: center;
		gap: var(--_command-item-gap);
		padding: var(--_command-item-padding);
		border-radius: var(--_command-item-border-radius);
		cursor: pointer;
		content-visibility: auto;

		list-style: none;
		outline: none;

		&:has(.command-item-link) {
			padding: 0;
		}

		&.hidden {
			display: none;
		}

		&[data-selected] {
			background-color: var(--command-item-selected-background, oklch(93% 0.01 250));
		}
	}

	.command-item-link {
		display: flex;
		align-items: center;
		gap: var(--_command-item-gap);
		padding: var(--_command-item-padding);
		width: 100%;
		height: 100%;
		text-decoration: none;
		color: inherit;
		outline: none;
	}
</style>
