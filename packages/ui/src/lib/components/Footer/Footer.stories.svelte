<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Footer from './Footer.svelte';
	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		title: 'Example/Footer',
		component: Footer,
		tags: ['autodocs']
	});
</script>

<Story name="Primary Footer" />
