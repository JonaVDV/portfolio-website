<script lang="ts">
	import Tooltip from '$components/Tooltip/Tooltip.svelte';
	import type { Snippet } from 'svelte';
	import ChevronRight from '~icons/lucide/chevron-right';
	import type { HTMLButtonAttributes, HTMLDetailsAttributes } from 'svelte/elements';
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

	// Bound to the Tooltip's popover element so we can imperatively read its id
	// for aria-describedby. The Tooltip only renders when collapsed, so this is
	// null when expanded.
	let tooltipEl: HTMLElement | null = $state(null);

	// Reactive ID used for aria-describedby on the summary. Automatically becomes
	// undefined when tooltipEl is null (sidebar expanded, Tooltip unmounted).
	const tooltipId = $derived.by(() => tooltipEl?.id);
</script>

{#snippet Summary(collapsible: boolean, props: HTMLButtonAttributes)}
	<svelte:element
		this={collapsible ? 'summary' : 'button'}
		class="sidebar-group-summary | flex-group push-last nowrap"
		aria-describedby={tooltipId}
		{...props}
	>
		{#if typeof title === 'string'}
			{title}
		{:else}
			{@render title()}
		{/if}
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
	style:--popover-custom-fallbacks="none"
>
	{#if sidebar.collapsed && tooltipContent}
		<Tooltip bind:ref={tooltipEl} content={tooltipContent} position="right center" hasArrow={true}>
			{#snippet trigger({ props })}
				{@render Summary(collapsible, props)}
			{/snippet}
		</Tooltip>
	{:else}
		{@render Summary(collapsible, {})}
	{/if}
	<div class="sidebar-group-details-content">
		<ul role="list" class="sidebar-group-content">
			{@render children()}
		</ul>
	</div>
</svelte:element>

<style lang="scss">
	@use '../../styles/abstracts/' as *;

	.sidebar-group {
		// --- User settings ---
		--sidebar-group-title-gap: 0.25rem;
		--sidebar-group-inset: -0.25rem;
		--sidebar-group-padding-block: 0.5rem;
		--sidebar-group-padding-inline: 0.5rem;
		--sidebar-group-gap: 0em;
		--sidebar-group-icon-size: 1rem;
		--sidebar-group-font-size: 0.875rem;
		--sidebar-group-border: solid;
		--sidebar-group-border-radius: 0.75rem;
		--sidebar-group-background: transparent;
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
	}

	:global(.sidebar-group svg) {
		width: var(--sidebar-group-icon-size);
		aspect-ratio: 1/1;
		flex-shrink: 0;
		transition: rotate 0.3s ease-in;
	}

	.sidebar-group[data-collapsible='true'] .sidebar-group-summary {
		cursor: pointer;
	}

	details::details-content {
		content-visibility: visible;
	}

	details:not([open]) .sidebar-group-details-content {
		content-visibility: hidden;
	}

	details[open] .sidebar-group-details-content {
		content-visibility: revert;
	}

	.sidebar-group-summary {
		/*
		 * Full width so the hover background spans the entire rail width, not
		 * just the content width. Needed for <button> (inline by default) and
		 * ensures <summary> also fills the group correctly.
		 */
		width: 100%;
		font-size: var(--sidebar-group-font-size);
		line-height: 1;
		/*
		 * clip instead of hidden: avoids creating a new BFC (which would break
		 * positioned children like the popover tooltip) while still clipping
		 * the title text to the content box in icon-only mode.
		 */
		overflow: clip;
		padding-block: var(--sidebar-group-padding-block);
		/*
		 * Formula: user_padding + max(0, centered - user_padding - G)
		 *
		 * Collapsed (G = 0):  max(user_padding, centered)  → centers the icon
		 * Expanded  (G → ∞):  user_padding                 → user-defined value
		 * Sum equals width:   centered = user_padding       → no change
		 *
		 * --_G and --_centered-inline are defined on .sidebar-group and
		 * inherited here, so the formula works without duplication.
		 */
		padding-inline: calc(
			var(--sidebar-group-padding-inline) +
				max(0px, var(--_centered-inline) - var(--sidebar-group-padding-inline) - var(--_G))
		);
		border-radius: var(--sidebar-group-border-radius);
		transition:
			padding-inline 0.3s ease-in-out,
			background-color 0.2s ease;

		&:is(:hover, :focus-visible) {
			background-color: var(--clr-surface-300);
		}
	}

	.sidebar-group-content {
		display: grid;
		gap: var(--sidebar-group-gap);
		padding-inline-start: calc(
			var(--sidebar-group-inset) + var(--sidebar-group-title-gap) + var(--sidebar-group-icon-size) /
				2
		);
		margin-inline: calc(
			(var(--sidebar-group-padding-inline) + var(--sidebar-group-icon-size) / 2) -
				(var(--sidebar-group-border-width) / 2)
		);
		border-left-style: var(--sidebar-group-border);
		border-left-width: var(--sidebar-group-border-width);
		border-color: var(--sidebar-border);
		overflow-x: clip;
	}
</style>
