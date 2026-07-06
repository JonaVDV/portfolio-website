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
		/**
		 * Whether this radio option is currently selected. Derive this from your own
		 * state (e.g. `checked={selectedView === 'grid'}`). The browser enforces mutual
		 * exclusivity within a `name` group natively — no JS needed.
		 */
		checked?: boolean;
	}

	let { children: childrenProp, checked = false, keybind: keybindProp, ...rest }: Props = $props();
</script>

<!--
	Delegates the <li>, layout, hover, and focus styles entirely to DropdownItem.
	Only the indicator visuals live here. The role/aria-checked spread overrides
	DropdownItem's default role="menuitem" at runtime via the {...rest} spread.

	:has(input:checked) uses :global because the <li> is rendered by DropdownItem;
	the scoped class on .dropdown-radio-indicator keeps the selector safe.
-->
<DropdownItem raw keybind={keybindProp}>
	<label class="flex-group | nowrap">
		<span class="dropdown-radio-indicator" aria-hidden="true"></span>
		<!-- The native input is the focusable menu item: role="menuitemradio"
		     makes it announce correctly, and focusgroup roves to it. -->
		<input type="radio" role="menuitemradio" aria-checked={checked} {checked} {...rest} />
		{@render childrenProp?.()}
	</label>
</DropdownItem>

<style>
	label {
		--_flex-container-width: 100%;
		cursor: pointer;
		flex-grow: 1;
	}

	/* Visually-hidden native radio — browser still owns checked state and keyboard toggling. */
	input[type='radio'] {
		position: absolute;
		opacity: 0;
		width: 0;
		height: 0;
		pointer-events: none;
	}

	.dropdown-radio-indicator {
		--dropdown-radio-size: 1em;
		--dropdown-radio-color: currentColor;
		--dropdown-radio-border: 1.5px solid currentColor;

		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: var(--dropdown-radio-size);
		height: var(--dropdown-radio-size);
		border: var(--dropdown-radio-border);
		border-radius: 50%;

		/* Filled dot for selected state */
		&::after {
			content: '';
			display: block;
			width: 0.45em;
			height: 0.45em;
			border-radius: 50%;
			background-color: transparent;
			transition: background-color 0.1s;
		}
	}

	/*
	 * The <li> is owned by DropdownItem so we need :global to reach it.
	 * .dropdown-radio-indicator has a scoped hash, so this only targets
	 * indicators rendered by this component — no unintended side-effects.
	 */
	:global(li:has(input[type='radio']:checked)) {
		.dropdown-radio-indicator {
			border-color: var(--dropdown-radio-color);

			&::after {
				background-color: var(--dropdown-radio-color);
			}
		}
	}
</style>
