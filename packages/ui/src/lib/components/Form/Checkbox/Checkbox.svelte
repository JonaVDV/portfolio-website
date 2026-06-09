<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cubicInOut } from 'svelte/easing';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { draw } from 'svelte/transition';

	interface Props extends HTMLInputAttributes {
		checkmark: Snippet;
	}

	let { checked = $bindable(false), checkmark, ...rest }: Props = $props();
</script>

<div>
	<input type="checkbox" bind:checked {...rest} />
	<noscript>
		<style>
			input[type='checkbox']:checked {
				background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon lucide lucide-check"><path d="M20 6 9 17l-5-5"></path></svg>');
			}
		</style>
	</noscript>
	<div class="checked">
		{#if checkmark}
			{@render checkmark()}
		{:else if checked}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide-icon lucide lucide-check"
				><path transition:draw={{ duration: 200, easing: cubicInOut }} d="M20 6 9 17l-5-5"></path>
			</svg>
		{/if}
	</div>
</div>

<style lang="scss">
	input[type='checkbox'] {
		--checkbox-border: 1px solid var(--checkbox-border-color, #ccc);
		--checkbox-size: 1.25rem;
		width: var(--checkbox-size);
		aspect-ratio: 1/1;
		appearance: none;
		border: var(--checkbox-border);
		anchor-name: --checkbox;
		&:hover {
			--checkbox-border: 1px solid var(--checkbox-border-hover-color, #ccc);
		}

		&:focus-visible {
			--checkbox-border: 1px solid var(--checkbox-border-focus-color, #ccc);
			outline: 0;
		}

		&:checked {
			--checkbox-border: 1px solid var(--checkbox-border-checked-color, #ccc);
		}
	}

	.checked {
		display: inline-flex;
		position: absolute;
		position-anchor: --checkbox;
		position-area: center center;
		pointer-events: none;
	}
</style>
