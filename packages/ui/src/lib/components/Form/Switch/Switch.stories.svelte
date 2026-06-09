<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Switch from './Switch.svelte';
	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		title: 'Components/Form/Switch',
		component: Switch,
		tags: ['autodocs']
	});
</script>

<Story name="Default Switch">
	{#snippet template()}
		<Switch />
	{/snippet}
</Story>
