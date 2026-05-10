<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLInputAttributes, 'type' | 'class'> {
		children?: Snippet;
		/**
		 * Optionally render content at the inline-end of the item (e.g. a keybind badge).
		 */
		keybind?: Snippet;
		checked?: boolean;
	}

	let { children, checked = $bindable(false), keybind, ...rest }: Props = $props();
</script>

<!--
	The <li> is the ARIA menu item. The native <input type="checkbox"> inside
	the <label> handles all checked state and keyboard toggling — no JS needed.
	CSS :has(input:checked) drives the visual check indicator, and :focus-within
	drives the hover highlight when keyboard focus lands on the input.

	As a <li> living inside <ul class="popover-full-width">, this element
	automatically sits in the `popover-content` grid column via the `> *` rule
	in _wrapper.scss — no layout class required, matching regular dropdown items.
-->
<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
<li class="flex-group | nowrap" role="menuitemcheckbox" aria-checked={checked}>
	<label class="flex-group | nowrap | dropdown-checkbox-label">
		<span class="dropdown-checkbox-indicator" aria-hidden="true"></span>
		<input type="checkbox" bind:checked {...rest} />
		{@render children?.()}
	</label>
	{#if keybind}
		{@render keybind()}
	{/if}
</li>

<style lang="scss">
	li {
		--dropdown-item-padding: 0.5rem;
		--dropdown-border-radius: 0.5rem;
		--dropdown-item-background: transparent;
		--dropdown-item-color: inherit;

		--dropdown-item-hover-background: oklch(0.269 0 0);
		--dropdown-item-hover-color: oklch(0.985 0 0);
		--dropdown-item-font-size: 0.875rem;

		/* Checkbox indicator */
		--dropdown-checkbox-size: 1em;
		--dropdown-checkbox-color: currentColor;
		--dropdown-checkbox-border: 1.5px solid currentColor;
		--dropdown-checkbox-radius: 0.25em;

		--_flex-container-width: 100%;

		border-radius: var(--dropdown-border-radius);
		background-color: var(--dropdown-item-background);
		color: var(--dropdown-item-color);
		font-size: var(--dropdown-item-font-size);

		&:is(:hover, :focus-within) {
			--dropdown-item-background: var(--dropdown-item-hover-background);
			--dropdown-item-color: var(--dropdown-item-hover-color);
		}
	}

	label {
		--_flex-container-width: 100%;
		padding: var(--dropdown-item-padding);
		cursor: pointer;
		flex-grow: 1;
	}

	/*
	 * Visually-hidden native checkbox: the browser still handles checked state,
	 * keyboard toggling, and form submission. The .dropdown-checkbox-indicator
	 * sibling provides the visible checkbox drawn entirely in CSS.
	 */
	input[type='checkbox'] {
		position: absolute;
		opacity: 0;
		width: 0;
		height: 0;
		pointer-events: none;
	}

	.dropdown-checkbox-indicator {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: var(--dropdown-checkbox-size);
		height: var(--dropdown-checkbox-size);
		border: var(--dropdown-checkbox-border);
		border-radius: var(--dropdown-checkbox-radius);

		/* Checkmark drawn as a CSS pseudo-element — no icon dependency */
		&::after {
			content: '';
			display: block;
			width: 0.55em;
			height: 0.3em;
			border-left: 2px solid transparent;
			border-bottom: 2px solid transparent;
			transform: rotate(-45deg) translateY(-0.05em);
			opacity: 0;
			transition: opacity 0.1s;
		}
	}

	/*
	 * :has() lets the <li> react to its descendant checkbox state — pure CSS,
	 * no JS event listener needed to toggle the visual indicator.
	 */
	li:has(input:checked) {
		.dropdown-checkbox-indicator {
			background-color: var(--dropdown-checkbox-color);

			&::after {
				border-color: oklch(0.145 0 0);
				opacity: 1;
			}
		}
	}
</style>
