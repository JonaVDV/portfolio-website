<script lang="ts">
	import { focusgroup } from '$lib/utils/focusgroup.svelte.js';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		children?: Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="tablist" {@attach focusgroup({ behavior: 'tablist' })}>
	{@render children?.()}
</div>

<style>
	.tablist {
		--_tablist-gap: var(--tablist-gap, 0.25rem);
		--_tablist-padding: var(--tablist-padding, 0);
		--_tablist-border: var(--tablist-border-width, 1px) solid var(--tablist-border-color, #ccc);
		--_tablist-border-radius: var(--tablist-border-radius, 0.5rem);
		--_max-visible-tabs: var(--max-visible-tabs, 4);
		/* how do i make it so we can configure the max available tabs */
		display: grid;
		border: var(--_tablist-border);
		border-radius: var(--_tablist-border-radius);
		grid-auto-flow: column;
		grid-template-columns: repeat(auto-fit, minmax(min-content, 1fr));
		padding: var(--_tablist-padding);
		/* scroll-snap-type: x mandatory; */
		scrollbar-gutter: stable;
		gap: var(--_tablist-gap);
		overflow-x: auto;
	}
</style>
