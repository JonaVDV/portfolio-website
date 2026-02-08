<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes, HTMLDetailsAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLAttributes<HTMLDetailsElement>, 'open' | 'children' | 'title'> {
		/**The title of the accordion. this can be a string or a Svelte snippet. for either rich markup or just text.*/
		title: Snippet | string;
		/**The content of the accordion.*/
		children?: Snippet;
		/**Whether the accordion is open. */
		open?: boolean;
		/**The name attribute for grouping accordions. */
		name?: string;
	}

	let { title, children, name, open = $bindable(false) }: Props = $props();
</script>

<!-- 

@component An accordion component that can be used to show and hide content. it uses the native details and summary elements for accessibility and functionality.

When using multiple accordions together, they will open independently by default. 
if you want to have only one accordion open at a time, you can use the name attribute on the details element and set it to the same value for all accordions that you want to be grouped together.
However, this should either be used sparingly or not at all since it can have [negative accessibility implications](https://www.w3.org/TR/wai-aria-practices-1.2/#accordion)

@example
    ```
    <Accordion title="Section 1">
        <p>This is the content of section 1.</p>
    </Accordion>

    or with some rich html

    <Accordion>
        {#snippet title()}
            <h3>Section 1</h3>
        {/snippet}

        {#snippet children()}
            <p>This is the content of section 1.</p>
        {/snippet}
    </Accordion>
    ```

-->

<details {name} bind:open>
	<summary class="flex-group | space-between">
		{#if typeof title === 'string'}
			{title}
		{:else}
			{@render title()}
		{/if}
	</summary>
	<div class="accordion-content">
		{@render children?.()}
	</div>
</details>

<style lang="scss">
	@use '../../styles/abstracts/' as *;

	details {
		border: 1px solid $clr-surface-200;
		background-color: $clr-surface-000;
		border-radius: 4px;

		::marker {
			content: '';
			display: none;
		}
	}

	details ::details-content {
		@starting-style {
		}

		transition-behavior: allow-discrete;
		transition: all 300ms ease;
	}

	summary {
		&::after {
			color: inherit;
			content: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevrons-up-down-icon lucide-chevrons-up-down"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>');
			// makes sure that the icons is as small as the text
			display: flex;
		}
	}
</style>
