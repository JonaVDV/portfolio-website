<script lang="ts">
	import { Item } from '$components/Item';
	import { onMount, type Snippet } from 'svelte';
	import { CommandContext } from './command.svelte';

	interface Props {
		children?: Snippet;
		class?: string;
	}

	const [getCommandState] = CommandContext;
	const commandState = getCommandState();

	const id = $props.id();

	onMount(() => {
		commandState.registerItem(id);
	});

	let { children, class: className }: Props = $props();
</script>

<div style="display: contents;" class="command-item-wrapper">
	<Item as="li" role="option" class={className}>
		{@render children?.()}
	</Item>
</div>

<style>
	.command-item-wrapper {
		--item-gap: var(--item-gap, var(--command-item-gap, 0.5rem));

		/* mirror the props from the item component */
		--item-background: var( var(--command-item-background, transparent));
		--item-background-base: var( var(--command-item-background, transparent));
		--item-padding: var(--command-item-padding, 0.5rem .25rem);
		--item-border-radius: var(--command-item-border-radius, 0.5rem);
		--item-border-width: var(--command-item-border-width, 0px);
		--item-border-color: var(--command-item-border-color, oklch(73.481% 0.00008 271.152));
		--item-color: var( var(--command-item-color, currentColor));
	}
</style>
