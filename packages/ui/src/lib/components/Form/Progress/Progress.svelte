<script lang="ts">
	import type { HTMLProgressAttributes } from 'svelte/elements';

	interface Props extends HTMLProgressAttributes {
		value?: number | undefined;
	}

	let { value = $bindable(), ...rest }: Props = $props();
</script>

<progress {value} {...rest}></progress>

<style>
	progress {
		/* 1. Define private variables with public overrides + defaults (Following STYLE.md) */
		--_progress-color: var(--progress-color, var(--clr-brand-500));
		--_progress-track: var(--progress-track, var(--clr-surface-200));
		--_progress-height: var(--progress-height, 0.75rem);
		--_progress-radius: var(--progress-radius, var(--radius-pill));
		--_progress-border: var(--progress-border-width, 0) solid
			var(--progress-border-color, transparent);

		/* 2. Style using the variables */
		appearance: none;
		inline-size: 100%;
		block-size: var(--_progress-height);
		border-radius: var(--_progress-radius);
		overflow: hidden;
		border: var(--_progress-border);
		background-color: var(--_progress-track);
	}

	/* Track background (Webkit) */
	progress::-webkit-progress-bar {
		background-color: var(--_progress-track);
		border-radius: var(--_progress-radius);
	}

	/* Value bar (Webkit) */
	progress::-webkit-progress-value {
		background-color: var(--_progress-color);
		transition: inline-size 0.3s ease;
	}

	/* Value bar (Firefox) */
	progress::-moz-progress-bar {
		background-color: var(--_progress-color);
		transition: inline-size 0.3s ease;
	}
	/* Force zero width on Firefox for indeterminate state to show parent background */
	progress:indeterminate::-moz-progress-bar {
		inline-size: 0;
	}
	/* Indeterminate state: Animation fix */
	/* We apply the animation to the progress element itself and ensure the inner bar is transparent/hidden */
	progress:indeterminate {
		background-image: linear-gradient(
			90deg,
			var(--_progress-track) 0%,
			var(--_progress-color) 50%,
			var(--_progress-track) 100%
		);
		background-size: 200% 100%;
		animation: progress-slide 1.5s infinite linear;
	}

	/* Webkit requires the bar to be transparent to see the background animation on the parent */
	progress:indeterminate::-webkit-progress-bar {
		background-color: transparent;
	}

	@keyframes progress-slide {
		from {
			background-position: 200% 0;
		}
		to {
			background-position: -200% 0;
		}
	}

	/* Accessibility: respects user motion preferences */
	@media (prefers-reduced-motion: reduce) {
		progress::-webkit-progress-value,
		progress::-moz-progress-bar,
		progress:indeterminate {
			transition: none;
			animation: none;
		}
	}

	/* Ensure visibility in High Contrast modes */
	@media (forced-colors: active) {
		progress {
			appearance: auto;
		}
	}
</style>
