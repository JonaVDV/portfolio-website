<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		sticky?: boolean;
	}

	let { children, sticky = true }: Props = $props();
</script>

<section class="sidebar-header" style:position={sticky ? 'sticky' : 'static'}>
	{@render children()}
</section>

<style lang="scss">
	@use '../../styles/abstracts/' as *;

	.sidebar-header {
		--sidebar-header-padding-inline: 0.5rem;
		--sidebar-header-padding-block: 0.5rem;
		top: 0;
		width: 100%;
		/*
		 * Declared as a custom property so nested SidebarItems can inherit it
		 * and include it in their centering formula. Not gated — always 0.5rem,
		 * matching SidebarSection and SidebarFooter behaviour.
		 */
		padding-inline: var(--sidebar-header-padding-inline, 0.5rem);
		padding-block: var(--sidebar-header-padding-block, 0.5rem);
		border-block-end: var(--sidebar-header-border-color) var(--sidebar-header-border-width, 1px)
			solid;
	}
</style>
