<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Breadcrumbs from './Breadcrumbs.svelte';
	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		title: 'Components/Breadcrumbs',
		component: Breadcrumbs,
		tags: ['autodocs'],
		args: {}
	});
</script>

<Story name="Default">
	<Breadcrumbs>
		<a href="#">Home</a>
		<a href="#">Library</a>
		<a href="#">Data</a>
	</Breadcrumbs>
</Story>
