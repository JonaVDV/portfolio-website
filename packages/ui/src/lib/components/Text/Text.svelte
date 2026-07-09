<script module lang="ts">
	// Known variants ship with the library; consumers can add their own in
	// Text.variants.css and pass the name through — hence the open string union.
	export type TextVariant =
		'p' | 'strong' | 'em' | 'small' | 'lead' | 'muted' | 'none' | (string & {});
</script>

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import './Text.variants.css';

	interface TextProps extends HTMLAttributes<HTMLElement> {
		/** The element to render. Drives semantics; the browser announces it. */
		as?: keyof HTMLElementTagNameMap;
		/**
		 * The visual variant. Defaults to `as`, so element and appearance stay
		 * grouped. Pass `"none"` for base typography with no variant styling.
		 */
		variant?: TextVariant;
	}

	let { as = 'p', variant = as, children, class: className, ...rest }: TextProps = $props();
</script>

<svelte:element
	this={as}
	class={['text', className]}
	data-variant={variant === 'none' ? undefined : variant}
	{...rest}
>
	{@render children?.()}
</svelte:element>

<style>
	.text {
		/* Normalise weight and style so `variant="none"` reads as true base on any
		   element (including <strong>/<em>); variants re-add what they need. */
		font-family: var(--text-font-family, inherit);
		font-size: var(--text-font-size, inherit);
		font-weight: var(--text-font-weight, inherit);
		font-style: var(--text-font-style, inherit);
		line-height: var(--text-line-height, inherit);
		letter-spacing: var(--text-letter-spacing, inherit);
		color: var(--text-color, currentColor);
		text-wrap: var(--text-wrap, pretty);
		margin: 0;
	}
</style>
