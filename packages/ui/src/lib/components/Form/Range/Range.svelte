<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLInputAttributes, 'type'> {
		value?: number;
	}

	let { value = $bindable(50), ...rest }: Props = $props();
</script>

<input type="range" bind:value {...rest} />

<style>
	input[type='range'] {
		/* track */
		--_range-track-color: var(--range-track-color, var(--clr-surface-300, oklch(0.75 0.01 264)));
		--_range-track-height: var(--range-track-height, 0.375rem);
		--_range-track-radius: var(--range-track-radius, 100vw);

		/* progress */
		--_range-progress-color: var(--range-progress-color, var(--clr-brand-500, oklch(0.5 0.22 290)));

		/* thumb */
		--_range-thumb-color: var(--range-thumb-color, var(--clr-brand-400, oklch(0.511 0.246 290)));
		--_range-thumb-size: var(--range-thumb-size, 1.125rem);
		--_range-thumb-radius: var(--range-thumb-radius, 50%);

		/* focus ring */
		--_range-focus-color: var(--range-focus-color, var(--clr-brand-400, oklch(0.511 0.246 290)));
		--_range-focus-width: var(--range-focus-width, 3px);
		--_range-focus-offset: var(--range-focus-offset, 2px);

		-webkit-appearance: none;
		appearance: none;
		background: transparent;
		cursor: pointer;
		width: var(--range-width, 15rem);
		height: var(--_range-thumb-size);
		overflow: hidden;

		/* ── Track (webkit) ───────────────────────────────────────────── */

		&::-webkit-slider-runnable-track {
			background-color: var(--_range-track-color);
			border-radius: var(--_range-track-radius);
			height: var(--_range-track-height);
		}

		/* ── Track (firefox) ──────────────────────────────────────────── */

		&::-moz-range-track {
			background-color: var(--_range-track-color);
			border-radius: var(--_range-track-radius);
			height: var(--_range-track-height);
		}

		/* ── Thumb ────────────────────────────────────────────────────── */

		&::-webkit-slider-thumb {
			-webkit-appearance: none;
			appearance: none;
			background-color: var(--_range-thumb-color);
			border: 0;
			border-radius: var(--_range-thumb-radius);
			height: var(--_range-thumb-size);
			width: var(--_range-thumb-size);
			/* ponytail: border-image + overflow:hidden fills the track without JS — left half = progress, right half = track */
			border-image: linear-gradient(
					90deg,
					var(--_range-progress-color) 50%,
					var(--_range-track-color) 0
				)
				0 1 / calc(50% - var(--_range-track-height) / 2) 100vw / 0 100vw;
			transition: background-color 0.15s ease;
		}

		&::-moz-range-thumb {
			background-color: var(--_range-thumb-color);
			border: 0;
			border-radius: var(--_range-thumb-radius);
			height: var(--_range-thumb-size);
			width: var(--_range-thumb-size);
			border-image: linear-gradient(
					90deg,
					var(--_range-progress-color) 50%,
					var(--_range-track-color) 0
				)
				0 1 / calc(50% - var(--_range-track-height) / 2) 100vw / 0 100vw;
			transition: background-color 0.15s ease;
		}

		/* ── Hover ────────────────────────────────────────────────────── */

		&:hover:not(:disabled) {
			--_range-track-color: var(
				--range-track-hover-color,
				oklch(from var(--range-track-color, oklch(0.75 0.01 264)) calc(l - 0.05) c h)
			);
			--_range-thumb-color: var(
				--range-thumb-hover-color,
				oklch(from var(--range-thumb-color, oklch(0.511 0.246 290)) calc(l - 0.06) c h)
			);
			--_range-progress-color: var(
				--range-progress-hover-color,
				oklch(from var(--range-progress-color, oklch(0.5 0.22 290)) calc(l - 0.05) c h)
			);
		}

		/* ── Focus-visible ────────────────────────────────────────────── */

		/* outline on the input itself — immune to overflow:hidden, unlike box-shadow on the thumb */
		&:focus-visible {
			outline: var(--_range-focus-width) solid var(--_range-focus-color);
			outline-offset: var(--_range-focus-offset);
		}

		/* ── Out-of-range ─────────────────────────────────────────────── */

		&:out-of-range {
			--_range-track-color: var(--range-out-of-range-color, oklch(0.55 0.22 25));
			--_range-thumb-color: var(--range-out-of-range-thumb-color, oklch(0.55 0.22 25));
			--_range-progress-color: var(--range-out-of-range-progress-color, oklch(0.55 0.22 25));
		}

		/* ── Disabled ─────────────────────────────────────────────────── */

		&:disabled {
			cursor: not-allowed;
			opacity: var(--range-disabled-opacity, 0.45);
		}

		@media (prefers-reduced-motion: reduce) {
			&::-webkit-slider-thumb,
			&::-moz-range-thumb {
				transition-duration: 0.01ms;
			}
		}
	}
</style>
