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
		display: grid;
		gap: 0.75rem;
		padding: 1rem;
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
