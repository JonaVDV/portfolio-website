<script lang="ts">
	import DropdownItem from './DropdownMenuItem.svelte';
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
<DropdownItem raw keybind={keybindProp}>
	<label class="flex-group | nowrap">
		<span class="dropdown-checkbox-indicator" aria-hidden="true"></span>
		<!-- The native input is the focusable menu item: role="menuitemcheckbox"
		     makes it announce correctly, and focusgroup roves to it. -->
		<input type="checkbox" role="menuitemcheckbox" aria-checked={checked} bind:checked {...rest} />
		{@render childrenProp?.()}
	</label>
</DropdownItem>

<style>
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
		--_dropdown-checkbox-size: var(--dropdown-checkbox-size, 1em);
		--_dropdown-checkbox-color: var(--dropdown-checkbox-color, inherit);
		--_dropdown-checkbox-check-color: var(--dropdown-checkbox-check-color, currentColor);
		--_dropdown-checkbox-border: var(--dropdown-checkbox-border, 1.5px solid currentColor);
		--_dropdown-checkbox-radius: var(--dropdown-checkbox-radius, 0.25em);
		--_dropdown-checkbox-check-width: var(--dropdown-checkbox-check-width, 0.55em);
		--_dropdown-checkbox-check-height: var(--dropdown-checkbox-check-height, 0.3em);
		--_dropdown-checkbox-check-thickness: var(--dropdown-checkbox-check-thickness, 2px);

		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: var(--_dropdown-checkbox-size);
		aspect-ratio: 1/1;
		border: var(--_dropdown-checkbox-border);
		border-radius: var(--_dropdown-checkbox-radius);

		/* Checkmark drawn as a CSS pseudo-element — no icon dependency */
		&::after {
			content: '';
			display: block;
			width: var(--_dropdown-checkbox-check-width);
			height: var(--_dropdown-checkbox-check-height);
			border-left: var(--_dropdown-checkbox-check-thickness) solid transparent;
			border-bottom: var(--_dropdown-checkbox-check-thickness) solid transparent;
			transform: rotate(-45deg) translateY(-0.1em);
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
			background-color: var(--_dropdown-checkbox-color);

			&::after {
				border-color: var(--_dropdown-checkbox-check-color);
				opacity: 1;
			}
		}
	}
</style>
