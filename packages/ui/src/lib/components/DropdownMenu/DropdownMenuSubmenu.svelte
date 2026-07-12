<script lang="ts">
	import Popover from '$components/Popover/Popover.svelte';
	import { focusgroup } from '$lib/utils/focusgroup.svelte.js';
	import type { Snippet } from 'svelte';

	interface Props {
		/**
		 * The label displayed in the trigger list item. Accepts a string or a snippet
		 * for richer content (e.g. with an icon).
		 */
		label: string | Snippet;
		children?: Snippet;
		/**
		 * Preferred position of the submenu relative to the trigger item.
		 * Defaults to opening to the right, aligned with the top of the trigger.
		 */
		position?: string;
		/**
		 * A reference to the popover content element. Useful for programmatic control.
		 */
		ref?: HTMLElement | null;
	}

	let { label, children, position = 'right', ref = $bindable(null), ...rest }: Props = $props();

	let triggerEl: HTMLButtonElement | null = $state(null);

	// Keyboard bridge between the parent menu's focusgroup and this submenu's
	// (the focusgroup explainer leaves parent<->child traversal to the app, since
	// each nested scope is independent). The menu axis is block (up/down), so the
	// inline arrows are free for APG submenu semantics.
	// ponytail: physical Right/Left; swap for RTL if the library ever goes logical.
	function openSubmenu() {
		ref?.showPopover();
		ref?.querySelector<HTMLElement>('[role^="menuitem"], button, a[href], [tabindex]')?.focus();
	}
	function closeSubmenu() {
		ref?.hidePopover();
		triggerEl?.focus();
	}
</script>

<!--
	The <li> is the element that participates in the parent menu's grid and flow.
	Placing the Popover component *inside* the <li> means <button[popovertarget]>
	and <div[popover]> are siblings within the <li>. This satisfies the Popover
	component's `:has([popovertarget] + [popover])` anchor-scope selector, correctly
	scoping `--component-popover` to this submenu without conflicting with parent
	or sibling menus.

	Layout: as a <li> it sits in the `content` column automatically. The nested
	popover content establishes its own `.layout` grid, so the same full-width vs
	content-width pattern composes recursively.

	Hover opening: one tiny event listener shows the popover on mouseenter so
	mouse users don't have to click. The native `popover="auto"` handles
	closing when focus or a click moves away.
-->
<li
	class="flex-group | nowrap | dropdown-submenu-trigger"
	role="presentation"
	onmouseenter={() => ref?.showPopover()}
	onmouseleave={(e) => {
		// Keep the submenu open if the pointer moved into the popover itself.
		if (!ref?.contains(e.relatedTarget as Node)) {
			ref?.hidePopover();
		}
	}}
>
	<Popover
		bind:ref
		{position}
		hasArrow={false}
		{...rest}
		--popover-offset="0px"
		--popover-background="var(--dropdown-submenu-background, var(--dropdown-menu-background, #000))"
		--popover-color="var(--dropdown-submenu-color, var(--dropdown-menu-color, #fff))"
		--popover-border="var(--dropdown-submenu-border, var(--dropdown-menu-border, 1px solid color-mix(in oklab, var(--dropdown-menu-color, #fff) 35%, transparent)))"
		--popover-border-radius="var(--dropdown-submenu-border-radius, var(--dropdown-menu-border-radius, 1rem))"
		--popover-padding="var(--dropdown-submenu-padding, var(--dropdown-menu-padding, 0.5rem))"
	>
		{#snippet trigger({ props })}
			<button
				role="menuitem"
				aria-haspopup="menu"
				{...props}
				bind:this={triggerEl}
				onkeydown={(e) => {
					if (e.key === 'ArrowRight') {
						e.preventDefault();
						openSubmenu();
					}
				}}
				class="dropdown-submenu-button | flex-group nowrap"
			>
				{#if typeof label === 'string'}
					{label}
				{:else}
					{@render label()}
				{/if}
				<!-- CSS-generated chevron: no icon import needed -->
				<span class="dropdown-submenu-arrow" aria-hidden="true"></span>
			</button>
		{/snippet}

		<!-- New `.layout` grid: the same full-width/content-width pattern
		     applies inside the submenu exactly as in the top-level dropdown.
		     Its own focusgroup makes arrow keys work once focus is inside. -->
		<div
			class="dropdown-submenu-content | layout"
			role="menu"
			onkeydown={(e) => {
				if (e.key === 'ArrowLeft') {
					e.preventDefault();
					closeSubmenu();
				}
			}}
			{@attach focusgroup({ behavior: 'menu' })}
		>
			{@render children?.()}
		</div>
	</Popover>
</li>

<style>
	li {
		/* Shares the same public API as dropdown-item, so a single consumer
		   override (e.g. --dropdown-item-hover-background) themes both. */
		--_dropdown-item-padding: var(--dropdown-item-padding, 0.5rem);
		--_dropdown-item-border-radius: var(--dropdown-item-border-radius, 0.5rem);
		--_dropdown-item-background: var(--dropdown-item-background, transparent);
		--_dropdown-item-color: var(--dropdown-item-color, inherit);
		--_dropdown-item-font-size: var(--dropdown-item-font-size, 0.875rem);

		--_dropdown-item-hover-background: var(--dropdown-item-hover-background, oklch(0.269 0 0));
		--_dropdown-item-hover-color: var(--dropdown-item-hover-color, oklch(0.985 0 0));

		--_flex-container-width: 100%;

		--popover-custom-fallbacks: right span-bottom, left span-bottom;

		border-radius: var(--_dropdown-item-border-radius);
		background-color: var(--_dropdown-item-background);
		color: var(--_dropdown-item-color);
		width: 100%;
		font-size: var(--_dropdown-item-font-size);

		&:is(:hover, :focus-within) {
			--_dropdown-item-background: var(--_dropdown-item-hover-background);
			--_dropdown-item-color: var(--_dropdown-item-hover-color);
		}
	}

	/* The button fills the full <li>, making the entire row clickable */
	.dropdown-submenu-button {
		--_flex-container-width: 100%;
		all: unset;
		display: flex;
		align-items: center;
		width: 100%;
		padding: var(--_dropdown-item-padding);
		cursor: default;
		font-size: inherit;
	}

	/* CSS triangle chevron — no SVG/icon dependency */
	.dropdown-submenu-arrow {
		margin-inline-start: auto;
		display: inline-block;
		width: 0;
		height: 0;
		border-block: 0.3em solid transparent;
		border-inline-start: 0.4em solid currentColor;
		flex-shrink: 0;
	}

	.dropdown-submenu-content :global(:where(svg)) {
		width: var(--icon-size);
		flex-shrink: 0;
		aspect-ratio: 1/1;
	}
</style>
