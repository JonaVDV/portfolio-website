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

<li style="list-style: none;">
	{#if as === 'link'}
		<a
			{...rest}
			class={['sidebar-item | flex-group nowrap', className]}
			aria-current={active ? 'page' : undefined}
			data-collapsed={sidebar.collapsed ? 'true' : undefined}
			data-active={active ? 'true' : undefined}
		>
			{@render children()}
		</a>
	{:else if as === 'button'}
		<button
			{...rest}
			class={['sidebar-item | flex-group nowrap', className]}
			aria-pressed={active ? 'true' : 'false'}
			data-collapsed={sidebar.collapsed ? 'true' : undefined}
			data-active={active ? 'true' : undefined}
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

	li {
		--sidebar-item-padding-block: 0.25rem;
		--sidebar-item-padding-inline: 0.25rem;
		--sidebar-item-gap: 0.75rem;
		--sidebar-item-icon-size: 1.25rem;
		--sidebar-item-border-radius: 0.75rem;
		--_sidebar-gate: max(0.5rem, (100cqi - var(--sidebar-icons-only-width, 3rem)) * 9999);

		--flex-gap: min(var(--sidebar-item-gap), var(--_sidebar-gate));
		anchor-scope: --sidebar-item;
		list-style: none;
	}

	.sidebar-item {
		/*
		 * 100% respects the containing-block hierarchy: items inside indented
		 * groups fill the group's available area; items in header/footer fill the
		 * sidebar width after those containers' own gated padding.
		 * 100cqi would break group-indented items by expanding them to the full
		 * sidebar width regardless of indentation, overflowing group's clip.
		 */
		width: 100%;
		anchor-name: --sidebar-item;
		padding-block: var(--sidebar-item-padding-block);
		padding-inline: min(var(--sidebar-item-padding-inline), var(--_sidebar-gate));
		border-radius: var(--sidebar-item-border-radius);
		font-size: var(--sidebar-item-font-size);
		appearance: none;
		border: 0;
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

		& > :global(svg) {
			flex-shrink: 0;
		}
	}

	.sidebar-action {
		position-anchor: --sidebar-item;
		position: absolute;
		top: anchor(top);
		bottom: anchor(bottom);
		right: calc(anchor(right) + var(--sidebar-item-padding-inline));

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
