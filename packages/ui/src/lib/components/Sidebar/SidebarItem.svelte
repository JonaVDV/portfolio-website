<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLAnchorAttributes, 'children'> {
		children: Snippet;
		before?: Snippet;
		after?: Snippet;
		active?: boolean;
	}

	let { children, before, after, active, class: className = '', ...rest }: Props = $props();
</script>

<li>
	<a
		{...rest}
		class={['sidebar-item | flex-group', className]}
		aria-current={active ? 'page' : undefined}
		data-active={active ? 'true' : undefined}
	>
		{#if before}
			<span class="sidebar-item-icon" aria-hidden="true">
				{@render before()}
			</span>
		{/if}
		<span class="sidebar-item-label">
			{@render children()}
		</span>

		{#if after}
			<span class="sidebar-item-icon" aria-hidden="true">
				{@render after()}
			</span>
		{/if}
	</a>
</li>

<style lang="scss">
	@use '../../styles/abstracts/' as *;

	.sidebar-item {
		--sidebar-item-padding: 0.25rem 0.25rem;
		--sidebar-item-icon-size: 1.25rem;

		inline-size: 100%;
		padding: var(--sidebar-item-padding);
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
	}

	.sidebar-item-icon {
		display: grid;
		place-items: center;
		inline-size: var(--sidebar-item-icon-size);
		aspect-ratio: 1/1;
		flex-shrink: 0;
	}

	.sidebar-item-label {
		min-inline-size: 0;
	}
</style>
