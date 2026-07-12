<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Sheet from './Sheet.svelte';
	import { Button } from '$components/Button';
	import { Heading } from '$components/Heading';
	import { Input } from '$components/Form';
	import { Text } from '$components/Text';
	import Label from '$components/Form/Label/Label.svelte';

	const { Story } = defineMeta({
		title: 'Components/Sheet',
		component: Sheet
	});
</script>

<Story name="Default">
	{#snippet template()}
		<Sheet side="right" open>
			{#snippet trigger({ triggerProps })}
				<Button {...triggerProps} variant="primary">Open Sheet</Button>
			{/snippet}

			{#snippet header()}
				<Heading level="h2">Edit profile</Heading>
				<Text variant="muted">
					Make changes to your profile here. Click save when you're done..
				</Text>
			{/snippet}
			<div class="form-group">
				<Label for="name">Name</Label>
				<Input id="name" placeholder="Type something..." />
			</div>
			<div class="form-group">
				<Label for="email">Email</Label>
				<Input id="email" placeholder="Type your email..." />
			</div>
			{#snippet footer()}
				<Button variant="primary" --button-width="100%">Save Changes</Button>
				<Button variant="secondary" --button-width="100%">Close</Button>
			{/snippet}
		</Sheet>
	{/snippet}
</Story>

<Story name="Top Sheet">
	{#snippet template()}
		<Sheet side="top" open>
			{#snippet trigger({ triggerProps })}
				<Button {...triggerProps} variant="primary">Open Sheet</Button>
			{/snippet}

			{#snippet header()}
				<Heading level="h2">Edit profile</Heading>
				<Text variant="muted">
					Make changes to your profile here. Click save when you're done..
				</Text>
			{/snippet}
			<div class="form-group">
				<Label for="name">Name</Label>
				<Input id="name" placeholder="Type something..." />
			</div>
			<div class="form-group">
				<Label for="email">Email</Label>
				<Input id="email" placeholder="Type your email..." />
			</div>
			{#snippet footer()}
				<Button variant="primary" --button-width="100%">Save Changes</Button>
				<Button variant="secondary" --button-width="100%">Close</Button>
			{/snippet}
		</Sheet>
	{/snippet}
</Story>

<Story name="Bottom Sheet">
	{#snippet template()}
		<Sheet side="bottom" open>
			{#snippet trigger({ triggerProps })}
				<Button {...triggerProps} variant="primary">Open Sheet</Button>
			{/snippet}

			{#snippet header()}
				<Heading level="h2">Edit profile</Heading>
				<Text variant="muted">
					Make changes to your profile here. Click save when you're done..
				</Text>
			{/snippet}
			<div class="form-group">
				<Label for="name">Name</Label>
				<Input id="name" placeholder="Type something..." />
			</div>
			<div class="form-group">
				<Label for="email">Email</Label>
				<Input id="email" placeholder="Type your email..." />
			</div>
			{#snippet footer()}
				<Button variant="primary" --button-width="100%">Save Changes</Button>
				<Button variant="secondary" --button-width="100%">Close</Button>
			{/snippet}
		</Sheet>
	{/snippet}
</Story>

<Story name="Left Sheet">
	{#snippet template()}
		<Sheet side="left" open>
			{#snippet trigger({ triggerProps })}
				<Button {...triggerProps} variant="primary">Open Sheet</Button>
			{/snippet}

			{#snippet header()}
				<Heading level="h2">Edit profile</Heading>
				<Text variant="muted">
					Make changes to your profile here. Click save when you're done..
				</Text>
			{/snippet}
			<div class="form-group">
				<Label for="name">Name</Label>
				<Input id="name" placeholder="Type something..." />
			</div>
			<div class="form-group">
				<Label for="email">Email</Label>
				<Input id="email" placeholder="Type your email..." />
			</div>
			{#snippet footer()}
				<Button variant="primary" --button-width="100%">Save Changes</Button>
				<Button variant="secondary" --button-width="100%">Close</Button>
			{/snippet}
		</Sheet>
	{/snippet}
</Story>

<!--
	A full-width top/bottom sheet is usually far wider than its content should be.
	Wrap each section in `.layout` to centre the content to --content-max-width
	(65ch) while the surface itself still spans edge to edge.
-->
<Story name="Bottom Sheet (centered content)">
	{#snippet template()}
		<Sheet side="bottom" open>
			{#snippet trigger({ triggerProps })}
				<Button {...triggerProps} variant="primary">Open Sheet</Button>
			{/snippet}

			{#snippet header()}
				<div class="layout">
					<Heading level="h2">Edit profile</Heading>
					<Text variant="muted">
						Make changes to your profile here. Click save when you're done..
					</Text>
				</div>
			{/snippet}
			<div class="layout">
				<div class="form-group">
					<Label for="name-c">Name</Label>
					<Input id="name-c" placeholder="Type something..." />
				</div>
				<div class="form-group">
					<Label for="email-c">Email</Label>
					<Input id="email-c" placeholder="Type your email..." />
				</div>
			</div>
			{#snippet footer()}
				<div class="layout">
					<Button variant="primary">Save Changes</Button>
					<Button variant="secondary">Close</Button>
				</div>
			{/snippet}
		</Sheet>
	{/snippet}
</Story>

<style>
	.form-group {
		display: grid;
		gap: 0.5rem;
	}
</style>
