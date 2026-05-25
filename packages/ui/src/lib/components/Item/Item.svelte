<script lang="ts" generics="TTag extends keyof SvelteHTMLElements">
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	type Props = SvelteHTMLElements[TTag] & {
		as?: TTag;
		header?: Snippet;
		actions?: Snippet;
		media?: Snippet;
	};

	let {
		as = 'div' as TTag,
		header,
		actions,
		media,
		children,
		class: className,
		...rest
	}: Props = $props();
</script>

<svelte:element this={as} data-component="item" class={[className, 'flex-group nowrap']} {...rest}>
	{#if header}
		<div class="item-header">
			{@render header()}
		</div>
	{/if}
	{#if media}
		<div class="item-media">
			{@render media()}
		</div>
	{/if}
	<div class="item-content | flow">
		{@render children?.()}
	</div>
	{#if actions}
		<div class="item-actions">
			{@render actions()}
		</div>
	{/if}
</svelte:element>

<style>
	[data-component='item'] {
		--_item-background: var(--item-background, oklch(27.685% 0.01 271));
		--_item-background-base: var(--item-background, oklch(27.685% 0.01 271));
		--_item-padding: var(--item-padding, 0.5rem 1rem);
		--_item-border-radius: var(--item-border-radius, 0.5rem);
		--_item-border-width: var(--item-border-width, 1px);
		--_item-border-color: var(--item-border-color, oklch(73.481% 0.00008 271.152));
		--_item-color: var(--item-color, oklch(100% 0.00011 271.152));
		--_item-gap: var(--item-gap, 0.5rem);
		--_item-media-size: var(--item-media-size, 4rem);

		--_flex-container-width: 100%;
		--flow-spacer: var(--_item-gap, 0.5rem);
		background: var(--_item-background);
		color: var(--_item-color);
		padding: var(--_item-padding);
		border-radius: var(--_item-border-radius);
		border: var(--_item-border-width) solid var(--_item-border-color);
		gap: var(--_item-gap);
	}

	/* when a header slot is present, allow wrapping so header spans the full row */
	[data-component='item']:has(.item-header) {
		flex-wrap: wrap;
	}

	.item-header {
		flex: 0 0 100%;
	}

	/* for if the component is an a tag */
	[data-component='item']:is(:hover, :focus-visible) {
		--_item-background: var(
			--item-background-hover,
			oklch(from var(--_item-background-base) calc(l - 10) c h)
		);
		--_item-border-color: var(--item-border-color-hover, oklch(73.481% 0.00008 271.152));
		--_item-color: var(--item-color-hover, oklch(100% 0.00011 271.152));
		cursor: pointer;
	}

	[data-component='item']:is(:active) {
		--_item-background: var(
			--item-background-active,
			oklch(from var(--_item-background-base) calc(l + 10) c h)
		);
		--_item-border-color: var(--item-border-color-active, oklch(73.481% 0.00008 271.152));
		--_item-color: var(--item-color-active, oklch(100% 0.00011 271.152));
	}

	.item-media {
		flex-shrink: 0;
		/* background-color: oklab(from color l a b); */
		max-width: var(--_item-media-size);
	}

	.item-content {
		container: item / inline-size;
		width: var(--_flex-container-width);
	}

	.item-actions {
		display: contents;
	}
</style>
