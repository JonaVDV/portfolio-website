<script lang="ts">
	import type { Snippet } from 'svelte';

	interface BreadcrumbsProps {
		children?: Snippet;
	}

	let { children }: BreadcrumbsProps = $props();
</script>

<nav aria-label="Breadcrumb" class="breadcrumbs" data-component="breadcrumbs">
	<ol class="breadcrumbs-list | flex-group">
		{@render children?.()}
	</ol>
</nav>

<style>
	.breadcrumbs {
		--_breadcrumbs-gap: var(--breadcrumbs-gap, 0.5rem);
		--_breadcrumbs-color: var(--breadcrumbs-color, oklch(50% 0.01 271));
		--_breadcrumbs-separator: var(--breadcrumbs-separator, '/');
		display: block;
	}

	.breadcrumbs-list {
		--flex-gap: var(--_breadcrumbs-gap);
	}
</style>
