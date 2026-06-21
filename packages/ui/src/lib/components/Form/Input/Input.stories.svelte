<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import type { HTMLInputTypeAttribute } from 'svelte/elements';
	import Input from './Input.svelte';
	const { Story } = defineMeta({
		title: 'Components/Form/Input',
		component: Input,
		parameters: {
			layout: 'centered'
		},
		tags: ['autodocs'],
		argTypes: {
			type: {
				control: { type: 'select' },
				options: [
					'text',
					'password',
					'email',
					'number',
					'search',
					'tel',
					'url',
					'date',
					'datetime-local',
					'month',
					'week',
					'time',
					'color',
					'hidden'
				] satisfies HTMLInputTypeAttribute[]
			},
			placeholder: { control: 'text' }
		}
	});
</script>

<script>
	// oxlint-disable-next-line import/no-unassigned-import
	import './Input.variants.css';
</script>

<Story name="Text input" args={{ type: 'text', placeholder: 'Type something...' }}></Story>

<Story name="Password input" args={{ type: 'password', placeholder: 'Enter your password' }}
></Story>

<Story name="Email input" args={{ type: 'email', placeholder: 'Enter your email' }}></Story>

<Story name="Number input" args={{ type: 'number', placeholder: 'Enter a number' }}></Story>

<Story name="Search input" args={{ type: 'search', placeholder: 'Search...' }}></Story>

<Story name="Tel input" args={{ type: 'tel', placeholder: 'Enter your phone number' }}></Story>

<Story name="URL input" args={{ type: 'url', placeholder: 'Enter a URL' }}></Story>

<Story name="Date input" args={{ type: 'date', placeholder: 'Select a date' }}></Story>

<Story
	name="Datetime-local input"
	args={{ type: 'datetime-local', placeholder: 'Select a date and time' }}
></Story>

<Story name="Month input" args={{ type: 'month', placeholder: 'Select a month' }}></Story>

<Story name="Week input" args={{ type: 'week', placeholder: 'Select a week' }}></Story>

<Story name="Time input" args={{ type: 'time', placeholder: 'Select a time' }}></Story>

<Story name="Color input" args={{ type: 'color', placeholder: 'Select a color' }}></Story>

<Story name="Hidden input" args={{ type: 'hidden', placeholder: 'Hidden input' }}></Story>

<!-- ── States ─────────────────────────────────────────────────────────────── -->

<Story
	name="States / Disabled"
	args={{ type: 'text', placeholder: 'Disabled input', disabled: true }}
></Story>

<Story name="States / Invalid">
	{#snippet template()}
		<Input type="text" value="bad@value" aria-invalid="true" />
	{/snippet}
</Story>

<!-- :user-valid fires only after the user has interacted with the field — type something and blur -->
<Story name="States / Valid">
	{#snippet template()}
		<Input type="email" placeholder="Enter a valid email and blur" required />
	{/snippet}
</Story>

<!-- ── Customization ──────────────────────────────────────────────────────── -->

<Story name="Customization / Custom background">
	{#snippet template()}
		<Input
			type="text"
			placeholder="Dark surface"
			style="
				--input-background: oklch(0.2 0.01 260);
				--input-text-color: oklch(0.95 0 0);
				--input-placeholder-color: oklch(0.6 0 0);
				--input-border-color: oklch(0.35 0.01 260);
				--input-border-hover-color: oklch(0.5 0.01 260);
			"
		/>
	{/snippet}
</Story>

<Story name="Customization / Custom invalid color">
	{#snippet template()}
		<Input
			type="text"
			value="invalid value"
			aria-invalid="true"
			style="--input-border-invalid-color: oklch(0.55 0.22 330);"
		/>
	{/snippet}
</Story>

<Story name="Customization / Custom focus ring">
	{#snippet template()}
		<Input
			type="text"
			placeholder="Focus me"
			style="--input-focus-outline-color: oklch(0.65 0.2 30); --input-focus-outline-width: 2px;"
		/>
	{/snippet}
</Story>
