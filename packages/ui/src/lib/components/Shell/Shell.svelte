<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		modules?: ('content' | 'sidebar' | 'header')[];
		header?: Snippet;
		sidebar?: Snippet;
		children?: Snippet;
	}

	let { modules = ['content'], sidebar, children, header }: Props = $props();
</script>

<div class={['primary-layout', modules.includes('sidebar') ? 'with-sidebar' : '']}>
	{#if modules.includes('header')}
		{@render header?.()}
	{/if}
	{#if !modules.includes('sidebar') && !modules.includes('content')}
		{@render children?.()}
	{/if}
	{#if modules.includes('sidebar')}
		{@render sidebar?.()}
	{/if}
	{#if modules.includes('content')}
		{@render children?.()}
	{/if}
</div>

<style lang="scss">
	:global {
		.primary-layout > *,
		.primary-layout-sidebar > *:not(aside),
		.full-width > * {
			grid-column: content;
		}
	}
	.primary-layout,
	.full-width {
		--minimum-content-padding: 2rem;

		/** TRACK WIDTHS **/
		--full-max-width: 1fr;
		--content-max-width: 65ch;

		/** TRACK SIZES **/
		--full: minmax(var(--minimum-content-padding), 1fr);
		--content: min(var(--content-max-width), 100% - var(--minimum-content-padding) * 2);

		display: grid;
		/* prettier-ignore */
		grid-template-columns: 
        [full-width-start]
        var(--full)
            [content-start]
            var(--content)
            [content-end]
        var(--full)
        [full-width-end];
	}
	.with-sidebar {
		/* prettier-ignore */
		grid-template-columns:
        [sidebar] auto 
        [full-width-start] 
            var(--full) 
                [content-start] 
                    var(--content) 
                [content-end] 
            var(--full) 
        [full-width-end];
	}

	.with-sidebar > :global(aside) {
		grid-column: sidebar;
	}

	/** CLASSES **/
	:global {
		.full {
			grid-column: full-width;
		}
		.full-start {
			grid-column-start: full-width-start;
		}
		.full-end {
			grid-column-end: full-width-end;
		}

		.content {
			grid-column: content;
		}
		.content-start {
			grid-column-start: content-start;
		}
		.content-end {
			grid-column-end: content-end;
		}

		.full-width {
			grid-column: full-width;
		}
		.full-content,
		.full-content-nopadding {
			grid-column: full-width;
		}
		.full-content {
			padding-inline: var(--minimum-content-padding);
		}
	}
</style>
