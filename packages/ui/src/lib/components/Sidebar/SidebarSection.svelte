<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/**
		 * The visible label for this section. Accepts a plain string or a snippet
		 * for custom markup. When `labelHidden` is true the label is visually
		 * hidden but still read by screen readers via `aria-labelledby`.
		 */
		label: string | Snippet;
		/**
		 * Visually hides the label while keeping it in the accessibility tree so
		 * screen reader users can still identify the section. Useful for icon-only
		 * contexts where the visual label would be redundant.
		 */
		labelHidden?: boolean;
		children?: Snippet;
		action?: Snippet;
	}

	import { getSidebarState } from './context';

	const sidebar = getSidebarState();

	let { label, labelHidden = false, children, action }: Props = $props();

	const id = $props.id();
</script>

<section
	class="sidebar-section"
	aria-labelledby="sidebar-section-label-{id}"
	data-collapsed={sidebar.collapsed}
>
	<span
		id="sidebar-section-label-{id}"
		class="sidebar-section-label"
		class:visually-hidden={labelHidden}
	>
		{#if typeof label === 'string'}
			{label}
		{:else}
			{@render label()}
		{/if}

		{@render action?.()}
	</span>
	<ul role="list" class="sidebar-section-content">
		{@render children?.()}
	</ul>
</section>

<style lang="scss">
	.sidebar-section {
		--_sidebar-section-padding-inline: var(--sidebar-section-padding-inline, 0.5rem);
		display: grid;
		gap: var(--sidebar-section-gap, 0.25rem);
		padding-block: var(--sidebar-section-padding-block, 0.75rem);
		/*
		 * Same gate as SidebarItem: collapses inline padding to zero at
		 * icon-rail width, preserving user-set value when expanded.
		 */
		padding-inline: var(--_sidebar-section-padding-inline);
	}

	.sidebar-section-label {
		font-size: var(--sidebar-section-label-size, 0.6875rem);
		font-weight: var(--sidebar-section-label-weight, 600);
		color: var(--sidebar-section-label-color, oklch(0.55 0 0));
		letter-spacing: var(--sidebar-section-label-tracking, 0.05em);
		text-transform: uppercase;
		white-space: nowrap;
		overflow: clip;
		margin: 0;
		text-overflow: ellipsis;
		/*
		 * Optional inset so the label aligns visually with item text
		 * (items carry their own padding-inline, so this nudge is separate).
		 */
		padding-inline-start: min(
			var(--sidebar-section-label-inset, 0.25rem),
			max(0px, (100cqi - var(--sidebar-icons-only-width, 3rem)) * 9999)
		);
		visibility: visible;
		transition-property: margin-block-start, opacity, visibility;
		transition-duration: var(--sidebar-transition-duration);
		/*
		 * Enter: visibility snaps visible immediately so the fade-in is seen.
		 * (Exit delay is set on the collapsed state below.)
		 */
		transition-delay: 0s;
	}

	[data-collapsed='true'] .sidebar-section-label {
		margin-block-start: -1.5rem;
		opacity: 0;
		visibility: hidden;
		/*
		 * Exit: margin and opacity animate first; visibility only becomes hidden
		 * after the transition completes so the element never obstructs pointers
		 * or receives selection while the fade is playing.
		 */
		transition-delay: 0s, 0s, var(--sidebar-transition-duration);
	}

	.sidebar-section-content {
		width: min(100%, 100cqi - (var(--_sidebar-section-padding-inline, 0px) * 2));
	}

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
		border: 0;
	}
</style>
