<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setTabsState, TabsState } from './tabs.svelte';

	interface TabsProps {
		children?: Snippet;
		orientation?: 'horizontal' | 'vertical';
		/**
		 * The value of the active tab. This should be the same as the `tab` prop of the corresponding `TabTrigger`.
		 */
		value?: string;
	}

	let { children, orientation = 'horizontal', value }: TabsProps = $props();

	setTabsState(new TabsState(orientation, value));
</script>

<div>
	{@render children?.()}
</div>

<style>
</style>
