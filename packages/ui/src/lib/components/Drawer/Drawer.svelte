<script lang="ts">
	import Sheet from '$components/Sheet/Sheet.svelte';
	import type { ComponentProps, Snippet } from 'svelte';

	interface Props extends ComponentProps<typeof Sheet> {
		/** Extra content for the grab handle row, rendered next to the handle bar. */
		header?: Snippet;
	}

	let { side = 'bottom', header: headerProp, ref = $bindable(null), ...props }: Props = $props();

	// Which axis the panel slides on, and the sign that points "towards closed"
	// (drag that way dismisses it).
	const AXIS = {
		bottom: { axis: 'y', sign: 1 },
		top: { axis: 'y', sign: -1 },
		right: { axis: 'x', sign: 1 },
		left: { axis: 'x', sign: -1 }
	} as const;

	let dragging = false;
	let start = 0;
	let last = 0;
	let lastT = 0;
	let offset = 0; // px dragged towards closed, clamped >= 0
	let velocity = 0; // px/ms towards closed

	function coord(e: PointerEvent) {
		return AXIS[side].axis === 'y' ? e.clientY : e.clientX;
	}

	// Inline translate string for a given offset in px, in the closing direction.
	function translate(px: number, unit: 'px' | '%') {
		const v = AXIS[side].sign * px;
		return AXIS[side].axis === 'y' ? `0 ${v}${unit}` : `${v}${unit} 0`;
	}

	function onpointerdown(e: PointerEvent) {
		if (!ref) return;
		dragging = true;
		offset = 0;
		velocity = 0;
		start = last = coord(e);
		lastT = e.timeStamp;
		ref.style.transition = 'none'; // follow the finger 1:1 while dragging
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function onpointermove(e: PointerEvent) {
		if (!dragging || !ref) return;
		const p = coord(e);
		offset = Math.max(0, (p - start) * AXIS[side].sign);
		const dt = e.timeStamp - lastT;
		if (dt > 0) {
			velocity = ((p - last) * AXIS[side].sign) / dt;
			last = p;
			lastT = e.timeStamp;
		}
		ref.style.translate = translate(offset, 'px');
	}

	function onpointerup() {
		if (!dragging || !ref) return;
		dragging = false;
		ref.style.transition = ''; // restore the CSS spring for snap-back / fling-out
		const size = AXIS[side].axis === 'y' ? ref.offsetHeight : ref.offsetWidth;

		// Past halfway, or a firm flick towards the edge → dismiss.
		if (offset > size * 0.5 || velocity > 0.5) {
			const el = ref;
			el.style.translate = translate(100, '%'); // slide the rest of the way out
			el.addEventListener(
				'transitionend',
				function done(ev) {
					if (ev.propertyName !== 'translate') return;
					el.close();
					el.style.removeProperty('translate');
					el.removeEventListener('transitionend', done);
				},
				{ once: false }
			);
		} else {
			ref.style.removeProperty('translate'); // let CSS snap back to open (0 0)
		}
	}
</script>

<Sheet {side} bind:ref {...props}>
	{#snippet header()}
		<div class="drawer-handle-row">
			<span class="drawer-handle" aria-hidden="true" {onpointerdown} {onpointermove} {onpointerup}
			></span>
			{@render headerProp?.()}
		</div>
	{/snippet}
</Sheet>

<style>
	.drawer-handle-row {
		display: grid;
		justify-items: center;
		gap: var(--drawer-handle-gap, 0.75rem);
	}

	.drawer-handle {
		/* touch-action:none so the browser doesn't steal the gesture for scrolling. */
		touch-action: none;
		cursor: grab;
		width: var(--drawer-handle-width, 2.5rem);
		height: var(--drawer-handle-height, 0.375rem);
		border-radius: 100vmax;
		background: var(--drawer-handle-color, currentColor);
		opacity: var(--drawer-handle-opacity, 0.25);
	}
	.drawer-handle:active {
		cursor: grabbing;
	}
</style>
