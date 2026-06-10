<script lang="ts">
	import { getContext } from 'svelte';
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes, ClassValue } from 'svelte/elements';
	import type { RadioGroupContext } from './RadioGroup.svelte';

	interface Props extends Omit<HTMLInputAttributes, 'type' | 'checked'> {
		value: string;
		children?: Snippet;
		class?: ClassValue;
	}

	let { value, children, class: className, name: nameProp, onchange, ...rest }: Props = $props();

	const group = getContext<RadioGroupContext | undefined>('radio-group');

	const isChecked = $derived(group ? group.value === value : false);
</script>

<!--
@component Radio

A single radio button. Can be used standalone (with a native `name` attribute) or nested inside a `RadioGroup` which manages name and selection state via context.

Also accepts spread attributes from a remote form field: `{...form.fields.myField.as('radio', value)}`
-->

<label class={['radio-label', className]}>
	<input
		type="radio"
		name={group?.name ?? nameProp}
		{value}
		checked={isChecked}
		onchange={(e) => {
			if (group) group.value = value;
			onchange?.(e);
		}}
		{...rest}
	/>
	{#if children}
		<span class="radio-content">{@render children()}</span>
	{/if}
</label>

<style>
	.radio-label {
		--_radio-gap: var(--radio-gap, 0.5rem);

		display: flex;
		align-items: center;
		gap: var(--_radio-gap);
		cursor: pointer;

		&:has(input:disabled) {
			cursor: not-allowed;
			opacity: 0.6;
		}
	}

	input[type='radio'] {
		appearance: none;
		--_radio-size: var(--radio-size, 1.125rem);
		--_radio-inner-size: calc(var(--_radio-size) * var(--radio-indicator-size-ratio, 0.45));
		--_radio-border-color: var(--radio-border-color, oklch(0.73 0.001 271));
		--_radio-border-width: var(--radio-border-width, 2px);
		--_radio-focus-color: var(--radio-focus-color, var(--clr-brand-400, oklch(0.511 0.246 290)));
		--_radio-focus-outline-width: var(--radio-focus-outline-width, 2px);
		--_radio-focus-outline-offset: var(--radio-focus-outline-offset, 2px);
		--_radio-indicator-color: var(
			--radio-indicator-color,
			var(--clr-brand-500, oklch(0.429 0.23 287))
		);
		--_radio-indicator-color: var(
			--radio-indicator-color,
			var(--clr-brand-500, oklch(0.429 0.23 287))
		);

		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--_radio-size);
		aspect-ratio: 1/1;
		border: var(--_radio-border-width) solid var(--_radio-border-color);
		border-radius: 50%;
		flex-shrink: 0;
		cursor: pointer;

		&::before {
			content: '';
			display: block;
			width: var(--_radio-inner-size);
			aspect-ratio: 1/1;
			border-radius: 50%;
			background-color: var(--_radio-indicator-color);
			scale: 0;
			transition: scale 0.15s ease-in-out;
		}

		&:checked {
			border-color: var(--_radio-indicator-color);

			&::before {
				scale: 1;
			}
		}

		&:focus-visible {
			outline: var(--_radio-focus-outline-width) solid var(--_radio-focus-color);
			outline-offset: var(--_radio-focus-outline-offset);
		}

		@media (prefers-reduced-motion: reduce) {
			&::before {
				transition-duration: 0.01ms;
			}
		}
	}
</style>
