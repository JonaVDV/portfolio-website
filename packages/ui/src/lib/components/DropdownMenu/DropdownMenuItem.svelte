<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes, HTMLLiAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLLiAttributes, 'onclick'> {
		/**
		 * Render content at the inline-end of the item (e.g. a keybind badge).
		 */
		keybind?: Snippet;
		/**
		 * Render children directly inside the `<li>` instead of wrapping them in a
		 * focusable `<button>`. Used by checkbox/radio items, which supply their own
		 * focusable control (the native `<input>`). Defaults to `false`.
		 */
		raw?: boolean;
		/** Click handler forwarded to the inner `<button>` (ignored when `raw`). */
		onclick?: HTMLButtonAttributes['onclick'];
		/** Disables the inner `<button>` (ignored when `raw`). */
		disabled?: boolean;
	}

	let {
		children,
		keybind,
		raw = false,
		onclick,
		disabled,
		class: className,
		role,
		...rest
	}: Props = $props();
</script>

<!--
	Actionable items wrap their content in a real <button>: it is the menu item's
	focusable element (role="menuitem"), gives keyboard activation for free, and
	is what `focusgroup` roves between. `raw` items (checkbox/radio) skip the
	button because their native <input> is already the focusable control.
-->
{#if raw}
	<li class={['dropdown-item | flex-group | nowrap', className]} {role} {...rest}>
		{@render children?.()}
		{#if keybind}
			{@render keybind()}
		{/if}
	</li>
{:else}
	<li class={['dropdown-item', className]} {...rest}>
		<button
			type="button"
			role="menuitem"
			class="dropdown-item-button | flex-group | nowrap"
			{onclick}
			{disabled}
		>
			{@render children?.()}
			{#if keybind}
				{@render keybind()}
			{/if}
		</button>
	</li>
{/if}

<style>
	li {
		/* Public hooks fall back to private defaults (STYLE.md §1). Consumers
		   override the unprefixed vars; the component only ever reads the `_` ones. */
		--_dropdown-item-padding: var(--dropdown-item-padding, 0.5rem);
		--_dropdown-item-border-radius: var(--dropdown-item-border-radius, 0.5rem);
		--_dropdown-item-background: var(--dropdown-item-background, transparent);
		--_dropdown-item-color: var(--dropdown-item-color, inherit);
		--_dropdown-item-font-size: var(--dropdown-item-font-size, 0.875rem);
		--_dropdown-item-gap: var(--dropdown-item-gap, 0.5rem);

		--_dropdown-item-hover-background: var(--dropdown-item-hover-background, oklch(0.269 0 0));
		--_dropdown-item-hover-color: var(--dropdown-item-hover-color, oklch(0.985 0 0));

		--_flex-container-width: 100%;
		--flex-gap: var(--_dropdown-item-gap);

		--kbd-padding: 0;

		border-radius: var(--_dropdown-item-border-radius);
		background-color: var(--_dropdown-item-background);
		color: var(--_dropdown-item-color);
		font-size: var(--_dropdown-item-font-size);
		margin-inline-end: auto;
		list-style: none;
		width: 100%;

		&:is(:hover, :focus-within) {
			--_dropdown-item-background: var(--_dropdown-item-hover-background);
			--_dropdown-item-color: var(--_dropdown-item-hover-color);
		}
	}

	/* Raw items (checkbox/radio) pad the <li> directly; their inner control sits
	   within it. The .flex-group class is only present on raw items. */
	li.flex-group {
		padding: var(--_dropdown-item-padding);
	}

	/* The button owns the padding so the entire row is a click/focus target. */
	.dropdown-item-button {
		appearance: none;
		display: flex;
		align-items: center;
		width: 100%;
		padding: var(--_dropdown-item-padding);
		font: inherit;
		color: inherit;
		cursor: pointer;
		min-width: max-content;
		border: none;
		outline: 0;
		background: none;
	}
</style>
