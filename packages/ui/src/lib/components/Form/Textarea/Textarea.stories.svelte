<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Textarea from '../Textarea.svelte';

	const { Story } = defineMeta({
		title: 'Components/Form/Textarea',
		component: Textarea,
		tags: ['autodocs'],
		argTypes: {
			placeholder: { control: 'text' },
			disabled: { control: 'boolean' },
			rows: { control: 'number' }
		}
	});
</script>

<Story name="Default">
	{#snippet template()}
		<Textarea placeholder="Type something..." />
	{/snippet}
</Story>

<Story name="Disabled">
	{#snippet template()}
		<Textarea placeholder="Disabled" disabled />
	{/snippet}
</Story>
