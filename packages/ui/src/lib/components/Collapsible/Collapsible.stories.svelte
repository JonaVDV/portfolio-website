<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Collapsible from './Collapsible.svelte';

	const { Story } = defineMeta({
		title: 'Components/Collapsible',
		component: Collapsible,
		tags: ['autodocs']
	});
</script>

<Story name="Default">
	{#snippet template()}
		<Collapsible trigger="Show more">
			<p>This content is revealed when the trigger is activated.</p>
		</Collapsible>
	{/snippet}
</Story>

<Story name="Open by default">
	{#snippet template()}
		<Collapsible open trigger="Already open">
			<p>Starts expanded.</p>
		</Collapsible>
	{/snippet}
</Story>

<Story name="Rich trigger">
	{#snippet template()}
		<Collapsible>
			{#snippet trigger()}
				<strong>Advanced settings</strong>
			{/snippet}
			<p>Any markup works in the trigger.</p>
		</Collapsible>
	{/snippet}
</Story>
