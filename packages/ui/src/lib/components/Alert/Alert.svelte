<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
		actions?: Snippet;
		ref?: HTMLElement | null;
		variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
	}

	let { children, actions, variant = 'default', ref = $bindable(null) }: Props = $props();
</script>

<div role="alert" aria-live="assertive" aria-atomic="true" data-variant={variant} bind:this={ref}>
	{@render children?.()}

	<div class="alert-actions">
		{@render actions?.()}
	</div>
</div>

<style>
	[role='alert'] {
		--_alert-background: var(--alert-background, #f0f0f0);
		--_alert-color: var(--alert-color, #000);
		--_alert-border: var(--alert-border-width, 1px) var(--alert-border-style, solid)
			var(--alert-border-color, #000);
		--_alert-border-radius: var(--alert-border-radius, 4px);
		--_alert-padding: var(--alert-padding, 16px);
		--_alert-gap: var(--alert-gap, 12px);
		background: var(--_alert-background);
		color: var(--_alert-color);
		border: var(--_alert-border);
		border-radius: var(--_alert-border-radius);
		padding: var(--_alert-padding);
		display: inline-grid;
		grid-auto-flow: column;
		align-items: start;
		gap: var(--_alert-gap);
		/* for the color and border color derive the colors using the background color if provided (use relative colors with oklch) */
		&[data-variant='success'] {
			--_alert-background: var(--alert-success-background, #d1fae5);
			--_alert-color: var(--alert-success-color, oklch(from var(--_alert-background) 5% c h / 1));
			--_alert-border-color: var(
				--alert-success-border-color,
				oklch(from var(--_alert-background) 80% c h / 1)
			);
		}

		&[data-variant='error'] {
			--_alert-background: var(--alert-error-background, #fee2e2);
			--_alert-color: var(--alert-error-color, oklch(from var(--_alert-background) 5% c h / 1));
			--_alert-border-color: var(
				--alert-error-border-color,
				oklch(from var(--_alert-background) 80% c h / 1)
			);
		}

		&[data-variant='warning'] {
			--_alert-background: var(--alert-warning-background, #fef3c7);
			--_alert-color: var(--alert-warning-color, oklch(from var(--_alert-background) 5% c h / 1));
			--_alert-border-color: var(
				--alert-warning-border-color,
				oklch(from var(--_alert-background) 80% c h / 1)
			);
		}

		&[data-variant='info'] {
			--_alert-background: var(--alert-info-background, #dbeafe);
			--_alert-color: var(--alert-info-color, oklch(from var(--_alert-background) 5% c h / 1));
			--_alert-border-color: var(
				--alert-info-border-color,
				oklch(from var(--_alert-background) 80% c h / 1)
			);
		}
	}
</style>
