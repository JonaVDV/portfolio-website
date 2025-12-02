<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes, HTMLAnchorAttributes } from 'svelte/elements';

	/**
	 * Edit this type to add more variants
	 */
	type ButtonVariant = 'stripped' | 'primary' | (string & {});

	interface BaseProps {
		children: Snippet;
		variant?: ButtonVariant;
	}

	type ButtonProps = BaseProps &
		HTMLButtonAttributes & {
			as?: 'button';
		};

	type LinkProps = BaseProps &
		HTMLAnchorAttributes & {
			as: 'link';
		};

	type Props = ButtonProps | LinkProps;

	let props: Props = $props();
</script>

{#if props.as === 'link'}
	{@const { children, variant, as, ...rest } = props as LinkProps}
	<a {...rest} class={[rest.class, 'button']} data-variant={variant}>
		{@render children()}
	</a>
{:else}
	{@const { children, variant, as, ...rest } = props as ButtonProps}
	<button {...rest} class={[rest.class, 'button']} data-variant={variant}>
		{@render children()}
	</button>
{/if}

<style>
	.button[data-variant] {
		/* Base settings */
		--button-padding: 0.5em 1em;
		--button-border-radius: 0.375em;
		--button-font-size: 1rem;
		--button-font-weight: 600;

		border: var(--button-border, 0);
		padding: var(--button-padding);
		border-radius: var(--button-border-radius);
		font-size: var(--button-font-size);
		font-weight: var(--button-font-weight);
		background-color: var(--button-background);
		color: var(--button-color);
		color: hsl(0 0 50%);
		

		&:is(:hover, :focus) {
			background-color: var(--button-hover-background, var(--button-background));
			color: var(--button-hover-color, var(--button-color));
			/* add more properties here */
		}

		&:active {
			background-color: var(--button-active-background, var(--button-background));
			color: var(--button-active-color, var(--button-color));
			/* add more properties here */
		}
	}

	.button[data-variant='primary'] {
		--button-background: hsl(220 90% 56%);
		--button-color: hsl(0 0% 100%);
		--button-hover-background: hsl(220 90% 46%);
		--button-active-background: hsl(220 90% 36%);
		box-shadow: 0 4px 6px hsl(220 90% 56% / 0.4);
		transition:
			background-color 0.2s,
			box-shadow 0.2s;
	}

	.button,
	.button[data-variant='stripped'] {
		/* Reset button styles */
		appearance: none;
		border: 0;
		background-color: transparent;
		cursor: pointer;
		display: inline-flex;
		min-width: fit-content;
		align-items: center;
		justify-content: center;
	}
</style>
