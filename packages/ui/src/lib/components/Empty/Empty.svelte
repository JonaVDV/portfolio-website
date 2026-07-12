<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLElement> {
		/** Icon or illustration shown above the text. */
		media?: Snippet;
		children?: Snippet;
	}

	let { media, children, class: className, ...rest }: Props = $props();
</script>

<div class={['empty', className]} {...rest}>
	{#if media}
		<div class="empty-media" aria-hidden="true">
			{@render media()}
		</div>
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
		--_empty-border: var(--empty-border, 0px solid transparent);
		--_empty-background: var(--empty-background, transparent);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: fit-content;
		gap: var(--_empty-gap);
		padding: var(--_empty-padding);
		border: var(--_empty-border);
		background: var(--_empty-background);
		text-align: center;
		color: var(--_empty-color);
	}

	.empty-media {
		font-size: var(--_empty-media-size);
		color: var(--_empty-media-color);
		line-height: 0;
	}
</style>
