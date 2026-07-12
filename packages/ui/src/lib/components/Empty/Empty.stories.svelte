<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Empty from './Empty.svelte';
	import { Button } from '$components/Button';
	import PlusIcon from '~icons/lucide/plus';
	import { Avatar } from '$components/Avatar';
	import { Heading } from '$components/Heading';
	import Text from '$components/Text/Text.svelte';

	const { Story } = defineMeta({
		title: 'Components/Empty',
		component: Empty,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered'
		}
	});
</script>

<Story name="Avatar">
	{#snippet template()}
		<Empty>
			{#snippet media()}
				<Avatar src="https://github.com/shadcn.png" alt="User Avatar">
					{#snippet fallback()}
						LR
					{/snippet}
				</Avatar>
			{/snippet}
			<Heading level="h2">User Offline</Heading>
			<Text variant="muted">
				This user is currently offline. You can leave a message to notify them or try again later.
			</Text>
			<Button size="small" variant="primary">Compose a message</Button>
		</Empty>
	{/snippet}
</Story>

<Story name="Avatar group">
	{#snippet template()}
		<Empty
			--empty-border="1px dashed var(--clr-surface-300, currentColor)"
			--empty-background="var(--clr-surface-100, transparent)"
		>
			{#snippet media()}
				<div class="flex-group avatar-group">
					{#each { length: 3 } as _, i}
						<Avatar src={`https://github.com/shadcn.png`} alt={`User Avatar ${i + 1}`}>
							{#snippet fallback()}
								LR
							{/snippet}
						</Avatar>
					{/each}
				</div>
			{/snippet}

			<Heading level="h2">No Team Members</Heading>
			<Text variant="muted">Invite your team to collaborate on this project.</Text>
			<Button size="small" variant="primary"><PlusIcon />Invite team members</Button>
		</Empty>
	{/snippet}
</Story>

<style>
	.avatar-group {
		gap: 0;

		& > :global(*:not(:first-child)) {
			margin-inline-start: -1rem;
		}
	}
</style>
