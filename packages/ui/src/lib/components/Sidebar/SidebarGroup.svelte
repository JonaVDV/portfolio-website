<script lang="ts">
	import Tooltip from '$components/Tooltip/Tooltip.svelte';
	import type { Snippet } from 'svelte';
	import ChevronRight from '~icons/lucide/chevron-right';
	import type { HTMLDetailsAttributes } from 'svelte/elements';
	import { getSidebarState } from './context';

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
	const groupTooltipContent = $derived(tooltipContent ?? title);
</script>

{#snippet GroupTitle()}
	{#if sidebar.collapsed && tooltipContent}
		<Tooltip
			content={tooltipContent}
			position="right"
			hasArrow={true}
			skipDelayDuration={0}
			--popover-trigger-width="100%"
		>
			{#snippet trigger({ props })}
				{@const neededProps = {
					popovertarget: props.popovertarget,
					onpointerenter: props.onpointerenter,
					onpointerleave: props.onpointerleave
				}}
				<span class="sidebar-group-title sidebar-group-tooltip-trigger" {...neededProps}>
					{#if typeof title === 'string'}
						<span>
							{title}
						</span>
					{:else}
						<span>
							{@render title()}
						</span>
					{/if}
				</span>
			{/snippet}
		</Tooltip>
	{:else}
		<span class="sidebar-group-title">
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
		--sidebar-group-title-gap: 0.25rem;
		--sidebar-group-inset: 0.5em;
		--sidebar-group-padding: 0.5rem 1rem;
		--sidebar-group-gap: 0.25em;
		--sidebar-group-icon-size: 1rem;
		--sidebar-group-border: solid;
		--sidebar-group-border-width: 1px;
		width: 100%;
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

	.sidebar-group-summary:is(:where(.group)[data-collapsible="icons-only"] *) {
		width: var(--sidebar-group-icon-size);
		aspect-ratio: 1/1;
		overflow: hidden;

	}

	// :global .sidebar-group[data-collapsed='true'] > .sidebar-group-summary {
	// 	width: var(--sidebar-group-icon-size);
	// 	aspect-ratio: 1/1;
	// }

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
