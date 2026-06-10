<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { type ConditionalProps } from '../../types';

	interface BaseProps extends HTMLInputAttributes {
		ref?: HTMLElement | null;
	}

	type Props = ConditionalProps<
		BaseProps,
		'type',
		'number',
		{
			hasSpinner?: boolean;
		},
		{
			hasSpinner?: never;
		}
	>;

	let {
		hasSpinner = true,
		type = 'text',
		value = $bindable(''),
		ref = $bindable(null),
		...rest
	}: Props = $props();
</script>

<!-- 
@component Input

A text input field for forms. This component encapsulates the styling and behavior of all text based inputs, like password, email, text, etc. It should be used in conjunction with the `Field` component to ensure proper form handling and validation.

-->

<input bind:value bind:this={ref} class:has-spinner={hasSpinner} {type} {...rest} />

<style>
	input {
		/* border */
		--_input-border-color: var(--input-border-color, #ccc);
		--_input-border-radius: var(--input-border-radius, 4px);
		--_input-border-width: var(--input-border-width, 1px);

		/* focus */
		--_input-focus-outline-width: var(--input-focus-outline-width, 1px);
		--_input-focus-outline-color: var(
			--input-focus-outline-color,
			var(--clr-brand-400, oklch(0.511 0.246 290))
		);

		/* padding */
		--_input-padding-block: var(--input-padding-block, 0.5rem);
		--_input-padding-inline: var(--input-padding-inline, 0.75rem);
		--_input-padding: var(
			--input-padding,
			var(--_input-padding-block) var(--_input-padding-inline)
		);

		/* text */
		--_input-text-color: var(--input-text-color, #000);
		--_input-placeholder-color: var(--input-placeholder-color, #888);

		/* miscellaneous */
		--_input-width: var(--input-width, auto);

		border: var(--_input-border-width) solid var(--_input-border-color);
		border-radius: var(--_input-border-radius);
		padding: var(--_input-padding);
		color: var(--_input-text-color);
		width: var(--_input-width);

		&::placeholder {
			color: var(--_input-placeholder-color);
		}

		&:hover {
			--_input-border-color: var(--input-border-hover-color, #999);
		}

		&:focus-visible {
			outline: var(--_input-focus-outline-width) solid var(--_input-focus-outline-color);
			--_input-border-color: transparent;
		}

		&:disabled {
			--_input-border-color: var(--input-border-disabled-color, #ccc);
			--_input-text-color: var(--input-text-disabled-color, #888);
			cursor: not-allowed;
		}
	}

	/* firefox */
	input[type='number'].has-spinner {
		appearance: textfield;
	}

	/* safari / chromium */
	input[type='number'].has-spinner::-webkit-outer-spin-button,
	input[type='number'].has-spinner::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
</style>
