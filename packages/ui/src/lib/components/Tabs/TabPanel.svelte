<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getTabsState } from './tabs.svelte';

	interface TabPanelProps {
		children?: Snippet;
		tab: string;
	}

	let { children, ...rest }: TabPanelProps = $props();
	const id = $props.id();
	const tab = 'tab-' + rest.tab;

    const tabs = getTabsState();

    $inspect(tabs.activeTab, tab);
</script>

<div {...rest} hidden={tabs.activeTab !== tab}>
	{@render children?.()}
</div>
