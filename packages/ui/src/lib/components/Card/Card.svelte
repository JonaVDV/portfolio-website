<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type CssProps =
		| '--card-max-width'
		| '--card-header-background'
		| '--card-footer-background'
		| '--card-background'
		| '--card-gap'
		| '--card-border'
		| '--card-padding'
		| '--card-padding-inline'
		| '--card-padding-block'
		| '--card-border-radius'
		| '--card-header-padding'
		| '--card-footer-padding';

	type Props = HTMLAttributes<HTMLElement> & {
		action?: Snippet;
		header?: Snippet;
		footer?: Snippet;
	} & {
		[K in CssProps]?: string;
	};

	let { children, class: className, header, action, footer, ...rest }: Props = $props();
</script>

<article class={['card', className]} {...rest}>
	{#if header || action}
		<header class="card-header">
			{#if action}
				<div class="card-header-inner">
					<div class="card-action">{@render action()}</div>
					{@render header?.()}
				</div>
			{/if}
			{#if !action}
				{@render header?.()}
			{/if}
		</header>
	{/if}
	<div class="card-content">
		{@render children?.()}
	</div>
	{#if footer}
		<footer class="card-footer">
			{@render footer()}
		</footer>
	{/if}
</article>

<style>
	.card {
		--_card-background: var(--card-background, white);
		--_card-gap: var(--card-gap, 1rem);
		--_card-border: var(
			--card-border,
			var(--card-border-width, 1px) solid var(--card-border-color, var(--clr-surface-300, #e0e0e0))
		);
		/* --card-padding is a single length that seeds both axes; override an axis
		   with --card-padding-inline / --card-padding-block. */
		--_card-pad-inline: var(--card-padding-inline, var(--card-padding, 1rem));
		--_card-pad-block: var(--card-padding-block, var(--card-padding, 1rem));
		--_card-max-width: var(--card-max-width, 100%);
		--_card-border-radius: var(--card-border-radius, 0.5rem);

		display: grid;
		/* prettier-ignore */
		grid-template-columns:
			[full-width-start] var(--_card-pad-inline)
			[content-start] 1fr
			[content-end] var(--_card-pad-inline)
			[full-width-end];
		row-gap: var(--_card-gap);
		max-width: var(--_card-max-width);
		background: var(--_card-background);
		border: var(--_card-border);
		border-radius: var(--_card-border-radius);
		padding-block: var(--_card-pad-block);
		/* clips bled media corners to the card radius (no per-image rounding needed) */
		overflow: clip;
	}

	.card-header,
	.card-footer,
	.card-content {
		grid-column: full-width;
		display: grid;
		grid-template-columns: subgrid;
		row-gap: var(--card-content-gap, 0);
	}

	/* Header/footer: background bleeds edge-to-edge, text stays inset by the tracks. */
	.card-header {
		position: relative; /* anchor for the absolutely-placed action */
		background: var(--card-header-background, var(--_card-background));
		padding-block: var(--card-header-padding, var(--_card-pad-block));
	}

	.card-action {
		float: inline-end;
		margin-inline-start: var(--_card-gap);
	}

	.card-footer {
		background: var(--card-footer-background, var(--_card-background));
		padding-block: var(--card-footer-padding, var(--_card-pad-block));
	}

	/* A section owns its own block padding, so the card drops its own on that edge. */
	.card:has(.card-header) {
		padding-block-start: 0;
	}

	.card:has(.card-footer) {
		padding-block-end: 0;
	}

	/* Children come from the consumer (unscoped), so section-child rules are :global. */
	:is(.card-header, .card-footer, .card-content) > :global(*) {
		grid-column: content;
	}

	/* Edge media (img / [data-card-media]) and opt-in breakout (.full / [data-card-full]). */
	:is(.card-header, .card-footer, .card-content)
		:global(:is(img, [data-card-media], .full, [data-card-full])) {
		grid-column: full-width;
	}

	:is(.card-header, .card-footer, .card-content) :global(img) {
		display: block;
		width: 100%;
		object-fit: cover;
	}

	.card-header:has(:global(:is(img, [data-card-media]):first-child)),
	.card:not(:has(.card-header)):has(
			.card-content:first-child > :global(:is(img, [data-card-media]):first-child)
		) {
		padding-block-start: 0;
	}

	.card-footer:has(> :global(:is(img, [data-card-media]):last-child)),
	.card:not(:has(.card-footer)):has(
			.card-content:last-child > :global(:is(img, [data-card-media]):last-child)
		) {
		padding-block-end: 0;
	}
</style>
