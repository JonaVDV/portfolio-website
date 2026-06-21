<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
		ref?: HTMLElement | null;
		header?: Snippet;
		action?: Snippet;
		children?: Snippet;
		footer?: Snippet;
		media?: Snippet;
		subgrid?: boolean;
	}

	let { header, ref, action, children, footer, media, subgrid, ...rest }: Props = $props();
</script>

<article class="card" data-subgrid={subgrid || undefined} bind:this={ref} {...rest}>
	{#if media}
		<div class="card-media">{@render media()}</div>
	{/if}
	{#if header || action}
		<div class="card-header">
			<div class="card-action">
				{@render action?.()}
			</div>
			{@render header?.()}
		</div>
	{/if}

	<div class="card-content">
		{@render children?.()}
	</div>

	{#if footer}
		<div class="card-footer">
			{@render footer?.()}
		</div>
	{/if}
</article>

<style>
	.card {
		--_card-background: var(--card-background, var(--clr-surface-100));
		--_card-border: var(--card-border-width, 1px) solid
			var(--card-border-color, var(--clr-surface-300));
		--_card-radius: var(--card-border-radius, var(--radius-medium));
		--_card-padding: var(--card-padding, 1rem);
		--_card-max-width: var(--card-max-width, none);
		--_card-gap: var(--card-gap, 1em);

		background-color: var(--_card-background);
		border: var(--_card-border);
		border-radius: var(--_card-radius);
		/* padding lives on sections so header/footer backgrounds extend edge-to-edge */
		padding: 0;
		max-width: var(--_card-max-width);
		container-type: inline-size;
		display: flex;
		flex-direction: column;
		gap: var(--_card-gap);
		/* clip section backgrounds to the card's border-radius */
		overflow: clip;
	}

	/* ── Sections ────────────────────────────────────────────────────────────── */

	.card-header {
		--_card-header-background: var(--card-header-background, inherit);
		--_card-header-color: var(--card-header-color, inherit);

		padding-inline: var(--card-header-padding-inline, var(--_card-padding));
		padding-block-start: var(--card-header-padding-block-start, var(--_card-padding));
		background: var(--_card-header-background);
		color: var(--_card-header-color);
		border-bottom: var(--card-header-border-bottom, none);
		position: relative;

		@container not style(--_card-header-background: inherit) {
			padding-block-end: var(--card-header-padding-block-end, var(--_card-padding));
		}
	}

	.card-content {
		padding-inline: var(--card-content-padding-inline, var(--_card-padding));
	}

	.card-footer {
		--_card-footer-background: var(--card-footer-background);
		--_card-footer-color: var(--card-footer-color, inherit);

		padding-inline: var(--card-footer-padding-inline, var(--_card-padding));
		padding-block-end: var(--card-footer-padding-block-end, var(--_card-padding));
		padding-block-start: var(--card-footer-padding-block-start, var(--_card-padding));
		background: var(--_card-footer-background);
		color: var(--_card-footer-color);
		border-top: var(--card-footer-border-top, none);
	}

	/* ── Media side-by-side layout ───────────────────────────────────────── */
	/* When .card-media is present, switch to a two-column grid */
	.card:has(.card-media) {
		display: grid;
		grid-template-columns: var(--card-media-width, auto) 1fr;
		grid-template-rows: auto 1fr auto;
		grid-template-areas:
			'media header'
			'media content'
			'media footer';

		& .card-media {
			grid-area: media;
		}
		& .card-header {
			grid-area: header;
		}
		& .card-content {
			grid-area: content;
		}
		& .card-footer {
			grid-area: footer;
		}
	}

	.card-media {
		overflow: hidden;
	}

	/* ── Subgrid ──────────────────────────────────────────────────────────── */
	/* Opt in with the subgrid prop. Parent must be a named-row grid.         */
	/* --card-subgrid-span: override if the card has more or fewer sections.  */
	.card[data-subgrid] {
		display: grid;
		grid-template-rows: subgrid;
		grid-row: var(--card-subgrid-span, span 3);
		/* container-type would prevent the parent from reading through to size rows */
		container-type: normal;
	}

	/* ── Action (float-based, same pattern as Dialog close button) ─────────── */
	.card-action {
		display: flex;
		float: inline-end;
	}
</style>
