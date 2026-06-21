<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes, HTMLAnchorAttributes } from 'svelte/elements';
	import { type ConditionalProps } from '../../types';

	/**
	 * Edit this type to add more variants
	 */
	type ButtonVariant = 'stripped' | (string & {});
	type ButtonSize = 'icon' | 'small' | 'large' | (string & {});

	interface BaseProps {
		children: Snippet;
		variant?: ButtonVariant;
		size?: ButtonSize;
		as?: 'button' | 'link';
		disabled?: boolean;
	}

	type Props = ConditionalProps<
		BaseProps,
		'as',
		'link',
		HTMLAnchorAttributes,
		HTMLButtonAttributes
	>;

	let { children, variant, size, as = 'button', disabled, ...rest }: Props = $props();
</script>

<svelte:element
	this={as === 'link' ? 'a' : 'button'}
	{...rest}
	disabled={as === 'button' ? disabled : undefined}
	aria-disabled={disabled ? true : undefined}
	tabindex={disabled && as === 'link' ? -1 : undefined}
	class={[rest.class, 'button']}
	data-variant={variant}
	data-size={size}
>
	{@render children()}
</svelte:element>

<style>
	/* ── Variant base ─────────────────────────────────────────────────── */
	.button[data-variant] {
		--_button-font-size: var(--button-font-size, 1rem);
		--_button-font-weight: var(--button-font-weight, 600);
		--_button-padding: var(--button-padding, 0.75rem 1.5rem);
		--_button-border-radius: var(--button-border-radius);
		--_button-letter-spacing: var(--button-letter-spacing, 0.1ch);

		/* oklch delta defaults — tunable per variant via --button-hover-l/-c/-h etc. */
		--_button-hover-l: var(--button-hover-l, -0.08);
		--_button-hover-c: var(--button-hover-c, 0);
		--_button-hover-h: var(--button-hover-h, 0);
		--_button-active-l: var(--button-active-l, -0.16);
		--_button-active-c: var(--button-active-c, 0);
		--_button-active-h: var(--button-active-h, 0);

		padding: var(--_button-padding);
		border: var(--button-border, 0);
		border-color: var(--button-border-color, currentColor);
		border-radius: var(--_button-border-radius);
		font-size: var(--_button-font-size);
		font-weight: var(--_button-font-weight);
		letter-spacing: var(--_button-letter-spacing);
		background-color: var(--button-background);
		color: var(--button-color);
		line-height: var(--button-line-height, 1);
		width: var(--button-width, auto);
		position: relative;

		&:is(:hover, :focus-visible) {
			background-color: var(
				--button-hover-background,
				oklch(
					from var(--button-background) calc(l + var(--_button-hover-l))
						calc(c + var(--_button-hover-c)) calc(h + var(--_button-hover-h))
				)
			);
			color: var(--button-hover-color, var(--button-color));
			border-color: var(--button-hover-border-color, var(--button-border-color, currentColor));
		}

		&:active {
			background-color: var(
				--button-active-background,
				oklch(
					from var(--button-background) calc(l + var(--_button-active-l))
						calc(c + var(--_button-active-c)) calc(h + var(--_button-active-h))
				)
			);
			color: var(--button-active-color, var(--button-color));
			border-color: var(--button-active-border-color, var(--button-border-color, currentColor));
		}
	}

	/* ── Disabled state ───────────────────────────────────────────────── */
	.button:disabled,
	.button[aria-disabled='true'] {
		--_button-disabled-opacity: var(--button-disabled-opacity, 0.45);
		
		opacity: var(--_button-disabled-opacity);
		cursor: not-allowed;
		pointer-events: none;
	}

	/* ── Reset / stripped ─────────────────────────────────────────────── */
	.button,
	.button[data-variant='stripped'] {
		appearance: none;
		padding: var(--button-padding, 0);
		border: 0;
		background-color: transparent;
		cursor: pointer;
		display: inline-flex;
		min-width: fit-content;
		align-items: center;
		vertical-align: middle;
		justify-content: center;
	}
</style>
