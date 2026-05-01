<script lang="ts">
	import Tooltip from '$components/Tooltip/Tooltip.svelte';
	import type { Snippet } from 'svelte';
	import ChevronRight from '~icons/lucide/chevron-right';
	import type { HTMLDetailsAttributes } from 'svelte/elements';
	import { getSidebarState } from './context';
	import Button from '$components/Button/Button.svelte';

	interface Props extends Omit<HTMLDetailsAttributes, 'children' | 'open' | 'title'> {
		title: Snippet | string;
		icon?: Snippet;
		children: Snippet;
		open?: boolean;
		collapsible?: boolean;
		tooltipContent?: Snippet | string;
	}

	let {
		title,
		icon,
		children,
		open = $bindable(false),
		collapsible = true,
		tooltipContent,
		class: className = '',
		...rest
	}: Props = $props();

	const sidebar = getSidebarState();

	// Bound to the Tooltip's popover element so we can imperatively show/hide it
	// from the summary's focus events. The Tooltip only renders when collapsed, so
	// this is null when the sidebar is expanded (the guards below handle that).
	let tooltipEl: HTMLElement | null = $state(null);

	function handleSummaryFocusin() {
		if (sidebar.collapsed && tooltipEl && !tooltipEl.matches(':popover-open')) {
			// Show immediately on keyboard focus — no delay, per WCAG best practice.
			tooltipEl.showPopover();
		}
	}

	function handleSummaryFocusout(e: FocusEvent) {
		if (!sidebar.collapsed || !tooltipEl) return;
		// Only hide if focus is moving entirely outside this element.
		// Covers the case where focus moves from summary to a child (unlikely
		// since the span has no tabindex, but defensive).
		const related = e.relatedTarget as Node | null;
		if (!(e.currentTarget as Element).contains(related)) {
			tooltipEl.hidePopover();
		}
	}
</script>

{#snippet GroupTitle()}
	{#if sidebar.collapsed && tooltipContent}
		<Tooltip
			bind:ref={tooltipEl}
			content={tooltipContent}
			position="right center"
			hasArrow={true}
			--popover-custom-fallbacks="none"
			--popover-trigger-width="100%"
		>
			{#snippet trigger({ props })}
				<span class="sidebar-group-title | flex-group nowrap" {...props as Record<string, unknown>}>
					{#if typeof title === 'string'}
						{title}
					{:else}
						{@render title()}
					{/if}
				</span>
			{/snippet}
		</Tooltip>
	{:else}
		<span class="sidebar-group-title | flex-group nowrap">
			{#if typeof title === 'string'}
				{title}
			{:else}
				{@render title()}
			{/if}
		</span>
	{/if}
{/snippet}

{#snippet Summary(collapsible: boolean)}
	<svelte:element
		this={collapsible ? 'summary' : 'button'}
		class="sidebar-group-summary | flex-group space-between nowrap"
		onfocusin={handleSummaryFocusin}
		onfocusout={handleSummaryFocusout}
	>
		{@render GroupTitle()}
		{#if collapsible && icon}
			{@render icon()}
		{:else if collapsible}
			<ChevronRight />
		{/if}
	</svelte:element>
{/snippet}

<svelte:element
	this={collapsible ? 'details' : 'div'}
	data-collapsible={collapsible}
	data-collapsed={sidebar.collapsed ? 'true' : undefined}
	{...rest}
	class={['sidebar-group', className]}
>
	{@render Summary(collapsible)}

	<ul role="list" class="sidebar-group-content">
		{@render children()}
	</ul>
</svelte:element>

<style lang="scss">
	@use '../../styles/abstracts/' as *;

	.sidebar-group {
		// --- User settings ---
		--sidebar-group-title-gap: 0.25rem;
		--sidebar-group-inset: -0.25rem;
		--sidebar-group-padding-block: 0.5rem;
		--sidebar-group-padding-inline: 0.25rem;
		--sidebar-group-gap: 0em;
		--sidebar-group-icon-size: 1rem;
		--sidebar-group-font-size: 0.875rem;
		--sidebar-group-border: solid;
		--sidebar-group-border-width: 1px;

		/*
		 * Gate: 0px at icon-rail width (collapsed), large when expanded.
		 * Used to switch between the centering formula and the user-defined value.
		 */
		--_G: max(0px, (100cqi - var(--sidebar-icons-only-width, 3rem)) * 9999);
		/*
		 * Centering padding: the inline padding required to center the icon within
		 * the icon rail, accounting for the section's own padding on each side.
		 */
		--_centered-inline: calc(
			(
					var(--sidebar-icons-only-width, 3rem) - 2 *
						var(--sidebar-section-padding-inline, 0.5rem) - var(--sidebar-group-icon-size, 1rem)
				) /
				2
		);
		--_sidebar-group-width: min(100%, 100cqi - (var(--sidebar-section-padding-inline, 0px) * 2));
		width: var(--_sidebar-group-width);
		overflow: hidden;
		padding-block: var(--sidebar-group-padding-block);
		/*
		 * Formula: user_padding + max(0, centered - user_padding - G)
		 *
		 * Collapsed (G = 0):  max(user_padding, centered)  → centers the icon
		 * Expanded  (G → ∞):  user_padding                 → user-defined value
		 * Sum equals width:   centered = user_padding       → no change
		 */
		padding-inline: calc(
			var(--sidebar-group-padding-inline) +
				max(0px, var(--_centered-inline) - var(--sidebar-group-padding-inline) - var(--_G))
		);

		transition: padding-inline 0.3s ease-in-out;
	}

	:global(.sidebar-group svg) {
		width: var(--sidebar-group-icon-size);
		aspect-ratio: 1/1;
		flex-shrink: 0;
		transition: rotate 0.3s ease-in;
	}

	.sidebar-group[data-collapsible='true'] > .sidebar-group-summary {
		cursor: pointer;
	}

	.sidebar-group-title {
		--flex-gap: var(--sidebar-group-title-gap);
	}

	.sidebar-group-summary {
		font-size: var(--sidebar-group-font-size);
		overflow: clip;
	}

	.sidebar-group-content {
		display: grid;
		gap: var(--sidebar-group-gap);
		padding-inline-start: calc(
			var(--sidebar-group-inset) + var(--sidebar-group-title-gap) + var(--sidebar-group-icon-size) /
				2
		);
		margin-inline: calc(
			(var(--sidebar-group-icon-size) / 2) - (var(--sidebar-group-border-width) / 2)
		);
		border-left-style: var(--sidebar-group-border);
		border-left-width: var(--sidebar-group-border-width);
		border-color: var(--sidebar-border);
		overflow-x: clip;
	}
</style>
