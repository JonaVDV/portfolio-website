<script module>
	export const cmd = '⌘';
	export const ctrl = '⌃';
	export const alt = '⌥';
	export const shift = '⇧';
</script>

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLElement> {}

	let { children, ...rest }: Props = $props();
</script>

<kbd {...rest}>
	{@render children?.()}
</kbd>

<style>
	kbd {
		--_kbd-padding: var(--kbd-padding, 0.25rem 0.5rem);
		--_kbd-background: var(--kbd-background, oklch(0.269 0 0));
		--_kbd-color: var(--kbd-color, oklch(1 0 0 / 0.4));
		--_kbd-border-radius: var(--kbd-border-radius, 0.375rem);
		--_kbd-border: var(--kbd-border, 0);
		--_kbd-font-size: var(--kbd-font-size, 0.75em);
		--_kbd-font-weight: var(--kbd-font-weight, 500);
		display: inline-flex;
		align-items: center;
		user-select: none;
		justify-content: center;
		padding: var(--_kbd-padding);
		border-radius: var(--_kbd-border-radius);
		flex-wrap: nowrap;
		line-height: 1;
		white-space: nowrap;
		color: var(--_kbd-color);
		background-color: var(--_kbd-background);
		border: var(--_kbd-border);
		font-size: var(--_kbd-font-size);
		font-weight: var(--_kbd-font-weight);
	}
</style>
