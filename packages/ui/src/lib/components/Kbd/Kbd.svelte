<script module>
	export const cmd = '⌘';
	export const ctrl = '⌃';
	export const alt = '⌥';
	export const shift = '⇧';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLElement> {}

	let { children, ...rest }: Props = $props();
</script>

<kbd {...rest}>
	{@render children?.()}
</kbd>

<style lang="scss">
	kbd {
		--kbd-padding: 0.25rem 0.5rem;
		--kbd-background: oklch(0.269 0 0);
		--kbd-color: oklch(1 0 0 / 0.4);
		--kbd-border-radius: 0.375rem;
		--kbd-border: 0;
		display: inline-flex;
		align-items: center;
		user-select: none;
		justify-content: center;
		padding: var(--kbd-padding);
		border-radius: var(--kbd-border-radius);
		flex-wrap: nowrap;
		line-height: 1;
		white-space: nowrap;
		color: var(--kbd-color);
		background-color: var(--kbd-background);
		border: var(--kbd-border);
	}
</style>
