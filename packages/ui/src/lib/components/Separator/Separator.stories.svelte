<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Separator from './Separator.svelte';

	const { Story } = defineMeta({
		title: 'Components/Separator',
		component: Separator,
		argTypes: {
			orientation: {
				description: 'The orientation of the separator. Can be either horizontal or vertical.'
			}
		},
		tags: ['autodocs']
	});
</script>

<Story name="Default"></Story>
<Story name="Vertical" args={{ orientation: 'vertical' }} />
