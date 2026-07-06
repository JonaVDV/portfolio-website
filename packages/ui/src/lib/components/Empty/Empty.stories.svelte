<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Empty from './Empty.svelte';
	import { Button } from '$components/Button';
	import Inbox from '~icons/lucide/inbox';

	const { Story } = defineMeta({
		title: 'Components/Empty',
		component: Empty,
		tags: ['autodocs']
	});
</script>

<Story name="Default">
	<Empty title="No results" description="Try adjusting your search or filters." />
</Story>

<Story name="With media and action">
	<Empty title="Inbox empty" description="New messages will show up here.">
		{#snippet media()}
			<Inbox />
		{/snippet}
		<Button variant="outline">Refresh</Button>
	</Empty>
</Story>
