<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Item from './Item.svelte';
	import Heading from '$components/Heading/Heading.svelte';
	import Separator from '$components/separator/Separator.svelte';
	import CheckIcon from '~icons/lucide/badge-check';
	import Button from '$components/Button/Button.svelte';
	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		title: 'Components/Item',
		component: Item,
		tags: ['autodocs']
	});
</script>

<Story name="Default">
	{#snippet template()}
		<div class="primary-layout">
			<Item>
				<Heading level="h3" sizeOf="h4">Item Title</Heading>
				<p>This is an example of an item component. It can contain any content and actions.</p>
			</Item>
		</div>
	{/snippet}
</Story>

<Story name="With actions">
	{#snippet template()}
		<div class="primary-layout">
			<Item>
				<Heading level="h3" sizeOf="h4">Item Title</Heading>
				<p>This is an example of an item component with actions.</p>
				{#snippet actions()}
					<button>Edit</button>
					<button>Delete</button>
				{/snippet}
			</Item>
		</div>
	{/snippet}
</Story>

<Story name="With media">
	{#snippet template()}
		<div class="primary-layout">
			<Item>
				{#snippet media()}
					<img style="border-radius: 50%;" src="https://picsum.photos/200" alt="placeholder" />
				{/snippet}
				<div>
					<Heading level="h3" sizeOf="h4">Item Title</Heading>
					<p>This is an example of an item component with media.</p>
				</div>
			</Item>
		</div>
	{/snippet}
</Story>

<Story name="With header">
	{#snippet template()}
		<div class="primary-layout">
			<Item>
				{#snippet header()}
					<Heading level="h3" sizeOf="h4">Item Header</Heading>
				{/snippet}
				{#snippet media()}
					<img style="border-radius: 50%;" src="https://picsum.photos/200" alt="placeholder" />
				{/snippet}
				<p>The header spans the full width and stacks above the media and content.</p>
			</Item>
		</div>
	{/snippet}
</Story>

<Story name="As anchor">
	{#snippet template()}
		<div class="primary-layout">
			<Item as="a" href="https://example.com" target="_blank" rel="noopener noreferrer">
				<Heading level="h3" sizeOf="h4">Item Title</Heading>
				<p>This item is rendered as an anchor tag. Styles apply normally.</p>
			</Item>
		</div>
	{/snippet}
</Story>
<Story name="Grouping items">
	{#snippet template()}
		<div class="primary-layout">
			<div class="">
				{#each { length: 3 } as _, index (index)}
					<Item --align-self="start">
						{#snippet media()}
							<CheckIcon />
						{/snippet}
						<Heading level="h3" sizeOf="h4">Item {index + 1}</Heading>
						<p>This is item {index + 1} in a group.</p>

						{#snippet actions()}
							<Button>action</Button>
						{/snippet}
					</Item>
					{#if index !== 3 - 1}
						<Separator --separator-margin="2rem" />
					{/if}
				{/each}
			</div>
		</div>
	{/snippet}
</Story>
