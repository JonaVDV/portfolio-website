<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends HTMLInputAttributes {
		// Optional: custom checked icon. Without it, the CSS url() icon is used (works with no JS).
		checkmark?: Snippet;
	}

	let {
		checked = $bindable(false),
		// indeterminate has no HTML attribute — it is a JS-only DOM property, so binding is required.
		indeterminate = $bindable(false),
		checkmark,
		...rest
	}: Props = $props();
</script>

<div class="grid-stack">
	<input type="checkbox" bind:checked bind:indeterminate {...rest} />
	<!-- .default => render the url() icon via mask (no-JS fallback); otherwise the snippet wins. -->
	<div class="checked" class:default={!checkmark} aria-hidden="true">
		{#if checkmark}
			{@render checkmark()}
		{/if}
	</div>
</div>

<style lang="scss">
	// Registered so it can be transitioned; consumers read it to animate the icon.
	@property --checkbox-checked {
		syntax: '<number>';
		inherits: true;
		initial-value: 0;
	}

	.grid-stack {
		// Default icons as masks (colour comes from --checkbox-checkmark-color, so they theme).
		--_checkbox-checkmark: var(
			--checkbox-checkmark-image,
			url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 6 9 17l-5-5'/%3E%3C/svg%3E")
		);
		--_checkbox-indeterminate: var(
			--checkbox-indeterminate-image,
			url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='3' stroke-linecap='round'%3E%3Cpath d='M5 12h14'/%3E%3C/svg%3E")
		);
		--_checkbox-icon-size: calc(var(--checkbox-size, 1.25rem) * var(--checkbox-checkmark-scale, .75));

		display: grid;
		grid-template-areas: 'stack';
		place-items: center;
		width: fit-content;
		& > * {
			grid-area: stack;
		}
	}

	input[type='checkbox'] {
		--_checkbox-border-color: var(--checkbox-border-color, #ccc);
		width: var(--checkbox-size, 1.25rem);
		aspect-ratio: 1 / 1;
		margin: 0;
		appearance: none;
		border: 1px solid var(--_checkbox-border-color);
		border-radius: var(--checkbox-border-radius, 0.25rem);

		&:hover {
			--_checkbox-border-color: var(--checkbox-border-hover-color, #ccc);
		}
		&:focus-visible {
			--_checkbox-border-color: var(--checkbox-border-focus-color, #ccc);
			outline: 0;
		}
		&:is(:checked, :indeterminate) {
			--_checkbox-border-color: var(--checkbox-border-checked-color, #ccc);
			background-color: var(--checkbox-checked-background, transparent);
		}
	}

	// No-logic interactivity: CSS drives visibility off :checked. Works without JS.
	.checked {
		--checkbox-checked: 0;
		width: var(--_checkbox-icon-size);
		aspect-ratio: 1 / 1;
		display: grid;
		place-items: center;
		pointer-events: none;
		color: var(--checkbox-checkmark-color, currentColor);
		opacity: var(--checkbox-checked);
		// Snap by default (0s). Set --checkbox-transition to animate: the registered
		// --checkbox-checked number interpolates 0->1, so anything derived from it
		// (opacity, stroke-dashoffset, scale, ...) animates with no extra transition.
		transition: --checkbox-checked var(--checkbox-transition, 0s) linear;

		&.default {
			background-color: var(--checkbox-checkmark-color, currentColor);
			mask: var(--_checkbox-checkmark) center / contain no-repeat;
		}

		// Consumer snippet SVGs: fill the box and inherit the themeable colour.
		:global(svg) {
			width: 100%;
			height: 100%;
			stroke: currentColor;
		}
	}

	input:checked ~ .checked {
		--checkbox-checked: 1;
	}

	// Indeterminate is always the url() icon (own pseudo, independent of the check snippet).
	.grid-stack::after {
		content: '';
		grid-area: stack;
		width: var(--_checkbox-icon-size);
		aspect-ratio: 1 / 1;
		pointer-events: none;
		opacity: 0;
		background-color: var(--checkbox-checkmark-color, currentColor);
		mask: var(--_checkbox-indeterminate) center / contain no-repeat;
	}

	// :indeterminate wins over :checked (matches native rendering).
	.grid-stack:has(input:indeterminate) {
		&::after {
			opacity: 1;
		}
		.checked {
			opacity: 0;
		}
	}
</style>
