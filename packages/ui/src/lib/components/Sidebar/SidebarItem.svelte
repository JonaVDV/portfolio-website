<script lang="ts" generics="TAs extends 'link' | 'button' = 'link'">
	import type { Snippet } from 'svelte';
	import { getSidebarState } from './context';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

	type Props = (TAs extends 'button' ? HTMLButtonAttributes : HTMLAnchorAttributes) & {
		children: Snippet;
		action?: Snippet;
		active?: boolean;
		as?: TAs;
		showActionOnHover?: boolean;
	};

	let {
		children,
		action,
		active,
		showActionOnHover,
		as = 'link' as TAs,
		class: className = '',
		...rest
	}: Props = $props();

	const sidebar = getSidebarState();
</script>

<li data-collapsed={sidebar.collapsed}>
	{#if as === 'link'}
		<a
			{...rest}
			class={['sidebar-item | flex-group nowrap', className]}
			aria-current={active ? 'page' : undefined}
			data-active={active}
		>
			{@render children()}
		</a>
	{:else if as === 'button'}
		<button
			{...rest}
			class={['sidebar-item | flex-group nowrap', className]}
			aria-pressed={active ? 'true' : 'false'}
			data-collapsed={sidebar.collapsed ? 'true' : undefined}
			data-active={active}
		>
			{@render children()}
		</button>
	{/if}

	{#if action}
		<div class="sidebar-action" data-show-on-hover={showActionOnHover}>
			{@render action()}
		</div>
	{/if}
</li>

<style lang="scss">
	@use '../../styles/abstracts/' as *;

	@property --sidebar-item-font-size {
		syntax: '<length>';
		inherits: true;
		initial-value: 1rem;
	}

	li {
		--sidebar-item-padding-block: 0.5rem;
		--sidebar-item-padding-inline: 0.5rem;
		--sidebar-item-gap: 0.75rem;
		--sidebar-item-icon-size: 1rem;
		--sidebar-item-border-radius: 0.75rem;
		--flex-gap: min(var(--sidebar-item-gap), var(--_sidebar-gate));
		anchor-scope: --sidebar-item;
		list-style: none;

		--_sidebar-item-width: min(100%, 100cqi - (var(--sidebar-section-padding-inline, 0px) * 2));
		--_sidebar-padding-inline: calc(var(--sidebar-item-padding-inline) + var(--_sidebar-gate));
		width: var(--_sidebar-item-width);
	}

	.sidebar-item {
		width: inherit;
		anchor-name: --sidebar-item;
		padding-block: var(--sidebar-item-padding-block);
		padding-inline: var(--sidebar-item-padding-inline);
		border-radius: var(--sidebar-item-border-radius);
		font-size: var(--sidebar-item-font-size);
		appearance: none;
		border: 0;
		color: inherit;
		text-decoration: none;
		white-space: nowrap;
		overflow: hidden;
		transition:
			background-color 0.2s ease,
			--sidebar-item-font-size 0.2s ease,
			color 0.2s ease;

		&:is(:hover, :focus-visible) {
			background-color: var(--sidebar-item-hover-background, #{$clr-surface-200});
		}

		&[data-active='true'] {
			background-color: var(--sidebar-item-active-background, #{$clr-brand-200});
			color: var(--sidebar-item-active-color, #{$clr-brand-900});
		}

		& > :global(svg) {
			flex-shrink: 0;
			width: var(--sidebar-item-icon-size);
		}
	}

	li[data-collapsed='true'] .sidebar-action {
		display: none;
	}

	.sidebar-action {
		position-anchor: --sidebar-item;
		position: absolute;
		top: anchor(top);
		bottom: anchor(bottom);
		right: calc(anchor(right) + var(--sidebar-item-padding-inline));
		transition: display 0.2s ease;
		transition-behavior: allow-discrete;

		&[data-show-on-hover='true'] {
			opacity: 0;
			transition: opacity 0.2s ease;

			li:hover &,
			li:focus-within & {
				opacity: 1;
			}
		}
	}
</style>
