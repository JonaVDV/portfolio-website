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

<svelte:window on:keydown={handleEscape} />

<aside
	class="sidebar"
	bind:this={ref}
	data-collapsible={collapsible}
	data-collapsed={sidebar.collapsed}
>
	{@render header?.()}
	<div>
		{@render children?.()}
	</div>
	{@render footer?.()}
</aside>
<div class="sidebar-overlay" aria-hidden="true" onclick={() => (sidebar.collapsed = true)}></div>

<style lang="scss">
	@use '../../styles/abstracts' as *;

	@property --sidebar-icon-width {
		syntax: '<length>';
		inherits: false;
		initial-value: 3rem;
	}

	@property --sidebar-max-width {
		syntax: '<length>';
		inherits: false;
		initial-value: 16rem;
	}

	aside[data-collapsible='off-canvas'] {
		&[data-collapsed='true'] {
			position: fixed;
			inset-block: 0;
			translate: -100% 0;
		}
	}

	aside[data-collapsible='icons-only'] {
		&[data-collapsed='true'] {
			max-width: var(--sidebar-icon-width, 3rem);
			overflow-x: hidden;
		}
	}

	@media (max-width: 820px) {
		aside:not([data-collapsible='none']) {
			position: fixed;
			inset-block: 0;
			grid-template-rows: min-content 1fr min-content;

			&[data-collapsed='true'] {
				translate: -100% 0;
				max-width: unset;
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

	aside {
		--sidebar-background: #{$clr-surface-100};
		--sidebar-transition: 0.3s ease-in-out;

		display: grid;
		background-color: var(--sidebar-background);
		grid-template-rows: subgrid;
		transition: translate var(--sidebar-transition);
		position: sticky;
		top: 0;
		overflow-y: auto;
		z-index: 2;
		anchor-name: --sidebar;
	}
</style>
