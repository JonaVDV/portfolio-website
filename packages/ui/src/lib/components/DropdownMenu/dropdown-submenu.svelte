<script lang="ts">
	import Popover from '$components/Popover/popover.svelte';
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

	let {
		label,
		children,
		position = 'right',
		ref = $bindable(null),
		...rest
	}: Props = $props();
</script>

<!--
	The <li> is the element that participates in the parent menu's grid and flow.
	Placing the Popover component *inside* the <li> means <button[popovertarget]>
	and <div[popover]> are siblings within the <li>. This satisfies the Popover
	component's `:has([popovertarget] + [popover])` anchor-scope selector, correctly
	scoping `--component-popover` to this submenu without conflicting with parent
	or sibling menus.

	Layout: as a <li> it sits in the `popover-content` column automatically.
	The nested popover content establishes its own `popover-layout` grid, so
	the same full-width vs content-width pattern composes recursively.

	Hover opening: one tiny event listener shows the popover on mouseenter so
	mouse users don't have to click. The native `popover="auto"` handles
	closing when focus or a click moves away.
-->
<li
	class="flex-group | nowrap | dropdown-submenu-trigger"
	role="menuitem"
	aria-haspopup="menu"
	onmouseenter={() => ref?.showPopover()}
	onmouseleave={(e) => {
		// Keep the submenu open if the pointer moved into the popover itself.
		if (!ref?.contains(e.relatedTarget as Node)) {
			ref?.hidePopover();
		}
	}}
>
	<Popover bind:ref {position} hasArrow={false} {...rest} --popover-offset="16px">
		{#snippet trigger({ props })}
			<button type="button" {...props} class="dropdown-submenu-button | flex-group nowrap">
				{#if typeof label === 'string'}
					{label}
				{:else}
					{@render label()}
				{/if}
				<!-- CSS-generated chevron: no icon import needed -->
				<span class="dropdown-submenu-arrow" aria-hidden="true"></span>
			</button>
		{/snippet}

		<!-- New popover-layout grid: the same full-width/content-width pattern
		     applies inside the submenu exactly as in the top-level dropdown. -->
		<div class="dropdown-submenu-content | popover-layout" role="menu">
			{@render children?.()}
		</div>
	</Popover>
</li>

<style lang="scss">
	li {
		--dropdown-item-padding: 0.5rem;
		--dropdown-border-radius: 0.5rem;
		--dropdown-item-background: transparent;
		--dropdown-item-color: inherit;

		--dropdown-item-hover-background: oklch(0.269 0 0);
		--dropdown-item-hover-color: oklch(0.985 0 0);
		--dropdown-item-font-size: 0.875rem;

		--_flex-container-width: 100%;

		border-radius: var(--dropdown-border-radius);
		background-color: var(--dropdown-item-background);
		color: var(--dropdown-item-color);
		font-size: var(--dropdown-item-font-size);

		&:is(:hover, :focus-within) {
			--dropdown-item-background: var(--dropdown-item-hover-background);
			--dropdown-item-color: var(--dropdown-item-hover-color);
		}
	}

	/* The button fills the full <li>, making the entire row clickable */
	.dropdown-submenu-button {
		--_flex-container-width: 100%;
		all: unset;
		display: flex;
		align-items: center;
		width: 100%;
		padding: var(--dropdown-item-padding);
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
