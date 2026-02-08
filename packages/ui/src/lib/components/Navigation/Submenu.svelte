<script lang="ts">
	import type { Snippet } from 'svelte';
	import polyfill from '@oddbird/css-anchor-positioning/fn';

	interface Props {
		trigger: Snippet<[id: string]>;
		children: Snippet;
	}

	const id = $props.id();
	let { trigger, children }: Props = $props();
</script>

<div class="submenu-wrapper">
	{@render trigger(id)}

	<div class="submenu" {id} popover>
		{@render children()}
	</div>
</div>

<style lang="scss">
	@use '../../styles/abstracts/' as *;

	.submenu {
		--submenu-offset-top: 0.5rem;
		--submenu-offset-left: 0rem;
		--submenu-offset-right: 0rem;

		--arrow-size: 8px;
		--arrow-offset: 1px;
		// positioning
		anchor-name: --arrow-anchor;
		position-anchor: --submenu-anchor;
		position: absolute;
		overflow: visible;
		padding-inline: 1rem;
		/* make sure that you set 2 properties here so it is properly updated */
		position-area: end center;
		margin-block-start: calc(var(--arrow-size) + var(--submenu-offset-top));
		margin-inline: var(--submenu-offset-left) var(--submenu-offset-right);
		background-color: $clr-surface-000;
		border: 1px solid $clr-surface-200;

		/// When anchor positioning is not supported, we need this because otherwise the polyfill won't work in firefox
		/// @see: https://codepen.io/jamessw/pen/yyyKYwE?editors=1100 and (this issue)[https://github.com/oddbird/css-anchor-positioning/issues/330] in firefox 146 (at time of writing) may be 90% supported in a year or so and we can remove this and the polyfill
		/// Also see here for support status: https://caniuse.com/css-anchor-positioning
		@supports not (anchor-name: --test) {
			inset: auto;
		}
	}

	.submenu-wrapper {
		// Makes sure that multiple submenus can be used in the same page without interfering with each other
		anchor-scope: --submenu-anchor;
	}

	:global(.submenu-wrapper [popovertarget]) {
		anchor-name: --submenu-anchor;
	}
</style>
