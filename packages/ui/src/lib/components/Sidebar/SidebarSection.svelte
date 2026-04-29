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

	let { label, labelHidden = false, children, action }: Props = $props();

	const id = $props.id();
</script>

<section class="sidebar-section" aria-labelledby="sidebar-section-label-{id}">
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
		--sidebar-section-padding-inline: 0.5rem;
		/*
		 * Gated: collapses to 0 at icon-rail width. Defining this as a separate
		 * variable lets children reference the live computed value in their own
		 * 100cqi-based width formulas so the 100cqi-indent arithmetic produces
		 * the full rail width (not a reduced one) when fully collapsed.
		 */
		--_sidebar-section-indent: min(
			var(--sidebar-section-padding-inline),
			max(0px, (100cqi - var(--sidebar-icons-only-width, 3rem)) * 9999)
		);
		display: grid;
		gap: var(--sidebar-section-gap, 0.25rem);
		padding-block: var(--sidebar-section-padding-block, 0.75rem);
		/*
		 * Same gate as SidebarItem: collapses inline padding to zero at
		 * icon-rail width, preserving user-set value when expanded.
		 */
		padding-inline: var(--sidebar-section-padding-inline, 0.5rem);
	}

	.sidebar-section-label {
		font-size: var(--sidebar-section-label-size, 0.6875rem);
		font-weight: var(--sidebar-section-label-weight, 600);
		color: var(--sidebar-section-label-color, oklch(0.55 0 0));
		letter-spacing: var(--sidebar-section-label-tracking, 0.05em);
		text-transform: uppercase;
		/* Clipped by the aside's overflow-x: hidden at icon-rail width. */
		white-space: nowrap;
		overflow: hidden;
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
	}

	.sidebar-section-content {
		width: min(100%, 100cqi - (var(--sidebar-section-padding-inline, 0px) * 2));
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
