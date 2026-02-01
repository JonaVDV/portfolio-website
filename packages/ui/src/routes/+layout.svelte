<script lang="ts">
	import '$styles/main.scss';
	import type { Snippet } from 'svelte';
	let { children }: { children: Snippet } = $props();
</script>

{@render children()}
