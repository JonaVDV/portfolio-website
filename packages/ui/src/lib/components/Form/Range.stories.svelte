<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Range from './Range.svelte';

	const { Story } = defineMeta({
		title: 'Components/Form/Range',
		component: Range,
		tags: ['autodocs'],
		args: {
			min: 0,
			max: 100,
			step: 1,
			value: 50,
			label: 'Select a value',
			disabled: false
		}
	});
</script>

<Story name="Range input" />
