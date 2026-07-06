<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Text from './Text.svelte';

	const { Story } = defineMeta({
		title: 'Components/Text',
		component: Text,
		tags: ['autodocs'],
		argTypes: {
			as: {
				description: 'The element to render. Drives semantics.',
				control: { type: 'text' }
			},
			variant: {
				description: 'Visual variant. Defaults to `as`; pass "none" for base styling only.',
				control: { type: 'text' }
			}
		}
	});
</script>

<Story name="Default">
	{#snippet template(args)}
		<Text {...args}>The quick brown fox jumps over the lazy dog.</Text>
	{/snippet}
</Story>

<Story name="Element variants">
	{#snippet template()}
		<Text>A default paragraph of body text.</Text>
		<Text as="strong">Strong: important text.</Text>
		<br />
		<Text as="em">Em: stressed emphasis.</Text>
		<br />
		<Text as="small">Small: fine print.</Text>
	{/snippet}
</Story>

<Story name="Design variants">
	{#snippet template()}
		<Text as="p" variant="lead">
			A lead paragraph — larger and lighter, used to introduce a section before the body text
			begins.
		</Text>
		<Text as="p">Regular body text follows the lead and carries the bulk of the content.</Text>
		<Text as="p" variant="muted">Muted text for secondary or supporting information.</Text>
	{/snippet}
</Story>

<Story name="Semantics without the look (variant='none')">
	{#snippet template()}
		<Text as="strong" variant="none">
			A &lt;strong&gt; element for meaning, but styled as plain base text.
		</Text>
	{/snippet}
</Story>
