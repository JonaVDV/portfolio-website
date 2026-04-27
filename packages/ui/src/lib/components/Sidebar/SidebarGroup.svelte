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
			<ChevronRight/>
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
		--sidebar-group-title-gap: 0.25rem;
		--sidebar-group-inset: 0.5em;
		--sidebar-group-padding: 0.5rem 1rem;
		--sidebar-group-gap: 0.25em;
		--sidebar-group-icon-size: 1rem;
		--sidebar-group-border: solid;
		--sidebar-group-border-width: 1px;
		width: 100%;
		overflow: hidden;
		padding: var(--sidebar-group-padding);
	}

	:global(.sidebar-group svg) {
		width: var(--sidebar-group-icon-size);
		aspect-ratio: 1/1;
		flex-shrink: 0;
		transition: rotate 0.3s ease-in-out;
	}

	.sidebar-group[data-collapsible='true'] > .sidebar-group-summary {
		cursor: pointer;
	}

	.sidebar-group-content {
		display: grid;
		gap: var(--sidebar-group-gap);
		padding-inline-start: calc(var(--sidebar-group-inset) + (var(--sidebar-group-icon-size)));
		margin-inline: calc(
			(var(--sidebar-group-icon-size) / 2) - (var(--sidebar-group-border-width) / 2)
		);
		border-left-style: var(--sidebar-group-border);
		border-left-width: var(--sidebar-group-border-width);
		border-color: var(--sidebar-border);
	}
</style>
