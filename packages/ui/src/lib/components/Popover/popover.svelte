<script lang="ts" module>
	const blockTokenMap = {
		top: 'top',
		bottom: 'bottom',
		center: 'center',
		'block-start': 'block-start',
		'block-end': 'block-end',
		'y-start': 'top',
		'y-end': 'bottom',
		'self-block-start': 'self-block-start',
		'self-block-end': 'self-block-end',
		'self-y-start': 'self-block-start',
		'self-y-end': 'self-block-end',
		start: 'start',
		end: 'end',
		'self-start': 'self-start',
		'self-end': 'self-end',
		'span-top': 'top',
		'span-bottom': 'bottom',
		'span-block-start': 'block-start',
		'span-block-end': 'block-end',
		'span-y-start': 'top',
		'span-y-end': 'bottom',
		'span-self-block-start': 'self-block-start',
		'span-self-block-end': 'self-block-end',
		'span-self-y-start': 'self-block-start',
		'span-self-y-end': 'self-block-end',
		'span-start': 'start',
		'span-end': 'end',
		'span-self-start': 'self-start',
		'span-self-end': 'self-end',
		'span-all': 'center'
	} as const;

	const inlineTokenMap = {
		left: 'left',
		right: 'right',
		center: 'center',
		'inline-start': 'inline-start',
		'inline-end': 'inline-end',
		'x-start': 'left',
		'x-end': 'right',
		'self-inline-start': 'self-inline-start',
		'self-inline-end': 'self-inline-end',
		'self-x-start': 'self-inline-start',
		'self-x-end': 'self-inline-end',
		start: 'start',
		end: 'end',
		'self-start': 'self-start',
		'self-end': 'self-end',
		'span-left': 'left',
		'span-right': 'right',
		'span-inline-start': 'inline-start',
		'span-inline-end': 'inline-end',
		'span-x-start': 'left',
		'span-x-end': 'right',
		'span-self-inline-start': 'self-inline-start',
		'span-self-inline-end': 'self-inline-end',
		'span-self-x-start': 'self-inline-start',
		'span-self-x-end': 'self-inline-end',
		'span-start': 'start',
		'span-end': 'end',
		'span-self-start': 'self-start',
		'span-self-end': 'self-end',
		'span-all': 'center'
	} as const;
	export type PopoverPosition = 'top' | 'bottom' | 'left' | 'right' | 'center' | (string & {});
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';

	type ParsedPosition = {
		block?: string;
		inline?: string;
		tetherAxis?: 'block' | 'inline';
	};

	const sharedTokens = new Set(['center', 'start', 'end', 'self-start', 'self-end']);

	function parsePosition(position: PopoverPosition): ParsedPosition {
		const parsed: ParsedPosition = {};
		const tokens = position.trim().split(/\s+/).filter(Boolean);

		const assign = (key: 'block' | 'inline', value: string) => {
			if (!parsed[key]) {
				parsed[key] = value;
			}
		};

		for (const token of tokens) {
			if (sharedTokens.has(token)) {
				if (!parsed.block) {
					parsed.block = token;
					continue;
				}

				if (!parsed.inline) {
					parsed.inline = token;
					continue;
				}
			}

			const blockValue =
				token in blockTokenMap ? blockTokenMap[token as keyof typeof blockTokenMap] : undefined;
			if (blockValue) {
				assign('block', blockValue);
				continue;
			}

			const inlineValue =
				token in inlineTokenMap ? inlineTokenMap[token as keyof typeof inlineTokenMap] : undefined;
			if (inlineValue) {
				assign('inline', inlineValue);
				continue;
			}
		}

		if (!parsed.inline && parsed.block && sharedTokens.has(parsed.block)) {
			parsed.inline = parsed.block;
		}

		if (!parsed.block && parsed.inline && sharedTokens.has(parsed.inline)) {
			parsed.block = parsed.inline;
		}

		parsed.tetherAxis =
			parsed.block && parsed.block !== 'center'
				? 'block'
				: parsed.inline && parsed.inline !== 'center'
					? 'inline'
					: undefined;

		return parsed;
	}

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
		position?: PopoverPosition;
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
	const positionState = $derived(parsePosition(position));
</script>

<div class="popover-wrapper">
	<!-- anchor-name is set inline so the polyfill can reliably read it -->
	<div class="popover-trigger">
		{@render trigger?.({ props: { popovertarget: `popover-${id}` } as HTMLButtonAttributes })}
	</div>

	<!-- position-anchor is set inline for the same polyfill-compatibility reason -->
	<div
		class="popover-content"
		id="popover-{id}"
		popover="auto"
		bind:this={ref}
		data-position={position}
		data-block-position={positionState.block}
		data-inline-position={positionState.inline}
		data-tether-axis={positionState.tetherAxis}
		data-inherit-trigger-width={inheritTriggerWidth}
		style:--popover-position={position}
		data-has-arrow={hasArrow}
		style="position-anchor: --component-popover{hasArrow ? '' : '; --tether-size: 0px'}"
		{...rest}
	>
		{@render children?.()}
	</div>
</div>

<style>
	@property --tether-size {
		syntax: '<length>';
		initial-value: 12px;
		inherits: true;
	}

	@property --popover-offset {
		syntax: '<length>';
		initial-value: 0px;
		inherits: true;
	}

	.popover-wrapper {
		display: contents;
		anchor-scope: --component-popover;
	}

	.popover-trigger {
		anchor-name: --component-popover;
		width: var(--popover-trigger-width, fit-content);
		/*
		 * Cap the trigger's layout box to the nearest inline-size container.
		 * When inside the sidebar (aside[container: sidebar/inline-size]) this
		 * resolves to the sidebar's actual layout width — 3rem when collapsed,
		 * 16rem when expanded. Without this, overflow-x:hidden on the aside clips
		 * the visual box but NOT the layout box, so the anchor rect for popovers
		 * remains the full intrinsic text width and dropdowns position against it.
		 * Outside any container falls back to 100svw (viewport), so normal
		 * popovers outside the sidebar are unaffected.
		 */
		max-inline-size: 100cqi;
	}

	.popover-content[data-inherit-trigger-width='true'] {
		inline-size: max(anchor-size(inline), var(--popover-max-width, min(100%, max-content)));
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
		position-try-fallbacks: var(--popover-custom-fallbacks, --popover-top, --popover-bottom, --popover-left, --popover-right);

		overflow: visible;
		clip-path: inset(var(--tether-offset)) margin-box;
		background: var(--popover-bg, #000);
		color: var(--popover-color, #fff);
		border: var(--popover-border, none);
		padding: var(--popover-padding, 1rem);
		border-radius: var(--popover-radius, 1rem);
		margin-block-start: var(--popover-margin-block-start);
		margin-block-end: var(--popover-margin-block-end);
		margin-inline-start: var(--popover-margin-inline-start);
		margin-inline-end: var(--popover-margin-inline-end);

		/* Tether arrow — shared across both axes, only the correct one is visible
		   based on position-area orientation. */
		&[data-has-arrow='true'][data-tether-axis='block']::before {
			content: '';
			position: absolute;
			z-index: -1;
			/* vertical tether (used when popover is above/below) */
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

		&[data-has-arrow='true'][data-tether-axis='inline']::after {
			content: '';
			position: absolute;
			z-index: -1;
			/* horizontal tether (used when popover is left/right) */
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

	.popover-content:is(
		[data-block-position='top'],
		[data-block-position='block-start'],
		[data-block-position='y-start'],
		[data-block-position='self-block-start'],
		[data-block-position='self-y-start'],
		[data-block-position='start'],
		[data-block-position='self-start']
	) {
		--popover-margin-block-end: calc(var(--tether-size) + var(--popover-offset));
	}

	.popover-content:is(
		[data-block-position='bottom'],
		[data-block-position='block-end'],
		[data-block-position='y-end'],
		[data-block-position='self-block-end'],
		[data-block-position='self-y-end'],
		[data-block-position='end'],
		[data-block-position='self-end']
	) {
		--popover-margin-block-start: calc(var(--tether-size) + var(--popover-offset));
	}

	.popover-content:is(
		[data-inline-position='left'],
		[data-inline-position='inline-start'],
		[data-inline-position='x-start'],
		[data-inline-position='self-inline-start'],
		[data-inline-position='self-x-start'],
		[data-inline-position='start'],
		[data-inline-position='self-start']
	) {
		--popover-margin-inline-end: calc(var(--tether-size) + var(--popover-offset));
	}

	.popover-content:is(
		[data-inline-position='right'],
		[data-inline-position='inline-end'],
		[data-inline-position='x-end'],
		[data-inline-position='self-inline-end'],
		[data-inline-position='self-x-end'],
		[data-inline-position='end'],
		[data-inline-position='self-end']
	) {
		--popover-margin-inline-start: calc(var(--tether-size) + var(--popover-offset));
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
