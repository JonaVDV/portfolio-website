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
		--sidebar-footer-padding-inline: 0.5rem;
		--sidebar-footer-padding-block: 0.5rem;
		display: grid;
		gap: 0.75rem;
		padding-block: var(--sidebar-footer-padding-block, 0.5rem);
		/*
		 * Not gated — kept at 0.5rem even in icon-only mode, matching SidebarSection.
		 * Items use this variable to compute their centering offset; gating it to 0
		 * while the variable stays 0.5rem would make the math lie.
		 * The aside's overflow-x: hidden clips any visual overflow.
		 */
		padding-inline: var(--sidebar-footer-padding-inline, 0.5rem);
		background-color: var(--clr-surface-100);
		border-block-start: 1px solid var(--sidebar-border, #{$clr-surface-200});
		isolation: isolate;
	}

	.sidebar-footer[data-sticky='true'] {
		position: sticky;
		bottom: 0;
		z-index: 1;
	}
</style>
