<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		trigger: Snippet<[{ props: HTMLButtonAttributes }]>;
		/**
		 * A reference to the popover content element. Use `showPopover()` / `hidePopover()` to
		 * programmatically control visibility.
		 */
		ref?: HTMLElement | null;
		/**
		 * Preferred position of the popover relative to its trigger. Supports one or two
		 * position-area keywords such as `top`, `top left`, or `block-start inline-end`.
		 */
		position?: string;
		/**
		 * Whether the popover should show an arrow pointing to the trigger.
		 * The arrow is implemented using a CSS pseudo-element, so it will be automatically
		 * colored and clipped to match the popover content. The size of the arrow can be
		 * adjusted using the `--tether-size` custom property on the popover content element.
		 */
		hasArrow?: boolean;
		/**
		 * Whether the popover should inherit the trigger's width. When true, the popover's layout width will match the trigger's width, but it can still visually overflow if the content is wider. This is useful for dropdowns
		 */
		inheritTriggerWidth?: boolean;
	}

	let {
		children,
		trigger,
		ref = $bindable(null),
		position = 'top',
		hasArrow = true,
		inheritTriggerWidth = false,
		...rest
	}: Props = $props();

	const id = $props.id();
</script>

{@render trigger?.({
	props: {
		popovertarget: `popover-${id}`,
		style: `anchor-name: --component-popover`,
		['data-popover-trigger']: true
	} as HTMLButtonAttributes
})}

<!-- position-anchor is set inline for the same polyfill-compatibility reason -->
<div
	class="popover-content"
	id="popover-{id}"
	popover="auto"
	bind:this={ref}
	data-position={position}
	data-inherit-trigger-width={inheritTriggerWidth}
	style:--popover-position={position}
	data-has-arrow={hasArrow}
	style="position-anchor: --component-popover{hasArrow ? '' : '; --tether-size: 0px'}"
	{...rest}
>
	{@render children?.()}
</div>

<style>
	@property --tether-size {
		syntax: '<length>';
		initial-value: 8px;
		inherits: true;
	}

	@property --popover-offset {
		syntax: '<length>';
		initial-value: 0px;
		inherits: true;
	}

	.popover-content[data-inherit-trigger-width='true'] {
		inline-size: max(anchor-size(inline), var(--popover-max-width, min(100%, max-content)));
	}

	:global(:where(:has([popovertarget] + [popover]))) {
		anchor-scope: --component-popover;
	}

	.popover-content {
		--tether-offset: 1px;
		--popover-margin-block-start: 0px;
		--popover-margin-block-end: 0px;
		--popover-margin-inline-start: 0px;
		--popover-margin-inline-end: 0px;

		position: fixed;
		inset: auto;
		margin: 0;
		/* position-area and position-try are not set inline so the polyfill
		   reads them from the stylesheet. The direction-specific data attributes
		   below provide the actual values per axis. */
		position-area: var(--popover-position);
		/* position-try: --popover-top, --popover-bottom, --popover-left, --popover-right; */
		/* Also include the renamed property for Chrome 125-128 compatibility */
		position-try-fallbacks: var(
			--popover-custom-fallbacks,
			--popover-top,
			--popover-bottom,
			--popover-left,
			--popover-right
		);

		overflow: visible;
		clip-path: inset(var(--tether-offset)) margin-box;
		background: var(--popover-bg, #000);
		color: var(--popover-color, #fff);
		border: var(--popover-border, none);
		padding: var(--popover-padding, 0.5rem);
		border-radius: var(--popover-radius, 1rem);
		margin-block-start: var(--popover-margin-block-start);
		margin-block-end: var(--popover-margin-block-end);
		margin-inline-start: var(--popover-margin-inline-start);
		margin-inline-end: var(--popover-margin-inline-end);

		/*
		 * Arrow pseudo-elements: defined on both axes, hidden by default via
		 * content:none; the position-aware selectors below activate the right one.
		 */
		&[data-has-arrow='true']::before {
			content: none; /* activated for block-axis positions below */
			position: absolute;
			z-index: -1;
			/* vertical tether (popover above/below trigger) */
			inset: calc(-1 * var(--tether-size)) calc(50% - var(--tether-size));
			background: inherit;
			clip-path: polygon(
				0 var(--tether-size),
				50% 0,
				100% var(--tether-size),
				100% calc(100% - var(--tether-size)),
				50% 100%,
				0 calc(100% - var(--tether-size))
			);
		}

		&[data-has-arrow='true']::after {
			content: none; /* activated for inline-axis positions below */
			position: absolute;
			z-index: -1;
			/* horizontal tether (popover left/right of trigger) */
			inset: calc(50% - var(--tether-size)) calc(-1 * var(--tether-size));
			background: inherit;
			clip-path: polygon(
				0 var(--tether-size),
				var(--tether-size) 0,
				calc(100% - var(--tether-size)) 0,
				100% 50%,
				calc(100% - var(--tether-size)) 100%,
				var(--tether-size) 100%
			);
		}
	}

	/* No arrow: remove the clip-path inset (--tether-size already zeroed via inline style) */
	.popover-content:not([data-has-arrow='true']) {
		clip-path: none;
	}

	/*
	 * Position-area keyword sets, matched directly from data-position:
	 *   ~= whole-word match  (top, bottom, left, right)
	 *   *= substring match   (block-start, block-end, inline-start, inline-end, y-*, x-*)
	 *
	 * Block keywords (top/bottom) take priority over inline (left/right).
	 * The ::after :not() guard below enforces that priority.
	 */

	/* --- Margin spacing (arrow gap) --- */

	/* Popover above trigger */
	.popover-content:is(
		[data-position~='top'],
		[data-position*='block-start'],
		[data-position*='y-start']
	) {
		--popover-margin-block-end: calc(var(--tether-size) + var(--popover-offset));
	}

	/* Popover below trigger */
	.popover-content:is(
		[data-position~='bottom'],
		[data-position*='block-end'],
		[data-position*='y-end']
	) {
		--popover-margin-block-start: calc(var(--tether-size) + var(--popover-offset));
	}

	/* Popover left of trigger */
	.popover-content:is(
		[data-position~='left'],
		[data-position*='inline-start'],
		[data-position*='x-start']
	) {
		--popover-margin-inline-end: calc(var(--tether-size) + var(--popover-offset));
	}

	/* Popover right of trigger */
	.popover-content:is(
		[data-position~='right'],
		[data-position*='inline-end'],
		[data-position*='x-end']
	) {
		--popover-margin-inline-start: calc(var(--tether-size) + var(--popover-offset));
	}

	/* --- Arrow activation --- */

	/* Block tether: activate ::before for top/bottom positions */
	.popover-content[data-has-arrow='true']:is(
			[data-position~='top'],
			[data-position~='bottom'],
			[data-position*='block-'],
			[data-position*='y-start'],
			[data-position*='y-end']
		)::before {
		content: '';
	}

	/*
	 * Inline tether: activate ::after for left/right positions.
	 * The :not() excludes any position that also has a block keyword so that
	 * e.g. "top left" correctly shows the block (top/bottom) arrow only.
	 */
	.popover-content[data-has-arrow='true']:is(
			[data-position~='left'],
			[data-position~='right'],
			[data-position*='inline-'],
			[data-position*='x-start'],
			[data-position*='x-end']
		):not(
			:is(
				[data-position~='top'],
				[data-position~='bottom'],
				[data-position*='block-'],
				[data-position*='y-start'],
				[data-position*='y-end']
			)
		)::after {
		content: '';
	}

	@position-try --popover-top {
		position-area: top;
		--popover-margin-block-end: calc(var(--tether-size) + var(--popover-offset));
		--popover-margin-block-start: 0px;
		--popover-margin-inline-start: 0px;
		--popover-margin-inline-end: 0px;
	}

	@position-try --popover-bottom {
		position-area: bottom left;
		--popover-margin-block-start: calc(var(--tether-size) + var(--popover-offset));
		--popover-margin-block-end: 0px;
		--popover-margin-inline-start: 0px;
		--popover-margin-inline-end: 0px;
	}

	@position-try --popover-left {
		position-area: left;
		--popover-margin-inline-end: calc(var(--tether-size) + var(--popover-offset));
		--popover-margin-block-start: 0px;
		--popover-margin-block-end: 0px;
		--popover-margin-inline-start: 0px;
	}

	@position-try --popover-right {
		position-area: right;
		--popover-margin-inline-start: calc(var(--tether-size) + var(--popover-offset));
		--popover-margin-block-start: 0px;
		--popover-margin-block-end: 0px;
		--popover-margin-inline-end: 0px;
	}
</style>
