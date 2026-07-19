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
		onchange?: (value: string) => void;
	}

	let { children, orientation = 'horizontal', value, onchange }: TabsProps = $props();

	const tabs = new TabsState({
		get orientation() {
			return orientation;
		},
		get initialTab() {
			return value;
		}
	});

	setTabsState(tabs);
</script>

<div>
	{@render children?.()}
</div>

<style>
</style>
