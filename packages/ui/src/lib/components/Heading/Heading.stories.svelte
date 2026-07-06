<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Heading from './Heading.svelte';

	const { Story } = defineMeta({
		title: 'Components/Heading',
		component: Heading,
		tags: ['autodocs']
	});
</script>

<Story name="Heading 1" args={{ level: 'h1' }}>The quick brown fox jumps over the lazy dog.</Story>

<Story name="Heading 2" args={{ level: 'h2' }}>The quick brown fox jumps over the lazy dog.</Story>

<Story name="Heading 3" args={{ level: 'h3' }}>The quick brown fox jumps over the lazy dog.</Story>

<Story name="Scale">
	{#snippet template()}
		<Heading level="h1">Heading level 1</Heading>
		<Heading level="h2">Heading level 2</Heading>
		<Heading level="h3">Heading level 3</Heading>
		<Heading level="h4">Heading level 4</Heading>
		<Heading level="h5">Heading level 5</Heading>
		<Heading level="h6">Heading level 6</Heading>
	{/snippet}
</Story>

<Story name="Decoupled look from semantics">
	{#snippet template()}
		<Heading level="h3" variant="h1">An h3 in the outline, sized like an h1.</Heading>
	{/snippet}
</Story>

<Story name="Semantics without the look (variant='none')">
	{#snippet template()}
		<Heading level="h1" variant="none">An h1 for the outline, styled as base text.</Heading>
	{/snippet}
</Story>
