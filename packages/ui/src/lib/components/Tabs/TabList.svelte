<script lang="ts">
	import { focusgroup } from '$lib/utils/focusgroup.svelte.js';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		children?: Snippet;
	}

	let { children }: Props = $props();
</script>

<!-- tabindex=-1: Firefox makes overflow-scroll containers keyboard-focusable, which
would put the tablist itself in the tab order ahead of the roving buttons. Opt out;
arrow keys already move focus between tabs and scroll the active one into view. -->
<div class="tablist" tabindex="-1" {@attach focusgroup({ behavior: 'tablist' })}>
	{@render children?.()}
</div>

<style>
	.tablist {
		--_tablist-gap: var(--tablist-gap, 0.25rem);
		--_tablist-padding: var(--tablist-padding, 0.125rem);
		--_tablist-border: var(--tablist-border-width, 1px) solid var(--tablist-border-color, #ccc);
		--_tablist-border-radius: var(--tablist-border-radius, 100vw);
		--_tablist-background: var(--tablist-background, #dadada);
		--_max-visible-tabs: var(--max-visible-tabs, 4);
		display: grid;
		grid-auto-flow: column;
		/* Size each column so exactly --max-visible-tabs fit the track; the rest
		   overflow-scroll. repeat() isn't valid for grid-auto-columns, so divide the
		   container width (minus the gaps between visible tabs) by the count. */
		grid-auto-columns: calc(
			(100% - (var(--_max-visible-tabs) - 1) * var(--_tablist-gap)) / var(--_max-visible-tabs)
		);
		border: var(--_tablist-border);
		border-radius: var(--_tablist-border-radius);
		padding: var(--_tablist-padding);
		scroll-snap-type: x mandatory;
		scrollbar-gutter: stable;
		background: var(--_tablist-background);
		scrollbar-width: thin;
		gap: var(--_tablist-gap);
		overflow-x: auto;
	}
</style>
