<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<footer class="sidebar-footer">
	{@render children()}
</footer>

<style lang="scss">
	@use '../../styles/abstracts/' as *;

	.sidebar-footer {
		display: grid;
		gap: 0.75rem;
		padding: 1rem;
		border-block-start: 1px solid var(--sidebar-border, #{$clr-surface-200});
	}
</style>
