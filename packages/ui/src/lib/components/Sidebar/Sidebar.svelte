<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getSidebarState } from './context';

	interface Props {
		header?: Snippet;
		footer?: Snippet;
		children?: Snippet;
		collapsible?: 'icons-only' | 'off-canvas' | 'none';
		ref?: HTMLElement | null;
	}

	const sidebar = getSidebarState();

	const handleEscape = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			sidebar.collapsed = true;
		}
	};

	let {
		children,
		header,
		footer,
		collapsible = 'icons-only',
		ref = $bindable(null)
	}: Props = $props();
</script>

<svelte:window onkeydown={handleEscape} />

<aside
	class="sidebar padding-breakout"
	bind:this={ref}
	data-collapsible={collapsible}
	data-collapsed={sidebar.collapsed}
>
	<div class="sidebar-inner">
		{@render header?.()}
		<div class="sidebar-main">
			{@render children?.()}
		</div>
		{@render footer?.()}
	</div>
</aside>
<div class="sidebar-overlay" aria-hidden="true" onclick={() => (sidebar.collapsed = true)}></div>

<style lang="scss">
	@use '../../styles/abstracts' as *;

	aside[data-collapsible='off-canvas'] {
		&[data-collapsed='true'] {
			position: fixed;
			inset-block: 0;
			translate: -100% 0;
		}
	}

	.sidebar-inner {
		grid-column: full-width;
		display: flex;
		flex-direction: column;
	}

	.sidebar-main {
		/*
		 * flex: 1 grows this region to fill all leftover height between header
		 * and footer, which pins the footer to the bottom.
		 */
		flex: 1;
	}

	/* Icons-only: Minimize to icon width when collapsed */
	aside[data-collapsible='icons-only'] {
		&[data-collapsed='true'] {
			max-width: var(--sidebar-icon-width, 3rem);
			overflow-x: hidden;
		}
	}

	// this should be the same breakpoint as the one used in the Shell component for the mobile sidebar behavior
	@media (max-width: 48rem) {
		aside:not([data-collapsible='none']) {
			position: fixed;
			inset-block: 0;
			min-width: var(--sidebar-max-width);

			&[data-collapsed='true'] {
				translate: -100% 0;
			}
		}

		aside[data-collapsed='false'] + .sidebar-overlay {
			display: block;
		}
	}
	.sidebar-overlay {
		--overlay-background: black;
		--overlay-opacity: 0.5;
		display: none;
		position: fixed;
		inset: 0;
		
		z-index: var(--sidebar-overlay-z-index, 1);
		background-color: oklch(from var(--overlay-background) l c h / var(--overlay-opacity));
	}

	aside[data-collapsible='off-canvas'][data-collapsed='true'] + .sidebar-overlay {
		display: block;
	}

	aside {
		--sidebar-background: #{$clr-surface-100};
		--sidebar-transition-duration: 0.3s;
		--sidebar-transition-easing: ease-in-out;
		--sidebar-transition: var(--sidebar-transition-duration) var(--sidebar-transition-easing);
		--popover-trigger-width: 100%;
		display: grid;
		background-color: var(--sidebar-background);
		transition:
			translate var(--sidebar-transition),
			max-width var(--sidebar-transition);

		@media (prefers-reduced-motion: reduce) {
			--sidebar-transition-duration: 0.01ms;
		}
		position: sticky;
		container: sidebar / inline-size;
		max-width: var(--sidebar-max-width);
		/*
		 * Must be above the overlay (--sidebar-overlay-z-index, default 1).
		 * These values are small because .primary-layout uses isolation: isolate,
		 * scoping them to the layout's own stacking context.
		 */
		z-index: var(--sidebar-z-index, 2);
		isolation: isolate;
		inset: 0;
		scrollbar-gutter: stable;
		scrollbar-width: thin;
		overflow-y: auto;
		// we need 100svh here to ensure the sidebar takes up the full height of the viewport, but stays scrollable when the content exceeds the viewport height. This is especially important for mobile devices where the viewport height can change when the address bar shows/hides.
		height: 100svh;
		anchor-name: --sidebar;
	}
</style>
