<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Heading from './Heading.svelte';
	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		title: 'Example/Heading',
		component: Heading,
		tags: ['autodocs']
	});
</script>

<Story name="Heading 1" args={{ level: 'h1' }}>The quick brown fox jumps over the lazy dog.</Story>

<Story name="Heading 2" args={{ level: 'h2' }}>The quick brown fox jumps over the lazy dog.</Story>

<Story name="Heading 3" args={{ level: 'h3' }}>The quick brown fox jumps over the lazy dog.</Story>

<Story name="Heading 3 with size of Heading 1" args={{ level: 'h3', sizeOf: 'h1' }}>
	The quick brown fox jumps over the lazy dog.
</Story>
