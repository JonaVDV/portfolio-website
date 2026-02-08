<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Accordion from './Accordion.svelte';
	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		title: 'Components/Accordion',
		component: Accordion,
		tags: ['autodocs']
	});
</script>

<Story name="Default Accordion">
	{#snippet template()}
		<Accordion>
			{#snippet title()}
				test
			{/snippet}
			{#snippet children()}
				<p>This is the content of section 1.</p>
			{/snippet}
		</Accordion>
	{/snippet}
</Story>

<Story name="Multiple Accordions">
	{#snippet template()}
		<div role="group">
			<Accordion name="accordion1">
				{#snippet title()}
					Section 1
				{/snippet}
				{#snippet children()}
					<p>This is the content of section 1.</p>
				{/snippet}
			</Accordion>

			<Accordion name="accordion1">
				{#snippet title()}
					Section 2
				{/snippet}
				{#snippet children()}
					<p>This is the content of section 2.</p>
				{/snippet}
			</Accordion>

			<Accordion name="accordion1">
				{#snippet title()}
					Section 3
				{/snippet}
				{#snippet children()}
					<p>This is the content of section 3.</p>
				{/snippet}
			</Accordion>
		</div>
	{/snippet}
</Story>
