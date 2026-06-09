<script lang="ts">
	import type { HTMLInputAttributes, ClassValue } from 'svelte/elements';

	interface Props extends Omit<HTMLInputAttributes, 'type'> {
		checked?: boolean;
		class?: ClassValue;
	}

	let { checked = $bindable(false), class: className, ...rest }: Props = $props();
</script>

<div class={['switch', className]}>
	<input type="checkbox" role="switch" bind:checked {...rest} />
	<div class="switch-thumb" aria-hidden="true"></div>
</div>

<style>
	@property --_switch-thumb-position {
		syntax: '<length>';
		inherits: true;
		initial-value: 0px;
	}

	.switch {
		--_switch-width: var(--switch-width, 2.5em);
		--_switch-height: var(--switch-height, 1.25em);
		--_switch-border-radius: var(--switch-border-radius, 100vw);
		--_switch-border-color: var(--switch-border-color, oklch(0.256 0.011 264));
		--_switch-background-color: var(--switch-background-color, oklch(0.197 0.008 264));
		--_switch-thumb-offset-sides: var(--switch-thumb-offset-sides, 0.125em);
		--_switch-thumb-color: var(--switch-thumb-color, oklch(0.932 0.004 256));
		--_switch-thumb-border-color: var(--switch-thumb-border-color, oklch(0.86 0.008 256));
		--_switch-thumb-border-radius: var(--switch-thumb-border-radius, 50%);
		--_switch-thumb-size: calc(var(--_switch-height) - var(--_switch-thumb-offset-sides) * 2);

		/* Thumb rests at offset-sides when unchecked */
		--_switch-thumb-position: var(--_switch-thumb-offset-sides);

		anchor-scope: --switch;
		width: fit-content;
		container-type: inline-size;
	}

	/* Move thumb to right side when checked */
	.switch:has(input:checked) {
		--_switch-thumb-position: calc(
			var(--_switch-width) - var(--_switch-thumb-size) - var(--_switch-thumb-offset-sides)
		);
	}

	input[type='checkbox'] {
		appearance: none;
		anchor-name: --switch;
		width: var(--_switch-width);
		height: var(--_switch-height);
		border: 1px solid var(--_switch-border-color);
		background-color: var(--_switch-background-color);
		border-radius: var(--_switch-border-radius);
		cursor: pointer;
		transition:
			background-color 0.3s ease-in-out,
			border-color 0.3s ease-in-out;

		&:checked {
			background-color: var(--switch-checked-background-color, oklch(0.5 0.2 286));
			border-color: var(--switch-checked-border-color, oklch(0.45 0.2 286));
		}

		&:focus-visible {
			outline: 2px solid var(--switch-focus-color, oklch(0.5 0.2 286));
			outline-offset: 2px;
		}

		&:disabled {
			cursor: not-allowed;
			opacity: 0.5;
		}

		@media (prefers-reduced-motion: reduce) {
			transition-duration: 0.01ms;
		}
	}

	.switch-thumb {
		position: absolute;
		background-color: var(--_switch-thumb-color);
		border: 1px solid var(--_switch-thumb-border-color);
		position-anchor: --switch;
		inset-block: calc(var(--_switch-height) / 2 - var(--_switch-thumb-size) / 2);
		inset-inline-start: var(--_switch-thumb-position);
		width: var(--_switch-thumb-size);
		border-radius: var(--_switch-thumb-border-radius);
		aspect-ratio: 1 / 1;
		pointer-events: none;
		/* Animate the custom property — works because @property declares syntax: '<length>' */
		transition: --_switch-thumb-position 0.3s ease-in-out;

		@media (prefers-reduced-motion: reduce) {
			transition-duration: 0.01ms;
		}
	}
</style>
