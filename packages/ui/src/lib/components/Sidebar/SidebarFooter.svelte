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
		padding-block: 1rem;
		/* Same gate as SidebarItem/SidebarHeader. */
		padding-inline: min(
			var(--sidebar-footer-padding-inline, 0.5rem),
			max(0px, (100cqi - var(--sidebar-icons-only-width, 3rem)) * 9999)
		);
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
