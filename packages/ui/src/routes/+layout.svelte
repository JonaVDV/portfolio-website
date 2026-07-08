<script lang="ts">
	import '$styles/main.css';
	import '$styles/fonts.css';
	import type { Snippet } from 'svelte';
	let { children }: { children: Snippet } = $props();
</script>

{@render children()}
