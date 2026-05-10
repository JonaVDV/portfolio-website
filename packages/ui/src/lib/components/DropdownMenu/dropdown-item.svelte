<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLLiAttributes } from 'svelte/elements';

	interface Props extends HTMLLiAttributes {
		/**
		 * The `before` and `after` props can be used to render content before or after the main content of the dropdown item. The `keybind` prop is a shortcut for rendering a keybind on the right side of the dropdown item. If both `after` and `keybind` are provided, `after` will take precedence.
		 */
		keybind?: Snippet;
	}

	let { children, keybind, ...rest }: Props = $props();
</script>

<li class={['flex-group | nowrap', rest.class]} role="menuitem" {...rest}>
	{@render children?.()}
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

		--_flex-container-width: 100%;

		padding: var(--dropdown-item-padding);
		border-radius: var(--dropdown-border-radius);
		background-color: var(--dropdown-item-background);
		color: var(--dropdown-item-color);
		font-size: var(--dropdown-item-font-size);

		&:is(:hover, :focus-visible) {
			--dropdown-item-background: var(--dropdown-item-hover-background);
			--dropdown-item-color: var(--dropdown-item-hover-color);
		}
	}
</style>
