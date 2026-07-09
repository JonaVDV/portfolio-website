<script module lang="ts">
	export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';
</script>

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import './Badge.variants.css';

	interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
		variant?: BadgeVariant;
	}

	let { children, variant = 'default', class: className, ...rest }: BadgeProps = $props();
</script>

<span class={['badge', className]} data-variant={variant} {...rest}>
	{@render children?.()}
</span>

<style>
	.badge {
		display: inline-grid;
		align-items: center;
		gap: var(--badge-gap, var(--space-1));
		padding: var(--badge-padding, 0.25em 0.75em);
		font-size: var(--badge-font-size, var(--fs-300));
		font-weight: var(--badge-font-weight, var(--fw-medium));
		letter-spacing: var(--badge-letter-spacing, 0.05em);
		text-transform: var(--badge-text-transform, uppercase);
		border: var(--badge-border-width, 0) var(--badge-border-style, solid)
			var(--_badge-border-color, currentColor);
		color: var(--badge-color, var(--clr-surface-900));
		background-color: var(--badge-background, var(--clr-surface-300));
		border-radius: var(--badge-border-radius, 100vw);
		line-height: 1;
		grid-auto-flow: column;
		white-space: nowrap;
	}

	.badge[data-variant] {
		--_badge-background-alpha: var(--badge-background-alpha, 15%);
		--_badge-border-alpha: var(--badge-border-alpha, 50%);
		--_badge-border-color: var(
			--badge-border-color,
			oklch(from var(--badge-color) l c h / var(--_badge-border-alpha))
		);
		background-color: var(
			--badge-background,
			oklch(from var(--badge-color) l c h / var(--_badge-background-alpha))
		);
	}
</style>
