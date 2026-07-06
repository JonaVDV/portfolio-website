<script module lang="ts">
	export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
	// Built-in size variants match the levels; consumers can add their own
	// (e.g. `display`, `eyebrow`) in Heading.variants.css — hence the open union.
	export type HeadingVariant = HeadingLevel | 'none' | (string & {});
</script>

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import './Heading.variants.css';

	interface Props extends HTMLAttributes<HTMLHeadingElement> {
		/** Semantic level to render (h1–h6). Drives document outline and AT. */
		level?: HeadingLevel;
		/**
		 * Visual variant. Defaults to `level`, so size and semantics stay grouped.
		 * Set it to a different level (e.g. `level="h1" variant="h3"`) to decouple
		 * the look from the outline, or `"none"` for base styling only.
		 */
		variant?: HeadingVariant;
	}

	let { level = 'h2', variant = level, children, class: className, ...rest }: Props = $props();
</script>

<svelte:element
	this={level}
	class={['heading', className]}
	data-variant={variant === 'none' ? undefined : variant}
	{...rest}
>
	{@render children?.()}
</svelte:element>

<style>
	.heading {
		/* Read public vars with a fallback; variants set them per size. Nothing is
		   written to a public var here, so consumer overrides never leak. */
		font-family: var(--heading-font-family, var(--ff-headings));
		font-size: var(--heading-font-size, var(--fs-700));
		font-weight: var(--heading-font-weight, var(--fw-bold));
		line-height: var(--heading-line-height, 1.1);
		letter-spacing: var(--heading-letter-spacing, normal);
		text-transform: var(--heading-text-transform, none);
		color: var(--heading-color, inherit);
		text-wrap: var(--heading-text-wrap, balance);
		margin: 0;
	}
</style>
