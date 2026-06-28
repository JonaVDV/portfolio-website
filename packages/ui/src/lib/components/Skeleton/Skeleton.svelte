<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {}

	let { class: className, ...rest }: Props = $props();
</script>

<!--
	@component A pure-CSS loading placeholder. Size it with --skeleton-width /
	--skeleton-height (or any width/height), and use --skeleton-border-radius for
	shape (e.g. var(--radius-circle) for an avatar). Respects prefers-reduced-motion.

	@example
		<Skeleton style="--skeleton-width: 12rem;" />
		<Skeleton style="--skeleton-height: 3rem; --skeleton-border-radius: var(--radius-circle);" />
-->

<div class={['skeleton', className]} aria-hidden="true" {...rest}></div>

<style>
	.skeleton {
		--_skeleton-base: var(--skeleton-base, var(--clr-surface-200));
		--_skeleton-highlight: var(--skeleton-highlight, var(--clr-surface-300));

		--_skeleton-base-color-stop: var(--_skeleton-base-color-stop, 0%);
		--_skeleton-highlight-color-stop: var(--_skeleton-highlight-color-stop, 50%);
		--_skeleton-base-color-stop-2: var(--_skeleton-base-color-stop-2, 100%);

		--_skeleton-gradient-rotation: var(--_skeleton-gradient-rotation, 90deg);

		display: block;
		width: var(--skeleton-width, 100%);
		height: var(--skeleton-height, 1em);
		border-radius: var(--skeleton-border-radius, var(--radius-2));
		background-image: linear-gradient(
			var(--_skeleton-gradient-rotation),
			var(--_skeleton-base) var(--_skeleton-base-color-stop),
			var(--_skeleton-highlight) var(--_skeleton-highlight-color-stop),
			var(--_skeleton-base) var(--_skeleton-base-color-stop-2)
		);
		background-size: 200% 100%;
		animation: skeleton-shimmer var(--skeleton-duration, 1.5s) ease-in-out infinite;
	}

	@keyframes skeleton-shimmer {
		from {
			background-position: 200% 0;
		}
		to {
			background-position: -200% 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.skeleton {
			animation: none;
		}
	}
</style>
