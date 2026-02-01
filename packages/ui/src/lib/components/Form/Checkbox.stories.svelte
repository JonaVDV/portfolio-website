<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Checkbox from './Checkbox.svelte';

	const { Story } = defineMeta({
		component: Checkbox,
		tags: ['autodocs'],
		title: 'Components/Form/Checkbox'
	});
</script>

<Story name="Default">
	<Checkbox />
</Story>
