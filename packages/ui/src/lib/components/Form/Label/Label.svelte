<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLLabelAttributes } from 'svelte/elements';

	interface Props extends HTMLLabelAttributes {
		child?: Snippet;
	}

	let { children, child, ...rest }: Props = $props();
</script>

{#if child}
	{@render child?.()}
{:else}
	<label {...rest}>
		{@render children?.()}
	</label>
{/if}

<style>
	label {
		--_label-color: var(--label-color, currentColor);
		--_label-font-size: var(--label-font-size, inherit);
		color: var(--_label-color);
		font-size: var(--_label-font-size);
	}
</style>
