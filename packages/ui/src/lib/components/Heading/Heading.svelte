<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLHeadingElement> {
		/**
		 * The heading level to use (h1 to h6).
		 */
		level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
		/**
		 * The visual size of the heading (h1 to h6).
		 * This is useful for if you want a different visual size than the semantic level.
		 */
		sizeOf?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
	}

	let { level, sizeOf, children, ...rest }: Props = $props();

	function headingClass(level: string | undefined) {
		return level ? 'heading-' + level.split('h')[1] : '';
	}

	const heading = $derived(headingClass(sizeOf) || headingClass(level));
</script>

<svelte:element this={level} class={[heading, rest.class]} {...rest}>
	{@render children?.()}
</svelte:element>

<style lang="scss">
	@use '../../styles/abstracts/' as *;

	[class|='heading'] {
		font-family: $ff-headings;
		font-weight: $fw-bold;
		line-height: 1.1;
	}

	.heading-1 {
		font-size: $fs-900;
	}

	.heading-2 {
		font-size: $fs-800;
	}

	.heading-3 {
		font-size: $fs-700;
	}
</style>
