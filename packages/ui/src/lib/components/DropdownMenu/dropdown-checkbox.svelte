<script lang="ts">
	import DropdownItem from './dropdown-item.svelte';
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

	let {
		children: childrenProp,
		checked = $bindable(false),
		keybind: keybindProp,
		...rest
	}: Props = $props();
</script>

<!--
	Delegates the <li>, layout, hover, and focus styles entirely to DropdownItem.
	Only the indicator visuals live here. The role/aria-checked spread overrides
	DropdownItem's default role="menuitem" at runtime via the {...rest} spread.

	:has(input:checked) uses :global because the <li> is rendered by DropdownItem;
	the scoped class on .dropdown-checkbox-indicator keeps the selector safe.
-->
<DropdownItem role="menuitemcheckbox" aria-checked={checked} keybind={keybindProp}>
	<label class="flex-group | nowrap">
		<span class="dropdown-checkbox-indicator" aria-hidden="true"></span>
		<input type="checkbox" bind:checked {...rest} />
		{@render childrenProp?.()}
	</label>
</DropdownItem>

<style lang="scss">
	label {
		--_flex-container-width: 100%;
		cursor: pointer;
		flex-grow: 1;
	}

	/* Visually-hidden native checkbox — browser still owns checked state and keyboard toggling. */
	input[type='checkbox'] {
		position: absolute;
		opacity: 0;
		width: 0;
		height: 0;
		pointer-events: none;
	}

	.dropdown-checkbox-indicator {
		--dropdown-checkbox-size: 1em;
		--dropdown-checkbox-color: currentColor;
		--dropdown-checkbox-border: 1.5px solid currentColor;
		--dropdown-checkbox-radius: 0.25em;

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
	 * The <li> is owned by DropdownItem so we need :global to reach it.
	 * .dropdown-checkbox-indicator has a scoped hash, so this only targets
	 * indicators rendered by this component — no unintended side-effects.
	 */
	:global(li:has(input[type='checkbox']:checked)) {
		.dropdown-checkbox-indicator {
			background-color: var(--dropdown-checkbox-color);

			&::after {
				border-color: oklch(0.145 0 0);
				opacity: 1;
			}
		}
	}
</style>
