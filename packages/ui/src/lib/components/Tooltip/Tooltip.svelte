<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props {
		trigger: Snippet<[{ props: HTMLButtonAttributes }]>;
		content: Snippet;
		/**
		 * A reference to the tooltip content element. This can be used to programmatically show or hide the tooltip using the `showPopover()` and `hidePopover()` methods on the element.
		 */
		ref?: HTMLElement | null;
		/**
		 * The initial position of the tooltip. The tooltip will try to be positioned in this position first,
		 * but if there is not enough space, it will try the other positions in the order specified by the `position-try` property in the CSS.
		 */
		position?: 'top' | 'bottom' | 'left' | 'right';
		/**
		 * The delay in milliseconds before the tooltip is shown or hidden after hovering the trigger element.
		 * This can be used to prevent the tooltip from flickering when quickly moving the mouse in and out of the trigger element.
		 */
		toggleDelay?: number;
	}

	let {
		content,
		toggleDelay = 500,
		trigger,
		ref = $bindable<HTMLElement | null>(),
		...rest
	}: Props = $props();

	const id = $props.id();

	const triggerProps = {
		popovertarget: `tooltip-${id}`
		// onmouseenter: (e: MouseEvent) => {
		// 	ref?.showPopover();
		// },
		// onmouseleave: (e: MouseEvent) => {
		// 	setTimeout(() => {
		// 		ref?.hidePopover();
		// 	}, toggleDelay);
		// }

		// onmouseenter: (e: MouseEvent) => {
		// 	ref?.showPopover();
		// },
		// onmouseleave: (e: MouseEvent) => {
		// 	ref?.hidePopover();
		// }
	} satisfies HTMLButtonAttributes;
</script>

<div class="tooltip">
	<div class="tooltip-trigger">
		{@render trigger({ props: triggerProps })}
	</div>

	<div
		class="tooltip-content"
		id="tooltip-{id}"
		popover
		bind:this={ref}
		draggable="true"
		data-initial-position={rest.position}
	>
		{@render content()}
		<div class="tooltip-arrow"></div>
	</div>
</div>

<style lang="scss">
	@use '../../styles/abstracts/' as *;

	@property --tether-size {
		syntax: '<length>';
		initial-value: 8px;
		inherits: true;
	}
	.tooltip {
		anchor-scope: --tooltip;
	}

	.tooltip-trigger {
		anchor-name: --tooltip;
		width: fit-content;
		place-self: center;
	}

	[popover] {
		--tether-offset: 1px;
		// --tether-size: 8px;

		position-anchor: --tooltip;
		position: absolute;
		position-area: var(--initial-tooltip-position, top);
		position-try: --bottom, --left, --right;

		// margin: 0 0 var(--tether-size) 0;
		clip-path: inset(var(--tether-offset)) margin-box;

		/* need this to see the tether */
		overflow: visible;

		max-width: 300px;

		background: black;
		color: white;
		border: none;
		padding: 1rem;
		border-radius: 1rem;

		&::before {
			content: '';
			position: absolute;
			z-index: -1;
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

		&::after {
			content: '';
			position: absolute;
			z-index: -1;
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

	[popover][data-initial-position='top'] {
		position-area: top;
		margin: 0 0 var(--tether-size) 0;
	}

	[popover][data-initial-position='bottom'] {
		position-area: bottom;
		margin: var(--tether-size) 0 0 0;
	}

	[popover][data-initial-position='left'] {
		position-area: left;
		margin: 0 var(--tether-size) 0 0;
	}

	[popover][data-initial-position='right'] {
		position-area: right;
		margin: 0 0 0 var(--tether-size);
	}

	@position-try --top {
		position-area: top;
		margin: 0 0 var(--tether-size) 0;
	}

	@position-try --bottom {
		position-area: bottom;
		margin: var(--tether-size) 0 0 0;
	}
	@position-try --left {
		position-area: left;
		margin: 0 var(--tether-size) 0 0;
	}
	@position-try --right {
		position-area: right;
		margin: 0 0 0 var(--tether-size);
	}
</style>
