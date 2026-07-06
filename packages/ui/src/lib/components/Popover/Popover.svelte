<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		trigger: Snippet<
			[
				{
					props: {
						popovertarget: string;
						style: string;
						['data-popover-trigger']: true;
						type: 'button';
						// present so wrappers (e.g. Tooltip) can augment the trigger
						onpointerenter?: HTMLAttributes<HTMLElement>['onpointerenter'];
						onpointerleave?: HTMLAttributes<HTMLElement>['onpointerleave'];
						onfocus?: HTMLAttributes<HTMLElement>['onfocus'];
						onblur?: HTMLAttributes<HTMLElement>['onblur'];
					};
				}
			]
		>;
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
		 * adjusted using the `--popover-arrow-size` custom property on the popover content element.
		 */
		hasArrow?: boolean;
	}

	let {
		children,
		trigger,
		ref = $bindable(null),
		position = 'top',
		hasArrow = true,
		...rest
	}: Props = $props();

	const id = $props.id();
</script>

{@render trigger?.({
	props: {
		popovertarget: `popover-${id}`,
		style: `anchor-name: --component-popover`,
		['data-popover-trigger']: true,
		type: 'button'
	}
})}

<!-- position-anchor is set inline for the same polyfill-compatibility reason -->
<div
	class="popover-content"
	id="popover-{id}"
	popover="auto"
	bind:this={ref}
	data-position={position}
	style:--popover-position={position}
	data-has-arrow={hasArrow}
	style="position-anchor: --component-popover{hasArrow ? '' : '; --popover-arrow-size: 0px'}"
	{...rest}
>
	{@render children?.()}
</div>

<style>
	@property --popover-arrow-size {
		syntax: '<length>';
		initial-value: 8px;
		inherits: true;
	}

	@property --popover-offset {
		syntax: '<length>';
		initial-value: 0px;
		inherits: true;
	}

	@property --popover-margin-block-start {
		syntax: '<length>';
		initial-value: 0px;
		inherits: false;
	}

	@property --popover-margin-block-end {
		syntax: '<length>';
		initial-value: 0px;
		inherits: false;
	}

	@property --popover-margin-inline-start {
		syntax: '<length>';
		initial-value: 0px;
		inherits: false;
	}

	@property --popover-margin-inline-end {
		syntax: '<length>';
		initial-value: 0px;
		inherits: false;
	}

	:global(:where(:has(> [popovertarget] + [popover]))) {
		anchor-scope: --component-popover;
	}

	.popover-content {
		/* Public hooks fall back to private defaults (STYLE.md §1). Consumers set
		   the unprefixed vars; the component only ever reads the `_` ones. */
		--_popover-background: var(--popover-background, #000);
		--_popover-color: var(--popover-color, #fff);
		--_popover-border: var(--popover-border, none);
		--_popover-border-radius: var(--popover-border-radius, 1rem);
		--_popover-padding: var(--popover-padding, 0.5rem);
		--_popover-inline-padding: var(--popover-inline-padding, 0.5rem);
		--_popover-width: var(--popover-width, auto);

		/* Track knobs for a `.layout` grid nested inside the popover (e.g. dropdown
		   menus). The grid gutter reuses the popover's inline padding so the two
		   stay in lockstep; the :has() rule below hands inline spacing to the grid
		   so full-width breakouts still reach the popover's true edge. Inherited
		   values are inert when there is no nested grid. */
		--minimum-content-padding: var(--_popover-inline-padding);
		--full-max-width: min-content;
		--content-max-width: 100%;

		--_popover-arrow-offset: 1px;
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
		clip-path: inset(var(--_popover-arrow-offset)) margin-box;
		background: var(--_popover-background);
		color: var(--_popover-color);
		inline-size: var(--_popover-width);
		border: var(--_popover-border);
		padding: var(--_popover-padding);
		border-radius: var(--_popover-border-radius);
		margin-block-start: var(--popover-margin-block-start);
		margin-block-end: var(--popover-margin-block-end);
		margin-inline-start: var(--popover-margin-inline-start);
		margin-inline-end: var(--popover-margin-inline-end);

		/*
		 * Arrow pseudo-elements. Both axes are rendered at once — ::before draws
		 * the vertical (up/down) tether, ::after the horizontal (left/right) one,
		 * each producing a triangle on *both* of its edges. The asymmetric margin
		 * (only the trigger-facing side gets one) combined with `clip-path:
		 * margin-box` reveals exactly one of the four triangles: the one on the
		 * side with the gap.
		 *
		 * This is what makes the arrow survive `position-try` fallbacks: the gap
		 * is real `margin-*` (an accepted @position-try descriptor), so it moves
		 * to the resolved side automatically. The old approach drove the arrow
		 * with a custom property, which is not an accepted descriptor and so was
		 * ignored on flips — losing the arrow across axes.
		 *
		 * By default the triangle sits at the popover's centre. Where the browser
		 * supports it natively, the @supports block further down re-anchors it to
		 * the trigger so it still points at the button when the popover is wider
		 * or offset from it.
		 */
		&[data-has-arrow='true']::before {
			content: '';
			position: absolute;
			z-index: -1;
			/* vertical tether (popover above/below trigger) */
			inset: calc(-1 * var(--popover-arrow-size)) calc(50% - var(--popover-arrow-size));
			background: inherit;
			clip-path: polygon(
				0 var(--popover-arrow-size),
				50% 0,
				100% var(--popover-arrow-size),
				100% calc(100% - var(--popover-arrow-size)),
				50% 100%,
				0 calc(100% - var(--popover-arrow-size))
			);
		}

		&[data-has-arrow='true']::after {
			content: '';
			position: absolute;
			z-index: -1;
			/* horizontal tether (popover left/right of trigger) */
			inset: calc(50% - var(--popover-arrow-size)) calc(-1 * var(--popover-arrow-size));
			background: inherit;
			clip-path: polygon(
				0 var(--popover-arrow-size),
				var(--popover-arrow-size) 0,
				calc(100% - var(--popover-arrow-size)) 0,
				100% 50%,
				calc(100% - var(--popover-arrow-size)) 100%,
				var(--popover-arrow-size) 100%
			);
		}
	}

	/* A nested layout grid owns inline spacing via its gutter, so the box yields
	   its inline padding — full-width breakouts reach the popover's true edge. */
	.popover-content:has(:global(.layout)) {
		padding-inline: 0;
	}

	/* No arrow: remove the clip-path inset (--popover-arrow-size already zeroed via inline style) */
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
		--popover-margin-block-end: calc(var(--popover-arrow-size) + var(--popover-offset));
	}

	/* Popover below trigger */
	.popover-content:is(
		[data-position~='bottom'],
		[data-position*='block-end'],
		[data-position*='y-end']
	) {
		--popover-margin-block-start: calc(var(--popover-arrow-size) + var(--popover-offset));
	}

	/*
	 * Inline positions. The :not() guard gives block keywords priority so a
	 * compound like "top left" gets only the block gap — a single arrow rather
	 * than two. Pure left/right positions are unaffected.
	 */
	.popover-content:is(
			[data-position~='left'],
			[data-position*='inline-start'],
			[data-position*='x-start']
		):not(
			:is(
				[data-position~='top'],
				[data-position~='bottom'],
				[data-position*='block-'],
				[data-position*='y-start'],
				[data-position*='y-end']
			)
		) {
		/* Popover left of trigger */
		--popover-margin-inline-end: calc(var(--popover-arrow-size) + var(--popover-offset));
	}

	.popover-content:is(
			[data-position~='right'],
			[data-position*='inline-end'],
			[data-position*='x-end']
		):not(
			:is(
				[data-position~='top'],
				[data-position~='bottom'],
				[data-position*='block-'],
				[data-position*='y-start'],
				[data-position*='y-end']
			)
		) {
		/* Popover right of trigger */
		--popover-margin-inline-start: calc(var(--popover-arrow-size) + var(--popover-offset));
	}

	/*
	 * Fallback positions. @position-try only accepts inset / margin / sizing /
	 * self-alignment descriptors — custom properties aren't on that list (being
	 * @property-registered doesn't change that), so the gap is set with real
	 * `margin-*` properties here rather than the `--popover-margin-*` customs used
	 * above. The margin-box clip then reveals the matching triangle. Each block
	 * zeroes the other three margins so exactly one gap (and one arrow) is active.
	 */
	@position-try --popover-top {
		position-area: top;
		margin-block-end: calc(var(--popover-arrow-size) + var(--popover-offset));
		margin-block-start: 0px;
		margin-inline-start: 0px;
		margin-inline-end: 0px;
	}

	@position-try --popover-bottom {
		position-area: bottom left;
		margin-block-start: calc(var(--popover-arrow-size) + var(--popover-offset));
		margin-block-end: 0px;
		margin-inline-start: 0px;
		margin-inline-end: 0px;
	}

	@position-try --popover-left {
		position-area: left;
		margin-inline-end: calc(var(--popover-arrow-size) + var(--popover-offset));
		margin-block-start: 0px;
		margin-block-end: 0px;
		margin-inline-start: 0px;
	}

	@position-try --popover-right {
		position-area: right;
		margin-inline-start: calc(var(--popover-arrow-size) + var(--popover-offset));
		margin-block-start: 0px;
		margin-block-end: 0px;
		margin-inline-end: 0px;
	}
</style>
