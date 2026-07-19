<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getTabsState } from './tabs.svelte';

	interface TabPanelProps {
		children?: Snippet;
		tab: string;
	}

	let { children, tab, ...rest }: TabPanelProps = $props();

	const tabs = getTabsState();

	$effect(() => {
		tabs.registerTab(tab);
	});
</script>

<div
	{...rest}
	hidden={tabs.activeTab !== tab}
	id={'panel-' + tab}
	aria-labelledby={'tab-' + tab}
	role="tabpanel"
	tabindex="0"
>
	{@render children?.()}
</div>

<style>
	div[role='tabpanel'] {
		/* most of the time you would use structured content within a tab panel like a card but if the content is really simple a background + padding can go a long way */
		--_tab-panel-padding: var(--tab-panel-padding, 0);
		--_tab-panel-background: var(--tab-panel-background, transparent);
		--_tab-panel-border-radius: var(--tab-panel-border-radius, 0);
		--_tab-panel-border: var(--tab-panel-border-width, 0px) solid
			var(--tab-panel-border-color, #ccc);
		border-radius: var(--_tab-panel-border-radius);

		overflow: clip;
		padding: var(--_tab-panel-padding);
		background: var(--_tab-panel-background);
	}
</style>
