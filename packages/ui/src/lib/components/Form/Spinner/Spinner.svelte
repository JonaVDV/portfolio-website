<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<SVGElement> {
		size?: string | number;
	}

	let { size }: Props = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="2"
	stroke-linecap="round"
	stroke-linejoin="round"
	class="spinner lucide-icon lucide animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg
>

<style>
	.spinner {
		stroke: var(--spinner-color, currentColor);
		stroke-width: var(--spinner-stroke-width, 2);
		aspect-ratio: 1;
	}

	@keyframes spin {
		to {
			rotate: 360deg;
		}
	}

	.animate-spin {
		animation: spin 1s linear infinite;
	}
</style>
