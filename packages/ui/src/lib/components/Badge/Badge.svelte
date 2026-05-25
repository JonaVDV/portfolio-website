<script module lang="ts">
	export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';
</script>

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

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
		color: var(--badge-color, var(--clr-surface-900));
		background-color: var(--badge-background, var(--clr-surface-300));
		border-radius: var(--badge-border-radius, 100vw);
		line-height: 1;
		grid-auto-flow: column;
		white-space: nowrap;
	}

	.badge[data-variant='success'] {
		--badge-color: var(--badge-success-color, var(--clr-teal-400));
		--badge-background: var(--badge-success-background, oklch(from var(--badge-color) l c h / 15%));
	}

	.badge[data-variant='warning'] {
		--badge-color: var(--badge-warning-color, var(--clr-amber-500));
		--badge-background: var(--badge-warning-background, oklch(from var(--badge-color) l c h / 15%));
	}

	.badge[data-variant='error'] {
		--badge-color: var(--badge-error-color, var(--clr-red-400));
		--badge-background: var(--badge-error-background, oklch(from var(--badge-color) l c h / 15%));
	}

	.badge[data-variant='info'] {
		--badge-color: var(--badge-info-color, var(--clr-blue-400));
		--badge-background: var(--badge-info-background, oklch(from var(--badge-color) l c h / 15%));
	}
</style>
