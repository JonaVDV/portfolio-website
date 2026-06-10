<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Alert from './Alert.svelte';
	import CheckIcon from '~icons/lucide/badge-check';
	import Heading from '$components/Heading/Heading.svelte';
	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		title: 'Components/Alert',
		component: Alert,
		tags: ['autodocs'],
		args: {
			variant: 'default'
		}
	});
</script>

<Story name="Default">
	{#snippet template(args)}
		<Alert {...args}>
			<CheckIcon style="align-self: start;" />
			<div>
				<p class="" style="font-weight: bold;">Alert Title</p>
				<p>This is an alert message. It can contain any content and actions.</p>
			</div>
		</Alert>
	{/snippet}
</Story>

<Story name="Title only">
	{#snippet template(args)}
		<Alert {...args}>
			<CheckIcon />
			<div>
				<p class="" style="font-weight: bold;">Alert Title</p>
			</div>
		</Alert>
	{/snippet}
</Story>

<Story name="With actions">
	{#snippet template(args)}
		<Alert {...args}>
			<CheckIcon style="align-self: start;" />
			<div>
				<p class="" style="font-weight: bold;">Alert Title</p>
				<p>This is an alert message. It can contain any content and actions.</p>
			</div>
			{#snippet actions()}
				<button>Undo</button>
				<button>Dismiss</button>
			{/snippet}
		</Alert>
	{/snippet}
</Story>
