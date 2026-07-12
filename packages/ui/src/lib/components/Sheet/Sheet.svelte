<script lang="ts">
	import { Dialog } from '$components/Dialog';
	import type { ComponentProps } from 'svelte';

	interface Props extends ComponentProps<typeof Dialog> {
		/** Edge the sheet slides in from. */
		side?: 'top' | 'bottom' | 'left' | 'right';
	}

	let { side = 'right', ref = $bindable(null), ...props }: Props = $props();
</script>

<!-- display:contents so the wrapper adds no box; the modal <dialog> still inherits
     these custom properties through the DOM tree even while in the top layer. -->
<div style="display: contents;" class="sheet" data-side={side}>
	<Dialog bind:ref {...props} />
</div>

<style>
	.sheet {
		/* Panel thickness along the sliding axis (width for left/right, height for top/bottom). */
		--_sheet-size: var(--sheet-size, min(28rem, 90%));

		/* Full-bleed: drop the dialog's viewport gutter and open both caps so the
		   panel reaches the edges. Per-side rules below re-size the sliding axis. */
		--dialog-viewport-margin: 0px;
		--dialog-max-width: 100%;
		--dialog-max-height: 100dvh;
		/* Round only the two inner corners; overridden per side below. */
		--_sheet-radius: var(--sheet-border-radius, var(--dialog-border-radius, 8px));
	}

	/* Left / right: full height, width = size, slide along the inline axis. */
	.sheet[data-side='right'] {
		--dialog-width: var(--_sheet-size);
		--dialog-height: 100%;
		--dialog-margin: 0 0 0 auto;
		--dialog-enter-translate: 100% 0;
		--dialog-border-radius: var(--_sheet-radius) 0 0 var(--_sheet-radius);
	}
	.sheet[data-side='left'] {
		--dialog-width: var(--_sheet-size);
		--dialog-height: 100%;
		--dialog-margin: 0 auto 0 0;
		--dialog-enter-translate: -100% 0;
		--dialog-border-radius: 0 var(--_sheet-radius) var(--_sheet-radius) 0;
	}

	/* Top / bottom: full width, height = size, slide along the block axis. */
	.sheet[data-side='top'] {
		--dialog-width: 100%;
		--dialog-height: var(--_sheet-size);
		--dialog-margin: 0 auto auto auto;
		--dialog-enter-translate: 0 -100%;
		--dialog-border-radius: 0 0 var(--_sheet-radius) var(--_sheet-radius);
	}
	.sheet[data-side='bottom'] {
		--dialog-width: 100%;
		--dialog-height: var(--_sheet-size);
		--dialog-margin: auto auto 0 auto;
		--dialog-enter-translate: 0 100%;
		--dialog-border-radius: var(--_sheet-radius) var(--_sheet-radius) 0 0;
	}
</style>
