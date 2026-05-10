<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		sticky?: boolean;
	}

	let { children, sticky = true }: Props = $props();
</script>

<footer class="sidebar-footer" data-sticky={sticky}>
	{@render children()}
</footer>

<style lang="scss">
	@use '../../styles/abstracts/' as *;

	.sidebar-footer {
		--_sidebar-footer-padding-inline: var(--sidebar-footer-padding-inline, 0.5rem);
		--_sidebar-footer-padding-block: var(--sidebar-footer-padding-block, 0.5rem);
		--_sidebar-footer-border-width: var(--sidebar-footer-border-width, 0px);
		--_sidebar-footer-border-color: var(--sidebar-footer-border-color, transparent);
		display: grid;
		gap: 0.75rem;
		padding-block: var(--_sidebar-footer-padding-block);
		/*
		 * Not gated — kept at 0.5rem even in icon-only mode, matching SidebarSection.
		 * Items use this variable to compute their centering offset; gating it to 0
		 * while the variable stays 0.5rem would make the math lie.
		 * The aside's overflow-x: hidden clips any visual overflow.
		 */
		padding-inline: var(--_sidebar-footer-padding-inline);
		background-color: var(--sidebar-background, var(--clr-surface-100));
		border-block-start: var(--_sidebar-footer-border-width) solid
			var(--_sidebar-footer-border-color);
		isolation: isolate;
	}

	.sidebar-footer[data-sticky='true'] {
		position: sticky;
		bottom: 0;
		z-index: 1;
	}
</style>
