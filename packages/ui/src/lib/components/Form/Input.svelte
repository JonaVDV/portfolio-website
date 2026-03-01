<script lang="ts">
	import type { HTMLAttributes, HTMLInputTypeAttribute } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLInputElement> {
		// type?:
	}

	let {}: Props = $props();
</script>

<!-- 
@component Text

A text input field for forms. This component encapsulates the styling and behavior of all text based inputs, like password, email, text, etc. It should be used in conjunction with the `Field` component to ensure proper form handling and validation.

-->

<input />

<style lang="scss">
	@use '../../styles/abstracts/' as *;
	input {
		padding: var(--input-padding, 0.25rem 1rem);
		border: var(--input-border-width, 1px) solid var(--input-border-color, $clr-surface-200);
	}
</style>
