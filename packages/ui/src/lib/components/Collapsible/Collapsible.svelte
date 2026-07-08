<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLDetailsAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLDetailsAttributes, 'children' | 'title' | 'open' | 'name'> {
		/** The clickable trigger. String or snippet for rich markup. */
		trigger: Snippet | string;
		/** The collapsible content. */
		children?: Snippet;
		/** Whether it starts open. */
		open?: boolean;
		/** Shared name groups multiple collapsibles into an exclusive (accordion) set. */
		name?: string;
	}

	let { trigger, children, open = $bindable(false), name, ...rest }: Props = $props();
</script>

<!--
	@component A minimal show/hide built on native <details>/<summary> — no box,
	no chrome (use Accordion for that). Keyboard + ARIA come for free. Height
	animates where ::details-content is supported, and still works without it.

	@example
		<Collapsible trigger="More options">
			<p>Hidden content.</p>
		</Collapsible>
-->

<details class="collapsible" bind:open {name} {...rest}>
	<summary class="collapsible-trigger">
		{#if typeof trigger === 'string'}
			{trigger}
		{:else}
			{@render trigger()}
		{/if}
	</summary>
	<div class="collapsible-content">
		{@render children?.()}
	</div>
</details>

<style>
	.collapsible {
		--_collapsible-duration: var(--collapsible-transition-duration, 300ms);
		--_collapsible-easing: var(--collapsible-transition-easing, ease-in-out);
	}

	.collapsible-trigger {
		cursor: pointer;
		user-select: none;
		list-style: none; /* drop the default disclosure triangle */
	}
	.collapsible-trigger::-webkit-details-marker {
		display: none; /* Safari */
	}

	/* Progressive enhancement: animate open/close where supported. */
	.collapsible::details-content {
		block-size: 0;
		overflow: hidden;
		transition:
			block-size var(--_collapsible-duration) var(--_collapsible-easing),
			content-visibility var(--_collapsible-duration) var(--_collapsible-easing);
		transition-behavior: allow-discrete;
	}
	.collapsible[open]::details-content {
		block-size: auto;
	}
</style>
