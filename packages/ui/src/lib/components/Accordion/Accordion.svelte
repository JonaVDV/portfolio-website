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
However, this should either be used sparingly or not at all since it can have 

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

<style>
	details {
		/* --- Private Scoped Props --- */
		--_accordion-padding: var(--accordion-padding, 1rem);
		--_accordion-border-radius: var(--accordion-border-radius, 0.5rem);
		--_accordion-background: var(--accordion-background, var(--clr-surface-000));
		--_accordion-border-color: var(--accordion-border-color, var(--clr-surface-200));
		--_accordion-title-color: var(--accordion-title-color, inherit);
		--_accordion-transition-duration: var(--accordion-transition-duration, 300ms);
		--_accordion-transition-easing: var(--accordion-transition-easing, ease-in-out);

		display: block;
		border: 1px solid var(--_accordion-border-color);
		background-color: var(--_accordion-background);
		border-radius: var(--_accordion-border-radius);
		overflow: hidden;
		isolation: isolate;

		::marker {
			content: '';
			display: none;
		}

		&[open] {
			summary::after {
				rotate: 180deg;
			}
		}
	}

	details::details-content {
		block-size: 0;
		transition:
			block-size var(--_accordion-transition-duration) var(--_accordion-transition-easing),
			content-visibility var(--_accordion-transition-duration) var(--_accordion-transition-easing);
		transition-behavior: allow-discrete;
	}

	details:open::details-content {
		block-size: auto;
	}

	summary {
		padding: var(--_accordion-padding);
		cursor: pointer;
		font-weight: 600;
		color: var(--_accordion-title-color);
		list-style: none; /* Safari fix */
		user-select: none;

		&:hover {
			background-color: oklch(from var(--_accordion-background) calc(l - 0.02) c h);
		}

		&::after {
			color: inherit;
			content: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>');
			display: flex;
			transition: rotate var(--_accordion-transition-duration) var(--_accordion-transition-easing);
		}
	}

	.accordion-content {
		padding: var(--_accordion-padding);
		padding-block-start: 0; /* Padding is owned by the summary/container */
	}
</style>
