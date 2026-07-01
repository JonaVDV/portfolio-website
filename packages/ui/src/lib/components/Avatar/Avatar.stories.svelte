<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Avatar from './Avatar.svelte';
	import './Avatar.variants.css';

	const { Story } = defineMeta({
		title: 'Components/Avatar',
		component: Avatar,
		tags: ['autodocs'],
		argTypes: {
			src: {
				description:
					'Image URL. When it loads it covers the fallback; when it fails or is unset, the fallback shows through.',
				control: { type: 'text' }
			},
			alt: {
				description: 'Accessible label, announced regardless of whether the image loads.',
				control: { type: 'text' }
			},
			fallback: {
				description: 'Shown when no image is loaded — initials, an icon, anything.',
				control: { type: 'text' }
			},
			class: {
				description: 'Custom class for the avatar container.',
				control: { type: 'text' }
			}
		},
		parameters: {
			layout: 'centered'
		}
	});
</script>

<Story name="Default">
	{#snippet template(args)}
		{@const { alt, fallback, class: className } = args}
		<Avatar {alt} {fallback} class={className} src={args.src ?? 'https://github.com/shadcn.png'} />
	{/snippet}
</Story>

<Story name="Fallback only">
	{#snippet template()}
		<Avatar alt="Jane Doe">
			{#snippet fallback()}JD{/snippet}
		</Avatar>
	{/snippet}
</Story>

<Story name="Broken image falls back">
	{#snippet template()}
		<Avatar src="https://example.com/does-not-exist.png" alt="@evilrabbit">
			{#snippet fallback()}ER{/snippet}
		</Avatar>
	{/snippet}
</Story>

<Story name="Rounded square">
	{#snippet template()}
		<Avatar --avatar-radius="0.5rem" src="https://github.com/evilrabbit.png" alt="@evilrabbit">
			{#snippet fallback()}ER{/snippet}
		</Avatar>
	{/snippet}
</Story>

<Story name="Custom size">
	{#snippet template()}
		<div style="display: flex; align-items: center; gap: 1rem;">
			{#each ['2rem', '3rem', '4.5rem'] as size (size)}
				<Avatar style="--avatar-size: {size}" src="https://github.com/shadcn.png" alt="@shadcn">
					{#snippet fallback()}CN{/snippet}
				</Avatar>
			{/each}
		</div>
	{/snippet}
</Story>

<Story name="Stack">
	{#snippet template()}
		<div class="avatar-stack">
			<Avatar src="https://github.com/shadcn.png" alt="@shadcn">
				{#snippet fallback()}CN{/snippet}
			</Avatar>
			<Avatar src="https://github.com/leerob.png" alt="@leerob">
				{#snippet fallback()}LR{/snippet}
			</Avatar>
			<Avatar src="https://github.com/evilrabbit.png" alt="@evilrabbit">
				{#snippet fallback()}ER{/snippet}
			</Avatar>
		</div>
	{/snippet}
</Story>

<style>
	/* Overlapping stack — apply to a flex-group wrapper around the avatars.
   Each avatar gets a ring matching the page background so they read as separate. */
	.avatar-stack {
		display: flex;
	}

	.avatar-stack > :global(:not(:first-child)) {
		margin-inline-start: -0.75rem;
	}

	.avatar-stack > :global(*) {
		--avatar-border: 2px solid var(--avatar-stack-ring, Canvas);
	}
</style>
