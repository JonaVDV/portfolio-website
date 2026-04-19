<script lang="ts">
	import { setSidebarState } from '$components/Sidebar/context';
	import type { Snippet } from 'svelte';

	interface Props {
		modules?: ('content' | 'sidebar' | 'header')[];
		header?: Snippet<
			[
				{
					toggleSidebar: () => void;
				}
			]
		>;
		sidebar?: Snippet;
		children?: Snippet;
	}

	let { modules = ['content'], sidebar, children, header }: Props = $props();

	const sidebarState = $state({
		collapsed: false,
		toggle() {
			this.collapsed = !this.collapsed;
		},
		setCollapsed(value: boolean) {
			this.collapsed = value;
		}
	});

	function toggleSidebar() {
		sidebarState.collapsed = !sidebarState.collapsed;
	}

	setSidebarState(sidebarState);
</script>

<div
	class={['primary-layout', modules.includes('sidebar') ? 'with-sidebar' : '']}
	data-sidebar-collapsed={sidebarState.collapsed}
>
	{#if modules.includes('header')}
		{@render header?.({
			toggleSidebar
		})}
	{/if}
	{#if !modules.includes('sidebar') && !modules.includes('content')}
		{@render children?.()}
	{/if}
	{#if modules.includes('sidebar')}
		{@render sidebar?.()}
	{/if}
	{#if modules.includes('content')}
		{@render children?.()}
	{/if}
</div>

<style lang="scss">
	:global {
		.primary-layout > *,
		.primary-layout-sidebar > *:not(aside),
		.full-width > * {
			grid-column: content;
		}
		.primary-layout,
		.full-width {
			--minimum-content-padding: 2rem;
			--sidebar-mobile-breakpoint: 48rem;

			/** TRACK WIDTHS **/
			--full-max-width: 1fr;
			--content-max-width: 65ch;
			--sidebar-icons-only-width: 3rem;
			--sidebar-max-width: 16rem;

			/*
			 * Formula strategy:
			 * 1) Build a breakpoint "gate" that behaves like a switch:
			 *    - 0 below the breakpoint
			 *    - very large above the breakpoint (then capped to 100cqi)
			 * 2) Clamp expanded/collapsed sidebar widths against that gate.
			 * 3) Derive content width from container width minus active sidebar minus both side paddings.
			 *
			 * This keeps Shell media-query free while still matching responsive sidebar behavior.
			 */
			--sidebar-breakpoint-gate: min(
				max(0px, (100cqi - var(--sidebar-mobile-breakpoint)) * 9999),
				100cqi
			);
			--sidebar-expanded-width: min(var(--sidebar-max-width), var(--sidebar-breakpoint-gate));
			--sidebar-collapsed-width: min(
				var(--sidebar-icons-only-width),
				var(--sidebar-breakpoint-gate)
			);
			--sidebar-active-width: var(--sidebar-expanded-width);

			/** TRACK SIZES **/
			--sidebar: minmax(0px, var(--sidebar-active-width));
			--full: minmax(min(var(--minimum-content-padding), 100cqi), var(--full-max-width));
			/* Content = container inline size - active sidebar - left/right padding */
			--content-available-inline-size: calc(
				100cqi - var(--sidebar-active-width) - var(--minimum-content-padding) * 2
			);
			/* readable max, but never less than 0 */
			--content: min(var(--content-max-width), max(0px, var(--content-available-inline-size)));

			display: grid;
			/* prettier-ignore */
			grid-template-columns: 
			[full-width-start]
			
			var(--full)
				[content-start]
				var(--content)
				[content-end]
			var(--full)
			[full-width-end];
		}
	}

	.primary-layout {
		min-block-size: 100svh;
		container: primary-layout / inline-size;
		grid-template-rows: min-content 1fr;
	}

	.with-sidebar[data-sidebar-collapsed='true'] {
		--sidebar-active-width: var(--sidebar-collapsed-width);
	}

	.with-sidebar {
		/* prettier-ignore */
		grid-template-columns:
        [sidebar] var(--sidebar)
        [full-width-start] 
            var(--full) 
                [content-start] 
                    var(--content) 
                [content-end] 
            var(--full) 
        [full-width-end];
	}

	.with-sidebar > :global(aside) {
		--sidebar-icon-width: var(var(--sidebar-icons-only-width));
		grid-column: sidebar;
		grid-row: 1 / -1;
	}

	/** CLASSES **/
	:global {
		.full {
			grid-column: full-width;
		}
		.full-start {
			grid-column-start: full-width-start;
		}
		.full-end {
			grid-column-end: full-width-end;
		}

		.content {
			grid-column: content;
		}
		.content-start {
			grid-column-start: content-start;
		}
		.content-end {
			grid-column-end: content-end;
		}

		.full-width {
			grid-column: full-width;
		}
		.full-content,
		.full-content-nopadding {
			grid-column: full-width;
		}
		.full-content {
			padding-inline: var(--minimum-content-padding);
		}
	}
</style>
