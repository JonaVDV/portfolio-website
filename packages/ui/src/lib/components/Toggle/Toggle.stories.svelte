<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Toggle from './Toggle.svelte';

	const { Story } = defineMeta({
		title: 'Components/Toggle',
		component: Toggle,
		tags: ['autodocs']
	});
</script>

<Story name="Default">
	{#snippet template()}
		<Toggle>Bold</Toggle>
	{/snippet}
</Story>

<Story name="Pressed">
	{#snippet template()}
		<Toggle pressed>Italic</Toggle>
	{/snippet}
</Story>

<Story name="Sizes">
	{#snippet template()}
		<div class="flex-group" style="align-items: center;">
			<Toggle size="sm">Small</Toggle>
			<Toggle size="md">Medium</Toggle>
			<Toggle size="lg">Large</Toggle>
		</div>
	{/snippet}
</Story>

<Story name="Disabled">
	{#snippet template()}
		<div class="flex-group" style="align-items: center;">
			<Toggle disabled>Off</Toggle>
			<Toggle disabled pressed>On</Toggle>
		</div>
	{/snippet}
</Story>

<!-- A simple group; bind each item's pressed state in your own component. -->
<Story name="Group">
	{#snippet template()}
		<div class="flex-group" role="group" aria-label="Text formatting">
			<Toggle>B</Toggle>
			<Toggle pressed>I</Toggle>
			<Toggle>U</Toggle>
		</div>
	{/snippet}
</Story>
