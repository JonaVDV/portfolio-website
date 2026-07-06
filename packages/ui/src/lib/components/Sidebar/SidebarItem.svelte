<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getSidebarState } from './context';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

	// anchor & button attrs intersected — simpler than a generic union, which
	// TS cannot represent once spread together with class/aria props
	type Props = HTMLAnchorAttributes &
		HTMLButtonAttributes & {
			children: Snippet;
			action?: Snippet;
			active?: boolean;
			as?: 'link' | 'button';
			showActionOnHover?: boolean;
		};

	let {
		children,
		action,
		active,
		showActionOnHover,
		as = 'link',
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

<style>
	li {
		--_sidebar-item-padding-block: var(--sidebar-item-padding-block, 0.5rem);
		--_sidebar-item-padding-inline: var(--sidebar-item-padding-inline, 0.5rem);
		--_sidebar-item-gap: var(--sidebar-item-gap, 0.75rem);
		--_sidebar-item-icon-size: var(--sidebar-item-icon-size, 1rem);
		--_sidebar-item-border-radius: var(--sidebar-item-border-radius, 0.75rem);
		--_sidebar-item-font-size: var(--sidebar-item-font-size, 0.875rem);
		--_sidebar-item-color: var(--sidebar-item-color, inherit);
		--_sidebar-item-background: var(--sidebar-item-background, transparent);
		--flex-gap: min(var(--_sidebar-item-gap), var(--_G));
		anchor-scope: --sidebar-item;
		list-style: none;

		--_sidebar-item-width: min(
			100%,
			100cqi -
				(var(--_sidebar-section-padding-inline, var(--_sidebar-footer-padding-inline, 0px)) * 2)
		);
		width: var(--_sidebar-item-width);

		--_G: max(0px, (100cqi - var(--sidebar-icons-only-width, 3rem)) * 9999);
		/*
		* Fallbacks are 0px (not 0.5rem): these variables are only
		* defined on their respective ancestor elements, so an item
		* outside that context correctly contributes 0 to the sum.
		* Using 0.5rem as fallback caused section padding to be
		* double-counted for footer/header items.
		*/
		--_centered-inline: calc(
			(
					var(--sidebar-icons-only-width, 3rem) -
						(2 * var(--_sidebar-section-padding-inline, 0px)) -
						(2 * var(--_sidebar-footer-padding-inline, 0px)) -
						(2 * var(--_sidebar-header-padding-inline, 0px)) -
						(2 * var(--_sidebar-item-padding-inline)) -
						(2 * var(--_sidebar-group-padding-inline, 0px)) - var(--_sidebar-item-icon-size)
				) /
				2
		);
	}

	.sidebar-item {
		width: inherit;
		anchor-name: --sidebar-item;
		padding-block: max(
			0px,
			var(--_sidebar-item-padding-block) -
				max(0px, var(--_sidebar-footer-padding-block, 0px) - var(--_G)) -
				max(0px, var(--_sidebar-header-padding-block, 0px) - var(--_G))
		);
		padding-inline: calc(
			var(--_sidebar-item-padding-inline) -
				max(0px, var(--_sidebar-footer-padding-inline, 0px) - var(--_G)) -
				max(0px, var(--_sidebar-header-padding-inline, 0px) - var(--_G)) +
				max(0px, var(--_centered-inline) - var(--_sidebar-item-padding-inline) - var(--_G))
		);
		border-radius: var(--_sidebar-item-border-radius);
		font-size: var(--_sidebar-item-font-size);
		color: var(--_sidebar-item-color);
		background-color: var(--_sidebar-item-background);
		appearance: none;
		border: 0;
		text-decoration: none;
		line-height: 1;

		white-space: nowrap;
		overflow: hidden;
		transition:
			padding-inline 0.3s ease-in-out,
			background-color 0.2s ease,
			--sidebar-item-font-size 0.2s ease,
			color 0.2s ease;

		&:is(:hover, :focus-visible) {
			background-color: var(--sidebar-item-hover-background);
			color: var(--sidebar-item-hover-color, inherit);
		}

		&[data-active='true'] {
			background-color: var(--sidebar-item-active-background);
			color: var(--sidebar-item-active-color);
		}

		& > :global(svg) {
			flex-shrink: 0;
			width: var(--_sidebar-item-icon-size);
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
		right: calc(anchor(right) + var(--_sidebar-item-padding-inline));
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
