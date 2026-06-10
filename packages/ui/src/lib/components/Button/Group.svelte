<script lang="ts">
	import type { Snippet } from 'svelte';

	interface ButtonGroupProps {
		children?: Snippet;
	}

	let { children }: ButtonGroupProps = $props();
</script>

<div class="button-group">
	{@render children?.()}
</div>

<style>
	.button-group {
		display: inline-flex;
		gap: 0.5rem;
	}
</style>
