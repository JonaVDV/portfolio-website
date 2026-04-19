<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getSidebarState } from './context';

	interface Props {
		children: Snippet;
		icon?: Snippet;
		before?: Snippet;
		after?: Snippet;
		action?: Snippet;
		active?: boolean;
		as?: 'link' | 'button';
		[key: string]: unknown;
	}

	let {
		children,
		icon,
		before,
		after,
		action,
		active,
		as = 'link',
		class: className = '',
		...rest
	}: Props = $props();

	const sidebar = getSidebarState();
</script>

{#snippet Inner()}
	{@render children()}

	{#if action}
		{@render action()}
	{/if}
{/snippet}

<li style="list-style: none;">
	{#if as === 'link'}
		<a
			{...rest}
			class={['sidebar-item | flex-group nowrap', className]}
			aria-current={active ? 'page' : undefined}
			data-collapsed={sidebar.collapsed ? 'true' : undefined}
			data-active={active ? 'true' : undefined}
		>
			{@render Inner()}
		</a>
	{:else if as === 'button'}
		<button
			{...rest}
			class={['sidebar-item | flex-group nowrap', className]}
			aria-pressed={active ? 'true' : 'false'}
			data-collapsed={sidebar.collapsed ? 'true' : undefined}
			data-active={active ? 'true' : undefined}
		>
			{@render Inner()}
		</button>
	{/if}
</li>

<style lang="scss">
	@use '../../styles/abstracts/' as *;

	.sidebar-item {
		--sidebar-item-padding: 0.25rem 0.25rem;
		--sidebar-item-icon-size: 1.25rem;

		width: 100%;
		overflow: hidden;
		padding: var(--sidebar-item-padding);
		appearance: none;
		border: 0;
		border-radius: 0.75rem;
		color: inherit;
		text-decoration: none;
		transition:
			background-color 0.2s ease,
			color 0.2s ease;

		&:is(:hover, :focus-visible) {
			background-color: var(--sidebar-item-hover-background, #{$clr-surface-200});
		}

		&[data-active='true'] {
			background-color: var(--sidebar-item-active-background, #{$clr-brand-200});
			color: var(--sidebar-item-active-color, #{$clr-brand-900});
		}

		& :global(svg) {
			flex-shrink: 0;
		}
	}

	li {
		overflow: hidden;
	}

	.sidebar-item[data-collapsed='true'] {
		width: var(--sidebar-icons-only-width, 3rem);
		height: var(--sidebar-icons-only-width, 3rem);
	}
</style>
