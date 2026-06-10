<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { getTabsState } from './tabs.svelte';

	interface TabTriggerProps extends HTMLButtonAttributes {
		children?: Snippet;
		tab: string;
	}

	let { children, ...rest }: TabTriggerProps = $props();
	const id = $props.id();
	const tab = 'tab-' + rest.tab;

	const tabs = getTabsState();

	tabs.registerTab(tab);
</script>

<button
	{...rest}
	onclick={() => tabs.setTabActive(tab)}
	onfocus={() => tabs.setTabActive(tab)}
	aria-selected={tabs.activeTab === tab}
	aria-controls={'panel-' + rest.tab}
	aria-describedby={id + '-desc'}
	role="tab"
>
	{@render children?.()}
</button>

<style>
	button {
		--tab-trigger-padding: var(--tab-trigger-padding, 0.5rem 1rem);
		--tab-trigger-border-radius: var(--tab-trigger-border-radius, 4px);
		--tab-trigger-border-width: var(--tab-trigger-border-width, 1px);
		--tab-trigger-border-color: var(--tab-trigger-border-color, #ccc);
		--tab-trigger-focus-outline-width: var(--tab-trigger-focus-outline-width, 1px);
		--tab-trigger-focus-outline-color: var(
			--tab-trigger-focus-outline-color,
			var(--clr-brand-400, oklch(0.511 0.246 290))
		);
		padding: var(--tab-trigger-padding);
		border-radius: var(--tab-trigger-border-radius);
		border: var(--tab-trigger-border-width) solid var(--tab-trigger-border-color);
		background: transparent;
		min-width: fit-content;
		text-wrap: nowrap;
		color: var(--tab-trigger-color, #000);
		cursor: pointer;
		width: 100%;
		appearance: none;
	}
</style>
