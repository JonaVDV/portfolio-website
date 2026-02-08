<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Button from './Button.svelte';
	import { fn } from 'storybook/test';

	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		title: 'Components/Button',
		component: Button,
		tags: ['autodocs'],
		argTypes: {
			// '--button-background': { control: 'color' },
			style: { control: 'object' },
			variant: {
				control: { type: 'select' },
				options: ['stripped', 'primary']
			},
			as: {
				control: {
					type: 'inline-radio'
				}
			},
			children: {
				control: 'text'
			}
		},
		args: {
			onclick: fn(),
			style: {}
		}
	});
</script>

<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
<Story
	name="Stripped Button"
	args={{
		variant: 'stripped'
	}}
>
	test
</Story>

<Story
	name="Primary Button"
	args={{
		variant: 'primary'
	}}
>
	test
</Story>
