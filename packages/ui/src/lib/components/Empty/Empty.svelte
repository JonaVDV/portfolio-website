<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
		/** Icon or illustration shown above the text. */
		media?: Snippet;
		title?: Snippet | string;
		description?: Snippet | string;
		/** Actions or extra content below the text (e.g. a Button). */
		children?: Snippet;
	}

	let { media, title, description, children, class: className, ...rest }: Props = $props();
</script>

<div class={['empty', className]} {...rest}>
	{#if media}
		<div class="empty-media" aria-hidden="true">
			{@render media()}
		</div>
	{/if}

	{#if title}
		<p class="empty-title">
			{#if typeof title === 'string'}{title}{:else}{@render title()}{/if}
		</p>
	{/if}

	{#if description}
		<p class="empty-description">
			{#if typeof description === 'string'}{description}{:else}{@render description()}{/if}
		</p>
	{/if}

	{@render children?.()}
</div>

<style>
	.empty {
		/** --- Public Styling API --- */
		--_empty-padding: var(--empty-padding, 3rem 1.5rem);
		--_empty-gap: var(--empty-gap, 0.5rem);
		--_empty-color: var(--empty-color, inherit);
		--_empty-media-size: var(--empty-media-size, 2.5rem);
		--_empty-media-color: var(--empty-media-color, var(--clr-surface-500, currentColor));
		--_empty-description-color: var(--empty-description-color, var(--clr-surface-600, inherit));

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--_empty-gap);
		padding: var(--_empty-padding);
		text-align: center;
		color: var(--_empty-color);
	}

	.empty-media {
		font-size: var(--_empty-media-size);
		color: var(--_empty-media-color);
		line-height: 0;
	}

	.empty-title {
		font-weight: var(--fw-medium, 500);
		margin: 0;
	}

	.empty-description {
		color: var(--_empty-description-color);
		font-size: var(--fs-300, 0.875rem);
		margin: 0;
		max-width: 40ch;
		text-wrap: balance;
	}
</style>
