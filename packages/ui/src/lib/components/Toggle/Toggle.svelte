<script module lang="ts">
	export type ToggleVariant = 'default' | (string & {});
	export type ToggleSize = 'sm' | 'md' | 'lg' | (string & {});
</script>

<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import './Toggle.variants.css';

	interface Props extends Omit<HTMLButtonAttributes, 'aria-pressed'> {
		/** Two-way bindable pressed state. */
		pressed?: boolean;
		variant?: ToggleVariant;
		size?: ToggleSize;
	}

	let {
		pressed = $bindable(false),
		variant = 'default',
		size = 'md',
		children,
		class: className,
		onclick,
		...rest
	}: Props = $props();
</script>

<!--
	@component A two-state button (e.g. bold/italic). Native <button> with
	aria-pressed for correct semantics — no JS beyond flipping the flag.

	@example
		<Toggle bind:pressed>B</Toggle>
-->

<button
	type="button"
	class={['toggle', className]}
	data-variant={variant}
	data-size={size}
	aria-pressed={pressed}
	onclick={(e) => {
		pressed = !pressed;
		onclick?.(e);
	}}
	{...rest}
>
	{@render children?.()}
</button>

<style>
	.toggle {
		display: inline-grid;
		place-items: center;
		grid-auto-flow: column;
		gap: var(--toggle-gap, 0.5em);
		padding: var(--toggle-padding, 0.5em 0.75em);
		font: inherit;
		font-size: var(--toggle-font-size, inherit);
		font-weight: var(--toggle-font-weight, var(--fw-medium));
		line-height: 1;
		cursor: pointer;
		border: var(--toggle-border-width, 1px) solid var(--toggle-border-color, var(--clr-surface-300));
		border-radius: var(--toggle-border-radius, var(--radius-2));
		color: var(--toggle-color, inherit);
		background-color: var(--_toggle-bg, transparent);
		transition:
			background-color 0.15s,
			color 0.15s;
	}

	/* Padding/gap are em-based, so sizing the font scales the whole control. */
	.toggle[data-size='sm'] {
		--toggle-font-size: var(--toggle-font-size-sm, var(--fs-300));
	}
	.toggle[data-size='lg'] {
		--toggle-font-size: var(--toggle-font-size-lg, var(--fs-500));
	}

	.toggle[data-variant] {
		/* layer 1: pressed fill color; hover states derived from it in oklch */
		--_toggle-pressed: var(--toggle-pressed-background, var(--clr-surface-300));
		--_toggle-active-l: var(--toggle-active-l, -0.06);

		&:not(:disabled):hover {
			--_toggle-bg: var(--toggle-hover-background, var(--clr-surface-200));
		}

		&:focus-visible {
			outline: var(--toggle-focus-width, 2px) solid var(--toggle-focus-color, var(--clr-brand-400));
			outline-offset: var(--toggle-focus-offset, 2px);
		}

		&[aria-pressed='true'] {
			--_toggle-bg: var(--_toggle-pressed);
			color: var(--toggle-pressed-color, inherit);

			&:not(:disabled):hover {
				--_toggle-bg: oklch(from var(--_toggle-pressed) calc(l + var(--_toggle-active-l)) c h);
			}
		}

		&:disabled {
			cursor: not-allowed;
			opacity: var(--toggle-disabled-opacity, 0.5);
		}
	}
</style>
