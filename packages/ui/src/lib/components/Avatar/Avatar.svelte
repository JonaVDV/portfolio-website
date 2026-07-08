<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue, HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		/** Image URL. When it loads it covers the fallback; when it fails or is unset, the fallback shows through. */
		src?: string;
		/** Accessible label, announced regardless of whether the image loads. */
		alt: string;
		/** Shown when no image is loaded — initials, an icon, anything. */
		fallback?: Snippet;
		class?: ClassValue;
	}

	let { src, alt, fallback, class: className, ...rest }: Props = $props();
</script>

<!-- this might look like an aria principles violation, but here it is necessary to have the "image" gracefully degrade when no JS is available -->
<span class={['avatar grid-stack', className]} role="img" aria-label={alt} {...rest}>
	{#if fallback}
		<span class="avatar-fallback" aria-hidden="true">{@render fallback()}</span>
	{/if}
	{#if src}
		<span class="avatar-image" style="--_avatar-src: url({JSON.stringify(src)})"></span>
	{/if}
</span>

<style>
	.avatar {
		--_avatar-size: var(--avatar-size, 2.5rem);
		--_avatar-radius: var(--avatar-radius, 50%);
		--_avatar-border: var(--avatar-border, 0px);

		inline-size: var(--_avatar-size);
		block-size: var(--_avatar-size);
		border: var(--_avatar-border);
		border-radius: var(--_avatar-radius);
		overflow: hidden;
		flex-shrink: 0;
		place-items: center;
		font-size: calc(var(--_avatar-size) / 2.5);
		user-select: none;
	}

	.avatar-fallback {
		display: grid;
		place-items: center;
		inline-size: 100%;
		block-size: 100%;
		background: var(--avatar-fallback-background, oklch(0.9 0 0));
		color: var(--avatar-fallback-color, oklch(39.889% 0.00133 15.33));
	}

	.avatar-image {
		background-image: var(--_avatar-src);
		background-size: cover;
		inline-size: 100%;
		block-size: 100%;
		background-position: center;
		filter: var(--avatar-image-filter, none);
	}

	/* Forced colors strips background-image, so the photo layer is gone here:
	   keep a visible boundary and let the fallback (or empty box) read as a shape. */
	@media (forced-colors: active) {
		.avatar {
			border: 1px solid CanvasText;
		}
	}
</style>
