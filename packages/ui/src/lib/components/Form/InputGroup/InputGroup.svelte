<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		addon?: Snippet;
	}

	let { addon, children, ...rest }: Props = $props();
</script>
<!-- Inputgroup -->
<div class={[rest.class, 'input-group']} {...rest}>
	{@render children?.()}
</div>

<style>
	.input-group {
		--_input-group-border-radius: var(
			--input-group-border-radius,
			var(--input-border-radius, 0.8rem)
		);
		--_input-group-padding: var(--input-group-padding, var(--input-padding, 0.25rem 0.75rem));
		--_input-group-border-width: var(--input-group-border-width, var(--input-border-width, 1px));
		--_input-group-border-color: var(--input-group-border-color, var(--input-border-color, #ccc));
		--_input-group-focus-outline-width: var(
			--input-group-focus-outline-width,
			var(--input-focus-outline-width, 1px)
		);
		--_input-group-focus-outline-color: var(
			--input-group-focus-outline-color,
			var(--input-focus-outline-color, var(--clr-brand-400, oklch(0.511 0.246 290)))
		);
		align-items: center;
		anchor-scope: --input-group;

		/* use the private variables in order to not pollute the global namespace */

		display: flex;
		flex-wrap: nowrap;
		width: 100%;
		border-radius: var(--_input-group-border-radius);
		border: var(--_input-group-border-width, 1px) solid var(--_input-group-border-color, #ccc);
	}

	.input-group:has(:global([data-alignment|='block'])) {
		display: grid;
	}

	.input-group:has(:global(:where(input, select, textarea):focus-visible)) {
		outline: var(--_input-group-focus-outline-width, 1px) solid
			var(--_input-group-focus-outline-color, var(--clr-brand-400, oklch(0.511 0.246 290)));
	}

	.input-group > :global(:where(input, select, textarea)) {
		--_input-border-width: 0px;
		--_input-border-color: transparent;
		--_input-border-radius: 0px;
		--_input-width: 100%;
		--_input-padding: var(--_input-group-padding);
		--_input-focus-outline-width: 0px;
		--_input-focus-outline-color: transparent;

		--_textarea-border-width: 0px;
		--_textarea-border-color: transparent;
		--_textarea-border-radius: 0px;
		--_textarea-padding: var(--_input-group-padding);
		--_textarea-focus-outline-width: 0px;
		--_textarea-focus-outline-color: transparent;
		--_textarea-resize: none;
		
		anchor-name: --input-group-input;
	}
</style>
