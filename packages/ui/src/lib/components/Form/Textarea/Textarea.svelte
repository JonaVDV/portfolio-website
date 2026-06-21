<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	interface Props extends HTMLTextareaAttributes {
		value?: string;
	}

	let { value = $bindable(''), ...rest }: Props = $props();
</script>

<!--
@component Textarea

A multiline text input for forms. Shares the same CSS custom property API as `Input` so they can be themed together. Uses `field-sizing: content` to grow with its content automatically.
-->

<textarea bind:value {...rest}></textarea>

<style>
	textarea {
		--_textarea-border-color: var(--textarea-border-color, var(--input-border-color, #ccc));
		--_textarea-border-radius: var(--textarea-border-radius, var(--input-border-radius, 4px));
		--_textarea-border-width: var(--textarea-border-width, var(--input-border-width, 1px));
		--_textarea-padding: var(--textarea-padding, var(--input-padding, 0.5rem 0.75rem));
		--_textarea-text-color: var(--textarea-text-color, var(--input-text-color, currentColor));
		--_textarea-resize: var(--textarea-resize, vertical);
		--_textarea-min-block-size: var(--textarea-min-block-size, 4lh);


		--_textarea-focus-outline-width: var(
			--textarea-focus-outline-width,
			var(--input-focus-outline-width, 1px)
		);
		--_textarea-focus-outline-color: var(
			--textarea-focus-outline-color,
			var(--input-focus-outline-color, var(--clr-brand-400, oklch(0.511 0.246 290)))
		);
		--_textarea-background: var(--textarea-background, var(--input-background, var(--clr-surface-000, #fff)));

		border: var(--_textarea-border-width) solid var(--_textarea-border-color);
		border-radius: var(--_textarea-border-radius);
		padding: var(--_textarea-padding);
		color: var(--_textarea-text-color);
		resize: var(--_textarea-resize);
		background-color: var(--_textarea-background);
		/* Grows with content; falls back gracefully in older browsers */
		field-sizing: content;
		min-block-size: var(--_textarea-min-block-size);

		&:hover {
			--_textarea-border-color: var(
				--textarea-border-hover-color,
				var(--input-border-hover-color, #999)
			);
			background-color: var(
				--textarea-background-hover,
				var(--input-background-hover, oklch(from var(--_textarea-background) calc(l - 0.02) c h))
			);
		}

		&:focus-visible {
			outline: var(--_textarea-focus-outline-width, 1px) solid var(--_textarea-focus-outline-color, var(--clr-brand-400, oklch(0.511 0.246 290)));
			outline-offset: 2px;
			--_textarea-border-color: transparent;
		}

		&:disabled {
			--_textarea-background: var(--textarea-background-disabled, var(--input-background-disabled, oklch(from var(--_textarea-background) calc(l - 0.03) c h)));
			cursor: not-allowed;
			opacity: 0.6;
		}

		&[aria-invalid='true'] {
			--_textarea-border-invalid-color: var(--textarea-border-invalid-color, var(--input-border-invalid-color, oklch(0.55 0.22 25)));
			--_textarea-border-color: var(--_textarea-border-invalid-color);
			--_textarea-focus-outline-color: var(--textarea-focus-outline-invalid-color, var(--input-focus-outline-invalid-color, var(--_textarea-border-invalid-color)));
		}

		&:user-valid {
			--_textarea-border-color: var(--textarea-border-valid-color, var(--input-border-valid-color, oklch(0.55 0.17 145)));
		}
	}
</style>
