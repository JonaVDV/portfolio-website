<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { getTabsState } from './tabs.svelte';

	interface TabTriggerProps extends HTMLButtonAttributes {
		children?: Snippet;
		tab: string;
	}

	let { children, tab, onclick, onfocus, ...rest }: TabTriggerProps = $props();
	const id = $props.id();

	const tabs = getTabsState();

	$effect(() => {
		tabs.registerTrigger(id, tab);
	});
</script>

<button
	{...rest}
	onclick={(e) => {
		onclick?.(e);
		tabs.setTabActive(tab);
	}}
	onfocus={(e) => {
		onfocus?.(e);
		tabs.setTabActive(tab);
	}}
	id={'tab-' + tab}
	aria-selected={tabs.activeTab === tab}
	aria-controls={'panel-' + tab}
	role="tab"
>
	{@render children?.()}
</button>

<style>
	button {
		--_tab-trigger-padding: var(--tab-trigger-padding, 0.25rem 1rem);
		--_tab-trigger-border-radius: var(--tab-trigger-border-radius, 100vw);
		--_tab-trigger-border-width: var(--tab-trigger-border-width, 0px);
		--_tab-trigger-border-color: var(--tab-trigger-border-color, #ccc);
		--_tab-trigger-focus-outline-width: var(--tab-trigger-focus-outline-width, 1px);
		--_tab-trigger-focus-outline-color: var(
			--tab-trigger-focus-outline-color,
			var(--clr-brand-400, oklch(0.511 0.246 290))
		);
		--_tab-trigger-focus-outline-offset: var(--tab-trigger-focus-outline-offset, 0.125rem);
		padding: var(--_tab-trigger-padding);
		border-radius: var(--_tab-trigger-border-radius);
		border: var(--_tab-trigger-border-width) solid var(--_tab-trigger-border-color);
		background: transparent;
		/* Shrink to the grid track (min-width:auto would keep the button at its
		   content size and overlap neighbours); long labels ellipsis-truncate. */
		min-width: 0;
		width: 100%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		color: var(--_tab-trigger-color, #000);
		cursor: pointer;
		appearance: none;
		transition:
			background-color 0.15s ease,
			color 0.15s ease;
	}

	button:hover:not([aria-selected='true'], :disabled) {
		background: var(--tab-trigger-hover-background, var(--clr-surface-200, #eee));
	}

	button:focus-visible {
		outline: var(--_tab-trigger-focus-outline-width) solid var(--_tab-trigger-focus-outline-color);
		outline-offset: var(--_tab-trigger-focus-outline-offset, 0.125rem);
	}

	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	button[aria-selected='true'] {
		background: var(
			--tab-trigger-selected-background,
			var(--clr-brand-400, oklch(0.511 0.246 290))
		);
		color: var(--tab-trigger-selected-color, #fff);
	}
</style>
