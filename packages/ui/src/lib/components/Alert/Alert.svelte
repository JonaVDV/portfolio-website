<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		children?: Snippet;
		actions?: Snippet;
		ref?: HTMLElement | null;
		variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
	}

	let { children, actions, variant = 'default', ref = $bindable(null), ...rest }: Props = $props();
</script>

<div
	role="alert"
	aria-live="assertive"
	aria-atomic="true"
	data-variant={variant}
	bind:this={ref}
	{...rest}
>
	{@render children?.()}

	<div class="alert-actions">
		{@render actions?.()}
	</div>
</div>

<style>
	[role='alert'] {
		--_alert-background: var(--alert-background, var(--clr-surface-100, #f0f0f0));
		--_alert-border-radius: var(--alert-border-radius, 4px);
		--_alert-padding: var(--alert-padding, 16px);
		--_alert-gap: var(--alert-gap, 12px);

		background: var(--_alert-background);
		color: var(--_alert-color, currentColor);
		border: var(--alert-border-width, 1px) var(--alert-border-style, solid)
			var(--_alert-border-color, currentColor);
		border-radius: var(--_alert-border-radius);
		padding: var(--_alert-padding);
		display: inline-grid;
		grid-auto-flow: column;
		align-items: start;
		width: fit-content;
		gap: var(--_alert-gap);
		max-inline-size: var(--alert-max-width, none);
	}

	[role='alert'][data-variant] {
		--_alert-color-l: var(--alert-color-l, 5%);
		--_alert-color-c: var(--alert-color-c, 0);
		--_alert-color-h: var(--alert-color-h, 0);
		--_alert-border-l: var(--alert-border-l, 80%);
		--_alert-border-c: var(--alert-border-c, 0);
		--_alert-border-h: var(--alert-border-h, 0);
		--_alert-color: var(
			--alert-color,
			oklch(
				from var(--_alert-background) var(--_alert-color-l) calc(c + var(--_alert-color-c))
					calc(h + var(--_alert-color-h)) / 1
			)
		);
		--_alert-border-color: var(
			--alert-border-color,
			oklch(
				from var(--_alert-background) var(--_alert-border-l) calc(c + var(--_alert-border-c))
					calc(h + var(--_alert-border-h)) / 1
			)
		);
	}

	.alert-actions {
		display: flex;
		gap: var(--alert-actions-gap, 0.5rem);
		align-items: center;
	}
</style>
