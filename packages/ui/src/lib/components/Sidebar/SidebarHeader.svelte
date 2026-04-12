<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<section class="sidebar-header">
	{@render children()}
</section>

<style lang="scss">
	@use '../../styles/abstracts/' as *;

	.sidebar-header {
		display: grid;
		gap: 0.75rem;
		padding: 1rem;
		border-block-end: 1px solid var(--sidebar-border, #{$clr-surface-200});
	}
</style>
