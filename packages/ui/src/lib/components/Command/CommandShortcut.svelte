<script lang="ts">
	import Kbd from '$components/Kbd/Kbd.svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = HTMLAttributes<HTMLElement>;

	let { children, class: className, ...rest }: Props = $props();
</script>

<Kbd class={['command-shortcut', className]} {...rest}>
	{@render children?.()}
</Kbd>

<style>
	:global(.command-shortcut) {
		margin-inline-start: auto;
		font-size: var(--fs-200, 0.75rem);
		opacity: 0.6;
	}
</style>
