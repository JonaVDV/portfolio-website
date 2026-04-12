<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
		sticky?: boolean;
		layout?:
			| 'full'
			| 'full-start'
			| 'full-end'
			| 'content'
			| 'content-start'
			| 'content-end'
			| 'full-content'
			| 'full-content-nopadding'
			| 'full-width';
	}

	let { children, sticky, layout = 'full-width' }: Props = $props();
</script>

<header style:position={sticky ? 'sticky' : 'static'} class="header | {layout}">
	{@render children?.()}
</header>

<style lang="scss">
	@use '../../styles/abstracts/' as *;

	header {
	}
</style>
