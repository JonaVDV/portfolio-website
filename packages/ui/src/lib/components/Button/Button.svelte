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
		<div aria-hidden="true" class="outline-supporter"></div>
		{@render children()}
	</a>
{:else}
	{@const { children, variant, as, ...rest } = props as ButtonProps}
	<button {...rest} class={[rest.class, 'button']} data-variant={variant}>
		<div aria-hidden="true" class="outline-supporter"></div>
		{@render children()}
	</button>
{/if}

<style lang="scss">
	@use '../../styles/abstracts/' as *;

	.button[data-variant] {
		/* Base settings */
		--button-padding: 0.5rem 2rem;
		--button-border-radius: 0;
		--button-font-size: 1.125rem;
		--button-font-weight: 600;
		border: var(--button-border, 0);
		padding: var(--button-padding);
		border-radius: var(--button-border-radius);
		font-size: var(--button-font-size);
		font-weight: var(--button-font-weight);
		background-color: var(--button-background);
		position: relative;
		text-transform: uppercase;
		letter-spacing: 0.2ch;
		outline: 0;
		z-index: 1;
		isolation: isolate;
		color: var(--button-color);

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
		--button-background: #{$clr-brand-400};
		--button-color: #{$clr-brand-000};
		--button-hover-background: #{$clr-brand-600};
		--button-active-background: #{$clr-brand-700};

		--focus-outline-width: 3px;
		--focus-outline-color: #{$clr-brand-400};
		--focus-outline-edge-size: 0.5rem;
		--focus-outline-offset: 10px;
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
