<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		sticky?: boolean;
	}

	let { children, sticky = false }: Props = $props();
</script>

<section class="sidebar-header" style:position={sticky ? 'sticky' : 'static'}>
	{@render children()}
</section>

<style lang="scss">
	@use '../../styles/abstracts/' as *;

	.sidebar-header {
		top: 0;
		width: 100%;
		padding-inline: var(--sidebar-header-padding, 0.75rem);
		border-block-end: var(--sidebar-header-border-color) var(--sidebar-header-border-width, 1px)
			solid;
	}
</style>
