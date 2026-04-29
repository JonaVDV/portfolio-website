<script lang="ts">
	import type { PopoverPosition } from '$components/Popover/popover.svelte';
	import Popover from '$components/Popover/popover.svelte';
	import type { ComponentProps, Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends Omit<ComponentProps<typeof Popover>, 'position'> {
		content: string | Snippet;
		position?: PopoverPosition;
	}

	let {
		children: childrenProp,
		trigger: triggerProp,
		content,
		position,
		hasArrow = false,
		ref = $bindable(null),
		...rest
	}: Props = $props();
</script>

<Popover bind:ref {position} {hasArrow} {...rest}>
	{#snippet trigger({ props })}
		{@render triggerProp({
			props
		})}
	{/snippet}
	<div class="dropdown-menu-content" role="menu">
		{@render childrenProp?.()}
	</div>
</Popover>

<style>
	.dropdown-menu-content :global(:where(svg)) {
		width: var(--icon-size);
		flex-shrink: 0;
		aspect-ratio: 1/1;
	}
</style>
