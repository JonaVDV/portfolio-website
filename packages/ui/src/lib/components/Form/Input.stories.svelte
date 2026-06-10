<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import type { HTMLInputTypeAttribute } from 'svelte/elements';
	import Input from './Input.svelte';
	const { Story } = defineMeta({
		title: 'Components/Form/Input',
		component: Input,
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