<script lang="ts">
	import Popover from '$components/Popover/popover.svelte';
	import { focusgroup } from '$lib/utils/focusgroup.svelte.js';
	import type { ComponentProps, Snippet } from 'svelte';

	interface Props extends ComponentProps<typeof Popover> {
		content?: string | Snippet;
		position?: string;
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

	// Move keyboard focus into the menu when it opens, so arrow navigation works
	// immediately. The native popover keeps Esc / light-dismiss for closing.
	function focusFirstItem(event: ToggleEvent) {
		if (event.newState !== 'open') return;
		ref?.querySelector<HTMLElement>('button, a[href], input:not([disabled]), [tabindex]')?.focus();
	}
</script>

<!--
	The menu's visual surface is the Popover content box. We map a dropdown-named
	API onto the generic --popover-* hooks here, with the same subtle default
	border the submenu uses so the two read as distinct stacked surfaces.
-->
<Popover bind:ref {position} {hasArrow} ontoggle={focusFirstItem} {...rest}>
	{#snippet trigger({ props })}
		{@render triggerProp({
			props
		})}
	{/snippet}
	<div
		class="dropdown-menu-content | layout"
		role="menu"
		{@attach focusgroup({ behavior: 'menu' })}
	>
		{@render childrenProp?.()}
	</div>
</Popover>

<style>
	.dropdown-menu-content :global(:where(svg)) {
		--popover-background: var(--dropdown-menu-background, #000);
		--popover-color: var(--dropdown-menu-color, #fff);
		--popover-border: var(
			--dropdown-menu-border,
			1px solid color-mix(in oklab, var(--dropdown-menu-color, #fff) 18%, transparent)
		);
		--popover-border-radius: var(--dropdown-menu-border-radius, 1rem);
		--popover-padding: var(--dropdown-menu-padding, 0.5rem);
		width: var(--icon-size);
		flex-shrink: 0;
		aspect-ratio: 1/1;
	}
</style>
