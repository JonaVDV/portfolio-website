<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		label: string | Snippet;
		children?: Snippet;
	}

	let { label, children }: Props = $props();
</script>

<div class="dropdown-group">
	{#if typeof label === 'string'}
		<p class="dropdown-group-label">{label}</p>
	{:else}
		<p class="dropdown-group-label">{@render label?.()}</p>
	{/if}
	<ul>
		{@render children?.()}
	</ul>
</div>


<style>
    .dropdown-group {
        display: grid;
    }
</style>