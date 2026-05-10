<script lang="ts">
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

	let { children, checked = $bindable(false), keybind, ...rest }: Props = $props();
</script>

<!--
	Radio items sharing the same `name` attribute are mutually exclusive by the
	browser with zero JavaScript. The consumer provides `name` (and `value`) as
	regular HTML attributes via {...rest}; the browser ensures only one radio in
	the group can be checked at a time.

	To read which option is selected, listen to the `change` event on the <ul>
	or the individual items, or pass `checked={selectedValue === itemValue}` to
	keep `aria-checked` in sync with your own reactive state.

	Layout: sits in the `popover-content` grid column automatically (same as
	other <li> items) because of the `> *` rule in _wrapper.scss.
-->
<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
<li class="flex-group | nowrap" role="menuitemradio" aria-checked={checked}>
	<label class="flex-group | nowrap | dropdown-radio-label">
		<span class="dropdown-radio-indicator" aria-hidden="true"></span>
		<input type="radio" {checked} {...rest} />
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

		/* Radio indicator */
		--dropdown-radio-size: 1em;
		--dropdown-radio-color: currentColor;
		--dropdown-radio-border: 1.5px solid currentColor;

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

	/* Visually-hidden native radio — see checkbox component for rationale. */
	input[type='radio'] {
		position: absolute;
		opacity: 0;
		width: 0;
		height: 0;
		pointer-events: none;
	}

	.dropdown-radio-indicator {
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

	/* CSS :has() reacts to descendant radio state — no JS needed. */
	li:has(input:checked) {
		.dropdown-radio-indicator {
			border-color: var(--dropdown-radio-color);

			&::after {
				background-color: var(--dropdown-radio-color);
			}
		}
	}
</style>
