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
	class="sidebar"
	bind:this={ref}
	data-collapsible={collapsible}
	data-collapsed={sidebar.collapsed}
>
	<div>
		{@render header?.()}
	</div>
	<div class="sidebar-content">
		{@render children?.()}
	</div>
	<div>
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

	/* Icons-only: Minimize to icon width when collapsed */
	aside[data-collapsible='icons-only'] {
		&[data-collapsed='true'] {
			width: var(--sidebar-icon-width, 3rem);
			overflow-x: hidden;
		}
	}

	// this should be the same breakpoint as the one used in the Shell component for the mobile sidebar behavior
	@media (max-width: 48rem) {
		aside:not([data-collapsible='none']) {
			position: fixed;
			inset-block: 0;
			grid-template-rows: min-content 1fr min-content;
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
		z-index: 1;
		background-color: oklch(from var(--overlay-background) l c h / var(--overlay-opacity));
	}

	aside[data-collapsible='off-canvas'][data-collapsed='true'] + .sidebar-overlay {
		display: block;
	}

	aside > div {
		width: inherit;
	}

	aside {
		--sidebar-background: #{$clr-surface-100};
		--sidebar-transition: 0.3s ease-in-out;

		display: grid;
		background-color: var(--sidebar-background);
		grid-template-rows: min-content 1fr min-content;
		transition: translate var(--sidebar-transition) max-width var(--sidebar-transition);
		position: sticky;
		width: var(--sidebar-active-width);
		top: 0;
		overflow: auto;
		z-index: 2;
		// we need 100svh here to ensure the sidebar takes up the full height of the viewport, but stays scrollable when the content exceeds the viewport height. This is especially important for mobile devices where the viewport height can change when the address bar shows/hides.
		scrollbar-gutter: stable;
		scrollbar-width: thin;
		height: 100svh;
		anchor-name: --sidebar;
	}
</style>
