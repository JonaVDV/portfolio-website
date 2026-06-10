<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import RadioGroup from './RadioGroup.svelte';
	import Radio from './Radio.svelte';

	const { Story } = defineMeta({
		title: 'Components/Form/Radio',
		component: RadioGroup,
		tags: ['autodocs']
	});
</script>

<script lang="ts">
	let selected = $state('');
	let selectedH = $state('');
</script>

<Story name="Vertical group">
	{#snippet template()}
		<RadioGroup name="color" bind:value={selected}>
			<Radio value="red">Red</Radio>
			<Radio value="green">Green</Radio>
			<Radio value="blue">Blue</Radio>
		</RadioGroup>
		<p>Selected: {selected || 'none'}</p>
	{/snippet}
</Story>

<Story name="Horizontal group">
	{#snippet template()}
		<RadioGroup name="size" bind:value={selectedH} orientation="horizontal">
			<Radio value="sm">Small</Radio>
			<Radio value="md">Medium</Radio>
			<Radio value="lg">Large</Radio>
		</RadioGroup>
		<p>Selected: {selectedH || 'none'}</p>
	{/snippet}
</Story>

<Story name="Disabled option">
	{#snippet template()}
		<RadioGroup name="plan">
			<Radio value="free">Free</Radio>
			<Radio value="pro">Pro</Radio>
			<Radio value="enterprise" disabled>Enterprise (contact us)</Radio>
		</RadioGroup>
	{/snippet}
</Story>
