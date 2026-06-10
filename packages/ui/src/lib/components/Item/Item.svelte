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

<svelte:element
	this={as}
	data-component="item"
	class={[className]}
	data-variant="default"
	{...rest}
>
	<div class="item-inner flex-group nowrap">
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
		<div class="item-content flex-group">
			{@render children?.()}
		</div>
		{#if actions}
			<div class="item-actions">
				{@render actions()}
			</div>
		{/if}
	</div>
</svelte:element>

<style>
	[data-component='item'] {
		--_item-background: var(--item-background, transparent);
		--_item-background-base: var(--item-background, transparent);
		--_item-padding: var(--item-padding, 0.5rem 1rem);
		--_item-border-radius: var(--item-border-radius, 0.5rem);
		--_item-border-width: var(--item-border-width, 0px);
		--_item-border-color: var(--item-border-color, oklch(73.481% 0.00008 271.152));
		--_item-color: var(--item-color, currentColor);
		--_item-gap: var(--item-gap, 0.5rem);
		--_item-media-size: var(--item-media-size, 4rem);

		--_flex-container-width: 100%;
		--flow-spacer: var(--_item-gap, 0.5rem);
		background: var(--_item-background);
		color: var(--_item-color);
		padding: var(--_item-padding);
		border-radius: var(--_item-border-radius);
		border: var(--_item-border-width) solid var(--_item-border-color);
	}

	.item-inner {
		gap: var(--_item-gap);
	}

	/* when a header slot is present, allow wrapping so header spans the full row */
	.item-inner:has(.item-header) {
		flex-wrap: wrap;
	}

	.item-header {
		flex: 0 0 100%;
	}

	/* only apply hover/active styles to interactive elements */
	[data-component='item']:is(a, button, [role='option'], [tabindex='0'], option):is(
			:hover,
			:focus-visible
		) {
		--_item-background: var(
			--item-background-hover,
			oklch(from var(--_item-background-base) calc(l - 10) c h)
		);
		--_item-border-color: var(--item-border-color-hover, oklch(73.481% 0.00008 271.152));
		--_item-color: var(--item-color-hover, currentColor);
		cursor: pointer;
	}

	[data-component='item']:is(a, button, [role='option'], [tabindex='0'], option):active {
		--_item-background: var(
			--item-background-active,
			oklch(from var(--_item-background-base) calc(l + 10) c h)
		);
		--_item-border-color: var(--item-border-color-active, oklch(73.481% 0.00008 271.152));
		--_item-color: var(--item-color-active, currentColor);
	}

	.item-media {
		flex-shrink: 0;
		max-width: var(--_item-media-size);
	}

	.item-content {
		container: item / inline-size;
		gap: var(--_item-gap);
		width: var(--_flex-container-width);
	}

	.item-actions {
		display: contents;
	}
</style>
