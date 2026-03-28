<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		icon?: Snippet;
		children: Snippet;
	}

	let { title, icon, children }: Props = $props();
</script>

<details>
	<summary class="flex-group">
		{title}
		{@render icon?.()}
	</summary>
	{@render children()}
</details>

<style lang="scss">
	details::details-content {
		background-color: red;
		block-size: 0;
		transition:
			block-size 0.3s ease,
			content-visibility 0.3s ease;
		transition-behavior: allow-discrete;
	}

	details {
		overflow: hidden;
	}
	details[open]::details-content {
		block-size: auto;
	}
</style>
