<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLDetailsAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLDetailsAttributes, 'children' | 'open' | 'title'> {
		title: Snippet | string;
		icon?: Snippet;
		children: Snippet;
		open?: boolean;
		collapsible?: boolean;
	}

	let {
		title,
		icon,
		children,
		open = $bindable(false),
		collapsible = true,
		class: className = '',
		...rest
	}: Props = $props();
</script>

<svelte:element
	this={collapsible ? 'details' : 'div'}
	data-collapsible={collapsible}
	{...rest}
	class={['sidebar-group', className]}
>
	<summary class="sidebar-group-summary | flex-group space-between nowrap">
		<span class="sidebar-group-title">
			{#if typeof title === 'string'}
				{title}
			{:else}
				{@render title()}
			{/if}
		</span>
		{#if collapsible && icon}
			{@render icon()}
		{:else if collapsible}
			<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M6 9l6 6 6-6"
					stroke="currentColor"
					stroke-width="2"
					fill="none"
					fill-rule="evenodd"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		{/if}
	</summary>

	<ul role="list" class="sidebar-group-content">
		{@render children()}
	</ul>
</svelte:element>

<style lang="scss">
	@use '../../styles/abstracts/' as *;

	.sidebar-group {
		--sidebar-group-title-gap: 0.25rem;
		--sidebar-group-inset: 0.5em;
		--sidebar-group-padding: 0.5rem 1rem;
		--sidebar-group-gap: 0.25em;
		--sidebar-group-icon-size: 1rem;
		--sidebar-group-border: solid;
		--sidebar-group-border-width: 1px;
		width: 100%;
		padding: var(--sidebar-group-padding);
	}

	:global(.sidebar-group svg) {
		width: var(--sidebar-group-icon-size);
		aspect-ratio: 1/1;
		flex-shrink: 0;
		transition: rotate 0.3s ease-in-out;
	}

	.sidebar-group[data-collapsible='true'] > .sidebar-group-summary {
		cursor: pointer;
	}

	.sidebar-group-content {
		display: grid;
		gap: var(--sidebar-group-gap);
		padding-inline-start: calc(var(--sidebar-group-inset) + (var(--sidebar-group-icon-size)));
		margin-inline: calc(
			(var(--sidebar-group-icon-size) / 2) - (var(--sidebar-group-border-width) / 2)
		);
		border-left-style: var(--sidebar-group-border);
		border-left-width: var(--sidebar-group-border-width);
		border-color: var(--sidebar-border);
	}
</style>
